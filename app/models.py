from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % self.email

class Site(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.id'))
    subtype_id = db.Column(db.Integer, db.ForeignKey('subtype.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    data_source_id = db.Column(db.Integer, db.ForeignKey('data_source.id'))
    name = db.Column(db.String(255))
    installation_year = db.Column(db.Integer)
    decommission_year = db.Column(db.Integer)
    capacity = db.Column(db.String(255))
    address = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    owner_name = db.Column(db.String(255))
    url = db.Column(db.Text)
    website = db.Column(db.String(255))
    details = db.Column(db.Text)

    #def __init__(self, type_id = None, subtype_id = None, country_id = None, data_source_id = None, name = '', installation_year = None, decommission_year = None, capacity = '', latitude = None, longitude = None, owner_name = '', url = ''):
    #    self.type_id = type_id
    #    self.subtype_id = subtype_id,
    #    self.country_id = country_id,
    #    self.data_source_id = data_source_id,
    #    self.name = name,
    #    self.installation_year = installation_year,
    #    self.decommission_year = decommission_year,
    #    self.capacity = capacity,
    #    self.latitude = latitude,
    #    self.longitude = longitude,
    #    self.owner_name = owner_name
    #    self.url = url

    def choose_type_id(self, input_text):
        for type in Type.query.all():
            if input_text.lower() in str(type.name.lower()) or str(type.name.lower()) in input_text.lower():
                return int(type.id)
            if input_text.lower() in type.other_names:
                return int(type.id)
        for subtype in Subtype.query.all():
            if input_text.lower() in str(subtype.name.lower()):
                return int(subtype.type_id)
        return 1

    def choose_subtype_id(self, input_text):
        for subtype in Subtype.query.all():
            if input_text.lower() in str(subtype.name.lower()):
                return int(subtype.id)
        return 1

    def __repr__(self):
        return '<Site %r>' % self.name

class Owner(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    name = db.Column(db.String(255))
    sites = db.relationship('Site', backref='owner', lazy='dynamic')

    def __repr__(self):
        return '<Owner %r>' % self.name

class Country(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))
    sites = db.relationship('Site', backref='country', lazy='dynamic')
    owners = db.relationship('Owner', backref='country', lazy='dynamic')
    data_sources = db.relationship('DataSource', backref='country', lazy='dynamic')

    def __init__(self, name = ''):
        self.name = name

    def __repr__(self):
        return '<Country %r>' % self.name

class Subtype(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.id'))
    name = db.Column(db.String(255))
    full_name = db.Column(db.String(100))
    description = db.Column(db.Text)
    sites = db.relationship('Site', backref='subtype', lazy='dynamic')

    def __repr__(self):
        return '<Subtype %r>' % self.name

class Type(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))
    subtypes = db.relationship('Subtype', backref='type', lazy='dynamic')
    other_names = db.relationship('TypeOtherName', backref='type', lazy='dynamic')
    sites = db.relationship('Site', backref='type', lazy='dynamic')

    def __repr__(self):
        return '<Type %r>' % self.name

class TypeOtherName(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.id'))
    name = db.Column(db.String(255))

    def __repr__(self):
        return '<TypeOtherName %r>' % self.name

class DataSource(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    name = db.Column(db.String(255))
    url = db.Column(db.Text)
    last_modified = db.Column(db.Date)
    details = db.Column(db.Text)

    def __init__(self, country_id = None, name = '', url = '', last_modified = None, details = None):
        self.country_id = country_id
        self.name = name
        self.url = url
        self.last_modified = last_modified
        self.details = details

    def __repr__(self):
        return '<DataSource %r>' % self.name