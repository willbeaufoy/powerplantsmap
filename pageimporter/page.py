#!/usr/bin/env python

from datetime import datetime
import logging

import requests
from bs4 import BeautifulSoup
#import MySQLdb

from app import db
from app.models import Country, DataSource, Site

#from datasourceimporter import WikipediaImporter
from table import WikiEnergyTable

class Page(object):

    #countries = Country.query.all()
    #data_sources = DataSource.query.all()

    def __init__(self, id, country, url):

        self.id = id
        self.country = country
        self.url = url

        #self.db=MySQLdb.connect(user='energy_map', passwd="cows masticate thoroughly", db="energy_map")

    def import_tables(self, force_update = False):
        self.response = requests.get(self.url)
        self.soup = BeautifulSoup(self.response.content)
        self.title = self.soup.title.getText().replace(' - Wikipedia, the free encyclopedia', '')
        self.soup_tables = self.soup.find_all("table", class_="wikitable")
        self.last_modified = datetime.strptime(self.response.headers['last-modified'], "%a, %d %b %Y %H:%M:%S %Z")
        self.choose_country_id(self.country)
        if self.choose_source_id(force_update) == 'source_not_modifed':
            return None
        self.tables = []
        for n,soup_table in enumerate(self.soup_tables):
            table = WikiEnergyTable()
            table.num = n
            table.name = ''
            table.country_id = self.country_id
            table.source_id = self.source_id
            table.soup_content = soup_table
            for sibling in soup_table.previous_siblings:
                if sibling.name == 'h2' or sibling.name == 'h3' or sibling.name == 'h4':
                    table.name = sibling.span.getText()
                    break
            else:
                table.name = self.soup.h1.getText()
            logging.info('Importing table: ' + table.name)
            # Choose whether a table is all of one site type or made up of different types
            table.choose_table_type();
            # Extract all data from a table's soup_content into a structure we can save in a database
            table.extract_soup_data()
            # Save each site in the table to the database
            table.save_data()
            logging.info('Finished importing table: ' + table.name)

    def choose_source_id(self, force_update):
        sources = DataSource.query.all()
        for source in sources:
            if self.url in source.url:
                if force_update is True or self.last_modified > source.last_modified:
                    Site.query.filter_by(data_source_id = source.id).delete()
                    source.last_modified = self.last_modified
                    db.session.commit()
                    self.source_id =  int(source.id)
                    return None
                else:
                    return 'source not modified'
        ds = DataSource(self.country_id, self.title, self.url, self.last_modified)
        db.session.add(ds)
        db.session.commit()
        self.source_id = DataSource.query.filter_by(url = self.url).first().id

    def choose_country_id(self, this_country_name):
        countries = Country.query.all()
        for country in countries:
            if this_country_name in country.name:
                self.country_id = int(country.id)
                return None
        c = Country(this_country_name)
        db.session.add(c)
        db.session.commit()
        self.country_id = Country.query.filter_by(name = this_country_name).first().id