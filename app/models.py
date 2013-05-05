from app import db

ROLE_USER = 0
ROLE_ADMIN = 1

class Site(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    site = db.Column(db.String(64), index = True, unique = True)
    lat = db.Column(db.SmallInteger)
    long = db.Column(db.SmallInteger)

    def __repr__(self):
        return '<Site %r>' % (self.site)  