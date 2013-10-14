App requires a config.py in root containing the following:

    import os

    CSRF_ENABLED = True
    SECRET_KEY = 'your secret key here'

    dbhost = 'your dbhost here'
    dbname = 'your dbname here'
    dbuser = 'your dbuser here'
    dbpass = 'your dbpass here'
    SQLALCHEMY_DATABASE_URI = 'mysql://' + dbuser + ':' + dbpass + '@' + dbhost + '/' + dbname

    baseurl = 'your base url here with trailing slash'
    markersurl = baseurl + 'static/img/markers/'

    apppath = os.path.dirname(os.path.abspath(__file__)) + '/app/'
    markerspath = apppath + 'static/img/markers/'
