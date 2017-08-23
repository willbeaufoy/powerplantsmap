import time
from selenium import webdriver

driver = webdriver.Chrome('/home/sofr/bin/chromedriver') # Optional argument, if not specified will search path.
driver.get('http://powerplantsmap.willbeaufoy.net');
time.sleep(3)
driver.find_element_by_id('select-location-input').send_keys('London')
driver.find_element_by_id('select-location-submit').click()
time.sleep(3)

driver.find_element_by_id('countries').send_keys('Australia')
time.sleep(12)
driver.quit()