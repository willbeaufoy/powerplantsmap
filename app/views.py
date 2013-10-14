import os, json
import urllib

from flask import render_template, flash, redirect, request, send_from_directory, g, url_for, session
from flask.ext.login import LoginManager, login_user, current_user, login_required, logout_user
from app import app, db, lm
from config import markerspath, markersurl
from forms import LoginForm, MultipleSiteInputForm, MultipleTypeInputForm, MultipleCountryInputForm, MultipleOwnerInputForm, MultipleSubtypeInputForm, MultipleDataSourceInputForm
from models import User, Site, Owner, Country, Type, Subtype, DataSource
import hashlib

@app.before_request
def before_request():
    g.user = current_user

@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

@app.route('/')
def index():
    types = Type.query.filter(Type.name != 'Unknown').order_by(Type.name).all()
    for type in types:
        type.markerurl = markersurl + type.name.replace(' ', '-').lower() + '-marker.png'
    countries = Country.query.filter(Country.name != 'Unknown').order_by(Country.name)
    return render_template('index.html',
        title = 'Home',
        types = types,
        countries = countries)

@app.route('/sites/')
def get_sites():
   country_ids = request.args.getlist('country_id')
   type_ids = request.args.getlist('type_id')
   sites = Site.query.filter(Site.latitude != None, Site.longitude != None)
   sites = sites.filter(Site.country_id.in_(country_ids))
   sites = sites.filter(Site.type_id.in_(type_ids))
   site_data = []
   for site in sites:
      each_site = {}
      each_site['id'] = site.id
      each_site['name'] = site.name
      each_site['type'] = site.type.name
      each_site['subtype'] = site.subtype.name
      each_site['capacity'] = site.capacity
      each_site['installation_year'] = site.installation_year
      each_site['decommission year'] = site.decommission_year
      each_site['address'] = site.address
      each_site['latitude'] = site.latitude
      each_site['longitude'] = site.longitude
      each_site['owner_name'] = site.owner_name
      each_site['url'] = site.url
      each_site['website'] = site.website
      each_site['details'] = site.details
      if os.path.isfile(markerspath + site.type.name.replace(' ', '-').lower() + '-marker.png'):
         each_site['iconurl'] = markersurl + site.type.name.replace(' ', '-').lower() + '-marker.png'
      else:
         each_site['iconurl'] = markersurl + 'default' + '-marker.png'
      site_data.append(each_site)
   json_data = json.dumps(site_data)
   callback = request.args.get('callback')
   return '{0}({1})'.format(callback, json_data)

@app.route('/login', methods = ['GET', 'POST'])
def login():
   if g.user is not None and g.user.is_authenticated():
      return redirect(url_for('admin'))
   form = LoginForm()
   if form.validate_on_submit():
      session['remember_me'] = form.remember_me.data
      flash('Logging in')
      submitted_email = form.email.data
      user = User.query.filter_by(email = submitted_email).first()
      if user is not None:
         p = hashlib.md5()
         p.update(form.password.data)
         p = p.hexdigest()
         if user.password == p:
            remember_me = False
            if 'remember_me' in session:
               remember_me = session['remember_me']
               session.pop('remember_me', None)
            login_user(user, remember = remember_me)
            return redirect(request.args.get('next') or url_for('index'))

   if request.method == 'POST':
      message = 'Wrong details'
   else:
      message = ''
   return render_template('admin/login.html',
      title = 'Login',
      form = form,
      message = message)

@app.route('/admin')
@login_required
def admin():
   return render_template('admin/admin.html',
        title = 'Admin home')

@app.route('/admin/site-input/', methods=['GET', 'POST'])
@login_required
def site_input():
    form = MultipleSiteInputForm()
    if form.validate_on_submit():
        submitted_names = []
        for site in form.data['site']:
            s = Site()
            s.type_id = site['type_id']
            s.subtype_id = site['subtype_id']
            s.owner_id = site['owner_id']
            s.country_id = site['country_id']
            s.name = site['name']
            s.installation_year = site['installation_year']
            s.decommission_year = site['decommission_year']
            s.capacity = site['capacity']
            s.address = site['address']
            s.latitude = site['latitude']
            s.longitude = site['longitude']
            s.website = site['website']
            s.details = site['details']
            db.session.add(s)
            db.session.commit()
            submitted_names.append(s.name)
        return render_template('admin/site-input.html',
            title = 'Site input',
            form = form,
            message = 'Site/s ' + ', '.join(submitted_names) + ' submitted successfully',
            messageclass = 'success')
    return render_template('admin/site-input.html',
        title = 'Site input',
        form = form)

@app.route('/admin/type-input/', methods=['GET', 'POST'])
@login_required
def type_input():
    form = MultipleTypeInputForm()
    if form.validate_on_submit():
        submitted_names = []
        for type in form.data['type']:
            f = Type()
            f.name = type['name']
            f.other_names = type['other_names']
            db.session.add(f)
            db.session.commit()
            submitted_names.append(f.name)
        return render_template('admin/type-input.html',
            title = 'Type input',
            form = form,
            message = 'Type/s ' + ', '.join(submitted_names) + ' submitted successfully',
            messageclass = 'success')
    return render_template('admin/type-input.html',
        title = 'Type input',
        form = form)

@app.route('/admin/subtype-input/', methods=['GET', 'POST'])
@login_required
def subtype_input():
    form = MultipleSubtypeInputForm()
    if form.validate_on_submit():
        submitted_names = []
        for subtype in form.data['subtype']:
            t = Subtype()
            t.type_id = subtype['type_id']
            t.name = subtype['name']
            t.full_name = subtype['full_name']
            t.description = subtype['description']
            db.session.add(t)
            db.session.commit()
            submitted_names.append(t.name)
        return render_template('admin/subtype-input.html',
            title = 'subtype input',
            form = form,
            message = 'subtype/s ' + ', '.join(submitted_names) + ' submitted successfully',
            messageclass = 'success')
    return render_template('admin/subtype-input.html',
        title = 'Subtype input',
        form = form)

@app.route('/admin/country-input/', methods=['GET', 'POST'])
@login_required
def country_input():
    form = MultipleCountryInputForm()
    if form.validate_on_submit():
        submitted_names = []
        for country in form.data['country']:
            c = Country()
            c.name = country['name']
            db.session.add(c)
            db.session.commit()
            submitted_names.append(c.name)
        return render_template('admin/country-input.html',
            title = 'Country input',
            form = form,
            message = 'Country/s ' + ', '.join(submitted_names) + ' submitted successfully',
            messageclass = 'success')
    return render_template('admin/country-input.html',
        title = 'Country input',
        form = form)

@app.route('/admin/owner-input/', methods=['GET', 'POST'])
@login_required
def owner_input():
    form = MultipleOwnerInputForm()
    if form.validate_on_submit():
        submitted_names = []
        for owner in form.data['owner']:
            o = Owner()
            o.name = owner['name']
            o.country_id = owner['country_id']
            db.session.add(o)
            db.session.commit()
            submitted_names.append(o.name)
        return render_template('admin/owner-input.html',
            title = 'Owner input',
            form = form,
            message = 'Owner/s ' + ', '.join(submitted_names) + ' submitted successfully',
            messageclass = 'success')
    return render_template('admin/owner-input.html',
        title = 'Owner input',
        form = form)

@app.route('/admin/data-source-input/', methods=['GET', 'POST'])
@login_required
def data_source_input():
    form = MultipleDataSourceInputForm()
    if form.validate_on_submit():
        submitted_names = []
        for data_source in form.data['data_source']:
            d = DataSource()
            d.country_id = data_source['country_id']
            d.name = data_source['name']
            d.url = data_source['url']
            d.last_updated = data_source['last_updated']
            d.details = data_source['details']
            db.session.add(d)
            db.session.commit()
            submitted_names.append(d.name)
        return render_template('admin/data-source-input.html',
            title = 'Data source input',
            form = form,
            message = 'Data source/s ' + ', '.join(submitted_names) + ' submitted successfully',
            messageclass = 'success')
    return render_template('admin/data-source-input.html',
        title = 'Data source input',
        form = form)

@app.route('/logout')
def logout():
   logout_user()
   return redirect(url_for('index'))
