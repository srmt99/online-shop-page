from flask import Flask, request, render_template, jsonify
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from backEnd import User, Receipt, Product, Category
import json
import pandas as pd
import datetime

app = Flask(__name__)
CORS(app)
api = Api(app)
app = Flask(__name__, template_folder="../")


app.debug = True
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

# Defining class for Users to be authenticated with jwt
class UserAuthenticate(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

# Reading Users from DB and adding their credentials to dicts
usersDF = User.get_all_users()
users = []
for index, row in usersDF.iterrows():
    users.append(UserAuthenticate(row['id'], row['username'], row['password']))
username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}
password_table = {u.password: u for u in users}


# Login path with JWT
@app.route("/login/", methods=["POST"])
@cross_origin()
def login():
    username = request.args.get("username", None)
    password = request.args.get("password", None)
    if username not in userid_table:
        return jsonify({"msg": "Bad username"}), 401
    elif password not in password_table or userid_table[username] != password_table[password]:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=username)
    print("TOKEN:")
    print(jsonify(access_token=access_token))
    return jsonify(access_token=access_token)


# Protected resource with jwt example
@app.route("/protected/", methods=["GET"])
@cross_origin()
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route("/protected/user/profile/<string:username>")
@cross_origin()
@jwt_required
def get_user_info(username):
    # print(username)
    current_user = get_jwt_identity()
    response = User.read_profile(username)
    response = jsonify(response)
    return jsonify(logged_in_as=current_user), response

@app.route("/protected/user/receipts/<string:username>")
@cross_origin()
@jwt_required
def get_user_receipts(username):
    # print(username)
    response = jsonify(User.get_user_receipts(username))
    return response


@app.route("/protected/user/profile/<string:username>/inc_crd")
@cross_origin()
@jwt_required
def increase_credit(username):
    User.update(username, new_credit=10000)
    return "Increased"


@app.route("/protected/user/profile/<string:username>/update_prof")
@cross_origin()
@jwt_required
def update_profile(username):
    name = request.args.get('name')
    lastname = request.args.get('lastname')
    password = request.args.get('password')
    address = request.args.get('address')

    if name==None or len(name)<1 or len(name)>255:
        return "Not updated , name field has a problem"
    if lastname==None or len(lastname)<1 or len(lastname)>255:
        return "Not updated , lastname field has a problem"
    if password==None or len(password)<8 or not any(char.isalpha() for char in password) or not any(char.isdigit() for char in password):
            return "Not updated, password field has a problem"
    if address==None or len(address)<1 or len(address)>1000:
        return "Not updated , address field has a problem"

    User.update(username, new_name=name, new_lastname=lastname, new_password=password, new_address=address)
    return "Updated"


@app.route("/receipts/<string:r_code>")
@cross_origin()
def get_receipt(r_code):
    response = jsonify(Receipt._get_all(searchText=r_code))
    return response

@app.route("/categories/get_categories")
@cross_origin()
def get_categories():
    response = jsonify(Category._get_all())
    return response

@app.route("/categories/update/<string:c_name>")
@cross_origin()
def update_category(c_name):
    name = request.args.get('name')
    Category.update(c_name, name)
    return "Updated"


@app.route("/categories/delete/<string:c_name>")
@cross_origin()
def delete_category(c_name):
    Category.delete(c_name)
    return "Deleted"

@app.route("/receipts/get_receipts")
@cross_origin()
def get_receipts():
    response = jsonify(Receipt._get_all())
    return response

@app.route("/product/all_product_list/")
@cross_origin()
def get_all_products():
    df = Product.get_all_products(orderBy='date')
    response = jsonify(df)
    return response

@app.route("/product/<string:p_id>/")
@cross_origin()
def get_product(p_id):
    df = Product.get_product(p_id)
    response = jsonify(df)
    return response

@app.route("/product/update/<string:p_id>")
@cross_origin()
def set_product(p_id):
    name = request.args.get('name')
    category = request.args.get('category')
    price = request.args.get('price')
    available = request.args.get('available')
    picture = request.args.get('picture_addr')
    Product.update(p_id, new_name=name, new_cat=category, new_price=price, new_available=available)
    return "Updated"

@app.route("/create/product")
@cross_origin()
def create_product():
    name = request.args.get('name')
    category = request.args.get('category')
    price = request.args.get('price')
    available = request.args.get('available')
    picture = request.args.get('picture_addr')
    prod = Product(name=name, category=category, price=price, available=available)
    Product.insert_product(prod)
    return "Created"


if __name__ == '__main__':
    app.run(port=5002)
