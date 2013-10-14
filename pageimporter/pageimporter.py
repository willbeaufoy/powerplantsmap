#!/usr/bin/env python

import sys
from datetime import datetime
import logging

from page import Page
#from table import WikiEnergyTable

class PageImporter(object):

    pages = {
        'ar':{'country': 'Argentina','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Argentina'},
        'at':{'country': 'Austria','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Austria'},
        'be':{'country': 'Belgium','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Belgium'},
        'br':{'country': 'Brazil','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Brazil'},
        'ca':{'country': 'Canada','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Canada'},
        'ch':{'country': 'Switzerland','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Switzerland'},
        #'cn':{'country': 'China','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_China'},
        'cn-an':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Anhui_province'},
        'cn-bj':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Beijing'},
        'cn-ch':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Chongqing'},
        'cn-fu':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Fujian_province'},
        'cn-ga':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Gansu_province'},
        'cn-gu':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Guangdong_province'},
        'cn-gx':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Guangxi'},
        'cn-gz':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Guizhou_province'},
        'cn-ha':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Hainan_province'},
        'cn-he':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Hebei_province'},
        'cn-hi':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Heilongjiang_province'},
        'cn-hn':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Henan_province'},
        'cn-hk':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Hong_Kong'},
        'cn-hu':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Hubei_province'},
        'cn-hn':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Hunan_province'},
        'cn-im':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Inner_Mongolia'},
        'cn-ji':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Jiangsu_province'},
        'cn-jx':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Jiangxi_province'},
        'cn-jl':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Jilin_province'},
        'cn-li':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Liaoning_province'},
        'cn-ni':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Ningxia'},
        'cn-qi':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Qinghai_province'},
        'cn-sh':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Shaanxi_province'},
        'cn-sd':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Shandong_province'},
        'cn-sh':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Shanghai'},
        'cn-sx':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Shanxi_province'},
        'cn-si':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Sichuan_province'},
        'cn-ti':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Tianjin'},
        'cn-xi':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Xinjiang'},
        'cn-xz':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Xizang'},
        'cn-yu':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Yunnan_province'},
        'cn-zh':{'country': 'China', 'url': 'http://en.wikipedia.org/wiki/List_of_major_power_stations_in_Zhejiang_province'},
        'cz':{'country': 'Czech Republic','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_the_Czech_Republic'},
        'de':{'country': 'Germany','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Germany'},
        'dk':{'country': 'Denmark','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Denmark'},
        'eg':{'country': 'Egypt','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Egypt'},
        'es':{'country': 'Spain','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Spain'},
        'fi':{'country': 'Finland','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Finland'},
        'fr':{'country': 'France','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_France'},
        'hu':{'country': 'Hungary','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Hungary'},
        'is':{'country': 'Iceland','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Iceland'},
        'in':{'country': 'India','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_India'},
        'jp':{'country': 'Japan','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Japan'},
        'kr':{'country': 'South Korea','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_South_Korea'},
        'kz':{'country': 'Kazakhstan','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Kazakhstan'},
        'lk':{'country': 'Sri Lanka','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Sri_Lanka'},
        'lt':{'country': 'Lithuania','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Lithuania'},
        'mx':{'country': 'Mexico','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Mexico'},
        'my':{'country': 'Malaysia','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Malaysia'},
        'ng':{'country': 'Nigeria','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Nigeria'},
        'nl':{'country': 'The Netherlands','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_the_Netherlands'},
        'nz':{'country': 'New Zealand','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_New_Zealand'},
        'no':{'country': 'Norway','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Norway'},
        'ph':{'country': 'The Philippines','url': 'https://en.wikipedia.org/wiki/List_of_power_plants_in_the_Philippines'},
        'pk':{'country': 'Pakistan','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Pakistan'},
        'pl':{'country': 'Poland','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Poland'},
        'pt':{'country': 'Portugal','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Portugal'},
        'ru':{'country': 'Russia','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Russia'},
        'se':{'country': 'Sweden','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Sweden'},
        'sk':{'country': 'Slovakia','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Slovakia'},
        'tr':{'country': 'Turkey','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Turkey'},
        'tw':{'country': 'Taiwan','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Taiwan'},
        'ua':{'country': 'Ukraine','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Ukraine'},
        'uk-en':{'country': 'UK','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_England'},
        'uk-ni':{'country': 'UK','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Northern_Ireland'},
        'uk-offshore-wind':{'country': 'UK', 'url': 'http://en.wikipedia.org/wiki/List_of_offshore_wind_farms_in_the_United_Kingdom'},
        'uk-onshore-wind':{'country': 'UK', 'url': 'http://en.wikipedia.org/wiki/List_of_onshore_wind_farms_in_the_United_Kingdom'},
        'uk-sc':{'country': 'UK','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Scotland'},
        'uk-wa':{'country': 'UK', 'url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_Wales'},
        'us-ca':{'country': 'USA','url': 'http://en.wikipedia.org/wiki/List_of_power_stations_in_California'},
        'us-il':{'country': 'USA','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Illinois'},
        'us-ny':{'country': 'USA','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_New_York'},
        'us-pa':{'country': 'USA','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Pennsylvania'},
        'us-sc':{'country': 'USA','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_South_Carolina'},
        'us-wa':{'country': 'USA','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Washington'},
        'us-wi':{'country': 'USA','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Wisconsin'},
        'za':{'country': 'South Africa','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_South_Africa'},
        'zm':{'country': 'Zambia','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Zambia'},
        'zw':{'country': 'Zimbabwe','url': 'https://en.wikipedia.org/wiki/List_of_power_stations_in_Zimbabwe'},
    }

    def update(self):
        logging.info("Checking sources for updates")
        for id, values in PageImporter.pages.iteritems():
            logging.info("Checking page: " + id + " (" + values['country'] + ")")
            page = Page(id, values['country'], values['url'])
            if page.import_tables() == 0:
                logging.info(id + " not modified")
            else:
                logging.info("Finished importing page: " + id + " (" + values['country'] + ")")

    def cl_import(self, cl_args):
        if('all' in cl_args):
            logging.info("START IMPORT")
            for id, values in PageImporter.pages.iteritems():
                logging.info("Importing page: " + id + " (" + values['country'] + ") " + str(datetime.now()))
                page = Page(id, values['country'], values['url'])
                page.import_tables(True)
                logging.info("Finished importing page: " + id + " (" + values['country'] + ")")
            logging.info("FINISHED IMPORT")
        else:
            logging.info("START IMPORT")
            for page_id in cl_args:
                if page_id not in PageImporter.pages:
                    if "-" in page_id:
                        for id, values in PageImporter.pages.iteritems():
                            if page_id in id:
                                logging.info("Importing page: " + id + " (" + values['country'] + " - " + values['url'] + ") " + str(datetime.now()))
                                page = Page(id, values['country'], values['url'])
                                page.import_tables(True)
                                logging.info("Finished importing page: " + id + " (" + values['country'] + ")")
                    else:
                        logging.warning("Page: " + page_id + " not in pages list")
                        continue
                else:
                    logging.info("Importing page: " + page_id + " (" + PageImporter.pages[page_id]['country'] + " - " + PageImporter.pages[page_id]['url'] + ")")
                    page = Page(page_id, PageImporter.pages[page_id]['country'], PageImporter.pages[page_id]['url'])
                    #print 'yes'
                    page.import_tables(True)
                    logging.info("Finished importing page: " + page_id + " (" + PageImporter.pages[page_id]['country'] + ")")
            logging.info("FINISHED IMPORT")
