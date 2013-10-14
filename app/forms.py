from flask.ext.wtf import Form, TextField, TextAreaField, BooleanField, IntegerField, FloatField, DateField, SelectField, FormField, FieldList, SubmitField
from flask.ext.wtf import Required, Optional
from models import Type, Subtype, Owner, Country, DataSource

class LoginForm(Form):
	email = TextField('email', validators = [Required('Required')])
	password = TextField('password', validators = [Required('Required')])
	remember_me = BooleanField('remember_me', default = False)
	
class SiteInputForm(Form):
	type_id = SelectField('Type*', coerce=int, choices = [], validators = [Required('Required')])
	subtype_id = SelectField('Subtype*', coerce=int, choices = [], validators = [Required('Required')])
	owner_id = SelectField('Owner*', coerce=int, choices = [], validators = [Required('Required')])
	country_id = SelectField('Country*', coerce=int, choices = [], validators = [Required('Required')])
	data_source_id = SelectField('Data source*', coerce=int, choices = [], validators = [Required('Required')])
	name = TextField('Name*', validators = [Required('Required')])
	installation_year = IntegerField('Installation year (YYYY-MM-DD)*')
	decommission_year = IntegerField('Decommission year (YYYY-MM-DD)', validators = [Optional()])
	capacity = IntegerField('Capacity*')
	address = TextAreaField('Address')
	latitude = FloatField('Latitude*', validators = [Required('Required')])
	longitude = FloatField('Longitude*', validators = [Required('Required')])
	website = TextField('Website', validators = [Optional()])
	details = TextAreaField('Details', validators = [Optional()])
	
	def __init__(self, *args, **kwargs):
		super(SiteInputForm, self).__init__(*args, **kwargs)	  
		types = Type.query.all()
		del self.type_id.choices[:]
		for type in types:
			choice = (type.id, type.name)
			self.type_id.choices.append(choice) 
		subtypes = Subtype.query.all()
		del self.subtype_id.choices[:]
		for subtype in subtypes:
			choice = (subtype.id, subtype.name)
			self.subtype_id.choices.append(choice) 
		owners = Owner.query.all()
		del self.owner_id.choices[:]
		for owner in owners:
			choice = (owner.id, owner.name)
			self.owner_id.choices.append(choice)	
		countries = Country.query.all()
		del self.country_id.choices[:]
		for country in countries:
			choice = (country.id, country.name)
			self.country_id.choices.append(choice)
		data_sources = DataSource.query.all()
		del self.data_source_id.choices[:]
		for data_source in data_sources:
			choice = (data_source.id, data_source.name)
			self.data_source_id.choices.append(choice)
				  						  
class MultipleSiteInputForm(Form):
	site = FieldList(FormField(SiteInputForm), min_entries=1)
	submit = SubmitField('Submit')
	
class TypeInputForm(Form):
	name = TextField('Name', validators = [Required('Required')])
	other_names = TextField('Other names', validators = [Optional()])
						  
class MultipleTypeInputForm(Form):
	type = FieldList(FormField(TypeInputForm), min_entries=1)
	submit = SubmitField('Submit')
	
class CountryInputForm(Form):
	name = TextField('Name', validators = [Required('Required')])
						  
class MultipleCountryInputForm(Form):
	country = FieldList(FormField(CountryInputForm), min_entries=1)
	submit = SubmitField('Submit')
	
class SubtypeInputForm(Form):
	type_id = SelectField('Type', coerce=int, choices = [], validators = [Required('Required')])
	name = TextField('Name', validators = [Required('Required')])
	full_name = TextField('Full name')
	description = TextAreaField('Description')
	
	def __init__(self, *args, **kwargs):
		super(SubtypeInputForm, self).__init__(*args, **kwargs)	  	
		types = Type.query.all()
		del self.type_id.choices[:]
		for type in types:
			choice = (type.id, type.name)
			self.type_id.choices.append(choice)
			 						  
class MultipleSubtypeInputForm(Form):
	subtype = FieldList(FormField(SubtypeInputForm), min_entries=1)
	submit = SubmitField('Submit')
	
class OwnerInputForm(Form):
	country_id = SelectField('Country', coerce=int, choices = [], validators = [Required('Required')])
	name = TextField('Name', validators = [Required('Required')])
	
	def __init__(self, *args, **kwargs):
		super(OwnerInputForm, self).__init__(*args, **kwargs)	  	
		countries = Country.query.all()
		del self.country_id.choices[:]
		for country in countries:
			choice = (country.id, country.name)
			self.country_id.choices.append(choice)
			 						  
class MultipleOwnerInputForm(Form):
	owner = FieldList(FormField(OwnerInputForm), min_entries=1)
	submit = SubmitField('Submit')
	
class DataSourceInputForm(Form):
	country_id = SelectField('Country', coerce=int, choices = [], validators = [Required('Required')])
	name = TextField('Name', validators = [Required('Required')])
	url = TextField('URL')
	last_updated = DateField('Last updated', validators = [Optional('Optional')] )
	details = TextAreaField('Details')
	
	def __init__(self, *args, **kwargs):
		super(DataSourceInputForm, self).__init__(*args, **kwargs)	  	
		countries = Country.query.all()
		del self.country_id.choices[:]
		for country in countries:
			choice = (country.id, country.name)
			self.country_id.choices.append(choice)
			 						  
class MultipleDataSourceInputForm(Form):
	data_source = FieldList(FormField(DataSourceInputForm), min_entries=1)
	submit = SubmitField('Submit')