import re
import logging

from app import db
from app.models import Site, Type, Subtype

from OSGB36toWGS84 import OSGB36toWGS84

class WikiEnergyTable(object):

    false_friend_table_names = ['Thermal Non-Nuclear', 'Coal, gas and fuel-oil-based']

    name_colnames = ['Name', 'Site', 'Site (units)', 'Station', 'Facility', 'Farm', 'Power station', 'Hydroelectric station' 'Plant', 'Wind farm', 'Power plant', 'Plant']
    type_colnames = ['Type', 'Fuel']
    more_type_info_colnames = ['Operational Units and (type)', 'Underconstructed Units']
    subtype_colnames = ['Type']
    capacity_colnames = ['Capacity', 'Capacity (MW)', 'Total Capacity (MW)', 'Total capacity', 'Total(MW)', 'TotalNameplate capacity(MW)', 'Capacity, MWe', 'Output', 'MWe', 'Capacity (MWe)', 'Installed Capacity (MW)', 'Capacity, MWp']
    owner_colnames = ['Owner', 'Operator', 'Owner / Operator']
    coordinates_colnames = ['Coordinates', 'Coordinates [2]', 'Co-ordinates', 'Location', 'Geographical Coordinates', 'Plant Coordinates', 'Coords.', 'Geographic Coordinates', 'Geographic coordinates', 'Coord.']
    uk_grid_coordinates_colnames = ['Location (UK grid reference)']
    status_colnames = ['Operational', 'Status', 'Closed']

    double_td_colnames = ['Height of Chimneys']
    inactive_names = ['Under construction', 'retired', 'Retired', 'Closed']

    def __init__(self):

        self.type_id = ''

        self.name_col = ''
        self.type_col = ''
        self.subtype_col = ''
        self.capacity_col = ''
        self.coordinates_col = ''
        self.owner_col = ''
        self.status_col = ''
        self.more_type_info_cols = []

        self.colnames = []
        self.rows_list = []

    def extract_soup_data(self):
        try:
            cols = self.soup_content.find('tr').findAll('th')
            for col in cols:
                self.colnames.append(col.getText())
                if col.getText() in WikiEnergyTable.double_td_colnames:
                    self.colnames.append(col.getText())
            self.num_cols = len(self.colnames)
            # Now we know the column names, remove the column names row from the soup_content
            self.soup_content.find('tr').extract()
            # Go through each row and extract the data
            for n,row in enumerate(self.soup_content.findAll('tr')):
                if self.num_cols > len(row.findAll('td')) + len(row.findAll('th')) + 1:
                    logging.warning("Abnormal row skipped: " + str(n) + " (" + row.find('td').getText() + ")")
                    continue
                row_content = dict.fromkeys(self.colnames)
                row_content['url'] = ''
                cells = row.findAll('th') + row.findAll('td')
                # Go through each table cell in a row and extract data
                for i,cell in enumerate(cells):
                    cell_content = ''
                    if self.colnames[i] in WikiEnergyTable.name_colnames:
                        cell_content = cell.getText()
                        self.name_col = self.colnames[i]
                        row_content['url'] = 'http://en.wikipedia.org' + cell.find('a').get('href') if cell.find('a') else ''
                        if row_content['url'] == 'None' or '/w/' in row_content['url']:
                            row_content['url'] = ''
                    elif self.colnames[i] in WikiEnergyTable.type_colnames:
                        cell_content = cell.getText()
                        self.type_col = self.colnames[i]
                        if self.colnames[i] in WikiEnergyTable.subtype_colnames:
                            self.subtype_col = self.colnames[i]
                    elif self.colnames[i] in WikiEnergyTable.subtype_colnames:
                        cell_content = cell.getText()
                        self.subtype_col = self.colnames[i]
                    elif self.colnames[i] in WikiEnergyTable.capacity_colnames:
                        cell_content = cell.getText()
                        self.capacity_col = self.colnames[i]
                    elif self.colnames[i] in WikiEnergyTable.owner_colnames:
                        cell_content = cell.getText()
                        self.owner_col = self.colnames[i]
                    elif self.colnames[i] in WikiEnergyTable.status_colnames:
                        cell_content = cell.getText()
                        status_col = self.colnames[i]
                    elif self.colnames[i] in WikiEnergyTable.coordinates_colnames:
                        if cell.find('span', class_='geo'):
                            cell_content = cell.find('span', class_='geo').getText()
                            self.coordinates_col = self.colnames[i]
                    elif self.colnames[i] in WikiEnergyTable.uk_grid_coordinates_colnames:
                        if cell.find('span'):
                            cell_content = cell.find('span').getText()
                            self.coordinates_col = self.colnames[i]
                    if self.colnames[i] in WikiEnergyTable.more_type_info_colnames:
                        self.more_type_info_cols.append(self.colnames[i])
                        cell_content = cell.getText() if cell_content == '' else ''
                    row_content[self.colnames[i]] = cell_content
                # Add the extracted data to the table's rows_list property
                self.rows_list.append(row_content)
        except:
            pass
            logging.exception('Exception hit in extract_soup_data() on ' + 'cell.getText()')

    def choose_table_type(self):
        types = Type.query.all()
        for type in types:
            if type.name.lower() in self.name.lower():
                for ff in WikiEnergyTable.false_friend_table_names:
                    if self.name.lower() == ff.lower():
                        break
                else:
                    self.type_id = int(type.id)
                break
            else:
                for other_name in type.other_names:
                    if other_name.name.lower() in self.name.lower():
                        for ff in WikiEnergyTable.false_friend_table_names:
                            if self.name.lower() == ff.lower():
                                break
                        else:
                            self.type_id = int(type.id)
                        break
        else:
            subtypes = Subtype.query.all()
            for subtype in subtypes:
                if subtype.name.lower() in self.name.lower():
                    self.type_id = int(subtype.type_id)
                    break


    def save_data(self):
        for row in self.rows_list:
            try:
                site = Site()
                cont = 'no'
                if self.status_col and row[self.status_col]:
                    if self.status_col == 'Closed':
                        if row[self.status_col] != '':
                            cont = 'yes'
                    else:
                        for retired_name in WikiEnergyTable.inactive_colnames:
                            if retired_name in row[self.status_col]:
                                cont = 'yes'
                if cont =='yes':
                    continue
                site.name = row[self.name_col] if self.name_col else ''
                if not self.type_id:
                    if self.type_col and row[self.type_col]:
                        site.type_id = site.choose_type_id(row[self.type_col])
                    elif self.more_type_info_cols is not None:
                        for col in self.more_type_info_cols:
                            if site.choose_type_id(row[col]) != 1:
                                site.type_id = site.choose_type_id(row[col])
                                break
                        else:
                            site.type_id = 1
                    else:
                        site.type_id = 1
                else:
                    site.type_id = self.type_id
                site.subtype_id = site.choose_subtype_id(row[self.subtype_col]) if self.subtype_col and row[self.subtype_col] else 1
                site.capacity = re.sub("[MW]", "", row[self.capacity_col]) if(self.capacity_col and row[self.capacity_col]) else ''
                site.latitude = None
                site.longitude = None
                if self.coordinates_col and row[self.coordinates_col]:
                    if self.coordinates_col in WikiEnergyTable.uk_grid_coordinates_colnames:
                        coords = OSGB36toWGS84.osgb36_to_wgs84(row[self.coordinates_col])
                        site.latitude = coords[1]
                        site.longitude = coords[0]
                    else:
                        site.latitude = row[self.coordinates_col].split(';')[0]
                        site.longitude = row[self.coordinates_col].split(';')[1].replace(' ', '')

                site.owner_name = row[self.owner_col] if self.owner_col and row[self.owner_col] else ''
                site.url = row['url'] if row['url'] else ''
                site.country_id = self.country_id
                site.data_source_id = self.source_id
                db.session.add(site)               
            except:
                logging.exception('Exception hit in save_data() on ' + 'name')
        db.session.commit()
