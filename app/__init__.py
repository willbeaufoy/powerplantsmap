from flask import Flask
# from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# lm = LoginManager()
# lm.init_app(app)
# lm.login_view = 'login'

from config import markerspath, markersurl
from app import views, models
# from app import views
# from models import Site, Type
# from models import Type