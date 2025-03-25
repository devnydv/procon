from wtforms import Form, StringField, TextAreaField, URLField, IntegerField
from wtforms.validators import DataRequired, Length, URL

# validate add and edit deal form
class deal(Form):
    product_input = StringField(
        'Deal Title',
        validators=[
            DataRequired(message="Deal name is required."),
            Length(min=3, max=150, message="Deal name must be between 3 and 150 characters.")
        ]
    )
    
    description = TextAreaField(
        'Description',
        validators=[
            DataRequired(message="Product link is required."),
            Length(min=100, max=1500, message="Description must be more than 100 and less than 1500 characters.") 
        ]
    )