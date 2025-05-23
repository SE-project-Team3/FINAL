# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(20), nullable=False)  # 예: window, inside, room
    capacity = db.Column(db.Integer, nullable=False)     # 2, 4, 6, 8

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    card = db.Column(db.String(50), nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(10))
    
    user = db.relationship('User', backref='reservations')
    table = db.relationship('Table', backref='reservations')
