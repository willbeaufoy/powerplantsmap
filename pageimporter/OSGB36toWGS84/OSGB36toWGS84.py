#!/bin/env python

#Convert OS refs with letters to cartesian coords in meters.

import math
from osgeo import osr

def grid_to_en(inref):
    ''' Return a tuple of two 7 digit OS numeric grid refs from an XXNNNN type reference.
    Also returns the accuracy of the original OS ref since this is lost when
    the data are padded to two 6 digit grid refs.
    Example: os_cart("SN109112") returns (210900, 211200, 100)
    '''
    #print inref
    '''get numeric values of letter references, mapping A->0, B->1, C->2, etc:'''
    inref = inref.replace(" ","") #Strip all spaces out
    # Deal with the letters
    l1 = ord(inref[0].upper())-ord("A")
    l2 = ord(inref[1].upper())-ord("A")
    # shuffle down letters after 'I' since 'I' is not used in grid:
    if l1 > 7: l1 -= 1
    if l2 > 7: l2 -= 1

    e = str(((l1-2)%5)*5 + (l2%5)) #easting
    n = str(int((19-math.floor(l1/5)*5) - math.floor(l2/5))) #northing

    # Now the numbers
    gridref = inref[2:]
    e += gridref[:int(len(gridref)/2)]
    n += gridref[int(len(gridref)/2):]
    # Pad short refs with correct number of zeros for postGIS
    # This does imply a greater accuracy then the original data suggest
    # however and should be used with caution, see next line.
    a = 1 * int(math.pow(10,6-len(n))) # Calculate the accuracy of original coordinates in metres.
    n = int(math.pow(10,6-len(n))) * int(n)
    e = int(math.pow(10,6-len(e))) * int(e)
    return int(e), int(n), int(a)

def grid_en_to_latlng(en):
    osgb36_en = osr.SpatialReference()
    osgb36_en.ImportFromEPSG(27700)

    wgs84 = osr.SpatialReference()
    wgs84.ImportFromEPSG(4326)

    grid_to_wgs84 = osr.CoordinateTransformation(osgb36_en, wgs84)

    result = grid_to_wgs84.TransformPoint(en[0], en[1])
    return result[:2]

def osgb36_to_wgs84(gridref):
    return grid_en_to_latlng(grid_to_en(gridref)[:2])