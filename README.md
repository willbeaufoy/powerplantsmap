### App to scrape power plant data from wikipedia and display it on a map

* List of current data sources included is in pageimporter/pageimporter.py
* To check all sources and update them if they've changed run ./import_data.py update
* To force update of one or many sources run ./import_data.py args where args can be 'all', or one or more country ids (from the PageImporter.pages dictionary)

App requires a config.py in root containing the following in order to save and display data:

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
    

# Problems

## OSX

### Chrome

* Checkboxes are too low - http://stackoverflow.com/questions/306252/how-to-align-checkboxes-and-their-labels-consistently-cross-browsers

### Safari

* Checkboxes missing. If given a height they display

## Windows

### IE

* <= 8 neither header nor map displays

# Solved

* Unknown type currently doesn't seem to work on its own
