from flask import render_template
from app import app

@app.route('/')
def map():
	return render_template('common.html')
