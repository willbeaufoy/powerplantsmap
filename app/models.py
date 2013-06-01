from app import db

ROLE_USER = 0
ROLE_ADMIN = 1

class Site(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	site = db.Column(db.String(64), index = True, unique = True)
	lat = db.Column(db.SmallInteger)
	long = db.Column(db.SmallInteger)
	type = db.Column(db.String(64))
	max_output = db.Column(db.String(64))
	built = db.Column(db.String(64))
	decommission_date = db.Column(db.String(64))
	owner = db.Column(db.String(64))
    
    #	Wiki table
    
	# Name = db.Column(db.String(64))
# 	Lng = db.Column(db.String(64))
# 	Lat = db.Column(db.String(64))
# 	Type = db.Column(db.String(64))
# 	Totalcapacity = db.Column(db.String(64))
# 	Opened = db.Column(db.String(64))

#			DUKES table
#     StationName = db.Column(db.String(64))
#     Fuel = db.Column(db.String(64))
#     Installed = db.Column(db.String(64))
#     Yearof = db.Column(db.String(64))
#     CompanyName = db.Column(db.String(64))
		
	def __repr__(self):
			return '<Site %r>' % (self.Name)  