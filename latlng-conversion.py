#!/usr/bin/env python

import sqlite3
import sys

table = 'wiki_fossil'

def convert(old):
    direction = {'N':1, 'S':-1, 'E': 1, 'W':-1}
    new = old.replace(u'degreessymbol',' ').replace('minutessymbol',' ').replace('secondssymbol',' ')
    new = new.split()
    new_dir = new.pop()
    new.extend([0,0,0])
    # print new[0]
#     print new[1]
#     print new[2]
    return (int(new[0]) + int(new[1])/60.0 + float(new[2])/3600.0) * direction[new_dir]

con = sqlite3.connect('app.db')
cur = con.cursor()
cur.execute('SELECT Name from {}'.format(table))
names = []
for row in cur:
  names.extend(row)
#print names

for name in names:
  cur.execute('SELECT Lat, Lng from {} WHERE Name=:Name'.format(table), {"Name": name})
  row = cur.fetchone()
  lng = row[0]
  print lng
  if lng != '':
    lng = convert(lng)
  print lng
  lat = row[1]
  print lat
  if lat != '':
    lat = convert(lat)
  print lat
  cur.execute('UPDATE {} SET Lat=:Lat, Lng=:Lng WHERE Name=:Name'.format(table), {"Lat": lat, "Lng": lng, "Name": name})
  con.commit()
  

   
#SELECT Name from wiki_current_england_power_stations_01june2013_edited
    
#SELECT Lng, Lat FROM wiki_current_england_power_stations_01june2013_edited WHERE Name = 