import sqlite3, json
from flask import Flask, jsonify, g, redirect, request, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config.from_object('config')
app.config['SECRET_KEY'] = 'ghfdsadfghgjfds'
db = SQLAlchemy(app)	
table = 'wiki_fossil'

@app.before_request
def before_request():
    g.db = sqlite3.connect('app.db')

@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db'):
        g.db.close()

@app.route('/json-data/')
def json_data():
    # get number of items from the javascript request
    nitems = request.args.get('nitems', 2)
    # query database
    cursor = g.db.execute('select * from wiki_fossil')
    # return json
    json_data = json.dumps(dict(('%d' % s, Name)
                        for s, Name in enumerate(cursor.fetchall(), start=1)))
    callback = request.args.get('callback')
    #json_data = json.dumps(json_data)
    return '{0}({1})'.format(callback, json_data)

toolbar = DebugToolbarExtension(app)

from app import views, models