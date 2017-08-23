# World Power Plants Map

Map gets data on world power plants from [Enipedia](http://enipedia.tudelft.nl/).

Usage
----------

App requires a config.py in root containing the following in order to save and display data:

```python
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
```

Wikipedia importer (old and unused) 
----------------------------------------------

- This scrapes wikipedia pages to get the world power plants data. Currently this functionality is unused as data is accessed directly via Enipedia
- List of current data sources included is in pageimporter/pageimporter.py
- To check all sources and update them if they've changed run ./import_data.py update
- To force update of one or many sources run ./import_data.py args where args can be 'all', or one or more country ids (from the PageImporter.pages dictionary)

Enipedia importer
-------------------------

To be built. Will import data from Enipedia into a local database to improve app response time.

Issues
----------

- In order to be upgraded to python3, sqlalchemy will need to be replaced with something else or the configuration will need to be modified, as python-mysql, which it currently relies on, doesn't work with python3