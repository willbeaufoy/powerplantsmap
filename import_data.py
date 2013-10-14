#!/usr/bin/env python

import sys
import logging
#import MySQLdb

#from flask.ext.sqlalchemy import SQLAlchemy

import config
import app.models
#from app.models import Site, Country, Type, Subtype, DataSource
from pageimporter.pageimporter import PageImporter

logging.basicConfig(filename="import_errors.log", level=logging.INFO)

importer = PageImporter()

if len(sys.argv) > 1:
    if sys.argv[1] == 'update':
        importer.update()

    else:
        args = sys.argv[1:]
        importer.cl_import(args)
else:
    logging.info('No arguments given')
