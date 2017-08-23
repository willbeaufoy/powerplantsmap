import unittest, urllib2, time

from flask_testing import LiveServerTestCase
from selenium import webdriver

from app import app, db
# from app.models import Employee, Role, Department

# # Set test variables for test admin user
# test_admin_username = "admin"
# test_admin_email = "admin@email.com"
# test_admin_password = "admin2016"

# # Set test variables for test employee 1
# test_employee1_first_name = "Test"
# test_employee1_last_name = "Employee"
# test_employee1_username = "employee1"
# test_employee1_email = "employee1@email.com"
# test_employee1_password = "1test2016"

# # Set test variables for test employee 2
# test_employee2_first_name = "Test"
# test_employee2_last_name = "Employee"
# test_employee2_username = "employee2"
# test_employee2_email = "employee2@email.com"
# test_employee2_password = "2test2016"

# # Set variables for test department 1
# test_department1_name = "Human Resources"
# test_department1_description = "Find and keep the best talent"

# # Set variables for test department 2
# test_department2_name = "Information Technology"
# test_department2_description = "Manage all tech systems and processes"

# # Set variables for test role 1
# test_role1_name = "Head of Department"
# test_role1_description = "Lead the entire department"

# # Set variables for test role 2
# test_role2_name = "Intern"
# test_role2_description = "3-month learning position"

class TestBase(LiveServerTestCase):

    def create_app(self):
        # config_name = 'testing'
        # app = create_app(config_name)
        app.config.update(
            # Specify the test database
            SQLALCHEMY_DATABASE_URI='mysql://energy_map:cows masticate thoroughly@localhost/energy_map_test',
            # Change the port that the liveserver listens on
            LIVESERVER_PORT=8943
        )
        return app

    def setUp(self):
        """Setup the test driver and create test users"""
        self.driver = webdriver.Chrome()
        self.driver.get(self.get_server_url())

        # db.session.commit()
        # db.drop_all()
        # db.create_all()

        # # create test admin user
        # self.admin = Employee(username=test_admin_username,
        #                       email=test_admin_email,
        #                       password=test_admin_password,
        #                       is_admin=True)

        # # create test employee user
        # self.employee = Employee(username=test_employee1_username,
        #                          first_name=test_employee1_first_name,
        #                          last_name=test_employee1_last_name,
        #                          email=test_employee1_email,
        #                          password=test_employee1_password)

        # # create test department
        # self.department = Department(name=test_department1_name,
        #                              description=test_department1_description)

        # # create test role
        # self.role = Role(name=test_role1_name,
        #                  description=test_role1_description)

        # # save users to database
        # db.session.add(self.admin)
        # db.session.add(self.employee)
        # db.session.add(self.department)
        # db.session.add(self.role)
        # db.session.commit()

    def tearDown(self):
        self.driver.quit()

    def test_server_is_up_and_running(self):
        response = urllib2.urlopen(self.get_server_url())
        self.assertEqual(response.code, 200)

        time.sleep(3)
        self.driver.find_element_by_id('select-location-input').send_keys('London')
        self.driver.find_element_by_id('select-location-submit').click()
        time.sleep(3)

        self.driver.find_element_by_id('countries').send_keys('Australia')
        time.sleep(12)

    # def move_map_to_location(self):


# class TestMoveMap(TestBase):


if __name__ == '__main__':
    unittest.main()