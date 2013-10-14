import os

CSRF_ENABLED = True
SECRET_KEY = 'asgd7568hgvxcv--=-'

dbhost = 'localhost'
dbname = 'energy_map'
dbuser = 'energy_map'
dbpass = 'cows masticate thoroughly'
SQLALCHEMY_DATABASE_URI = 'mysql://' + dbuser + ':' + dbpass + '@' + dbhost + '/' + dbname

baseurl = 'http://localhost:5000/'
markersurl = baseurl + 'static/img/markers/'

apppath = os.path.dirname(os.path.abspath(__file__)) + '/app/'
markerspath = apppath + 'static/img/markers/'

