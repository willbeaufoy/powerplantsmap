from __future__ import with_statement
import sqlite3
from contextlib import closing
from flask import Flask, render_template, request, logging

DATABASE = 'tmp/energy.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/')
def map():
	return render_template('common.html')
	
def connect_db():
	return sqlite3.connect(app.config['DATABASE'])
	
def init_db():
	with closing(connect_db()) as db:
		with app.open_resource('schema.sql') as f:
			db.cursor().executescript(f.read())
		db.commit()
	
if __name__ == '__main__':
	app.run(host= '0.0.0.0')