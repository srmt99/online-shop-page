from flask import Flask, request, render_template, jsonify
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
# from flask_jwt_extended import verify_jwt_in_request_optional
from flask_cors import CORS, cross_origin
from backEnd import User, Receipt, Product, Category
import json
import pandas as pd
import datetime
from collections import defaultdict

app = Flask(__name__)
CORS(app)
api = Api(app)
app = Flask(__name__)

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
userid = {}
def read_db():
    global userid_table
    global password_table
    usersDF = User.get_all_users()
    users = []
    for index, row in usersDF.iterrows():
        users.append((row['id'], row['username'], row['password']))
    users.append(('jesus@christ', 'jesus@christ', 'bebackin3'))
    for i in users:
        userid[i[0]] = i[2]
    print("###########################")
    print(userid)
    print("###########################")
read_db()

# Login path with JWT
@app.route("/login/", methods=["POST"])
@cross_origin()
def login():
    username = request.args.get("username", None)
    password = request.args.get("password", None)
    if username not in userid:
        return jsonify({"msg": "Bad username"}), 401
    elif userid[username] != password:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=username)
    # print("TOKEN:")
    # print(jsonify(access_token=access_token))
    return jsonify(access_token=access_token)


def df_to_dict(df):
    dict_df = df.to_dict()
    for value in list(dict_df.items()):
        for v in list(value[1].items()):
            if isinstance(v[1], datetime.datetime) or isinstance(v[1], bytes):
                dict_df[value[0]][v[0]] = str(dict_df[value[0]][v[0]])
    flipped = defaultdict(dict)
    for key, val in dict_df.items():
        for sub_key, sub_val in val.items():
            flipped[sub_key][key] = sub_val
    return flipped


@app.route("/")
def go_to_index():
    return render_template('index.html')

@app.route("/AdminProfile.html")
def go_to_adminProfile():
    return render_template('AdminProfile.html')

@app.route("/SignIn.html")
def go_to_SignIn():
    return render_template('SignIn.html')

@app.route("/SignUp.html")
def go_to_SignUp():
    return render_template('SignUp.html')

@app.route("/userProfile.html")
def go_to_userProfile():
    return render_template('userProfile.html')

@app.route("/SignUp/")
@cross_origin()
def sign_up():
    username = request.args.get('username')
    password = request.args.get('password')
    name = request.args.get('name')
    lastname = request.args.get('lastname')
    address = request.args.get('address')
    usr = User(username, password, name, lastname, address)
    User.sign_up(usr)
    read_db()
    return "Signed up"

@app.route("/buy/")
@cross_origin()
@jwt_required()
def buy():
    p_name = request.args.get('name')
    b_name = request.args.get('buyer_firstname')
    b_lname = request.args.get('buyer_lastname')
    b_uname = request.args.get('buyer_username')
    addr = request.args.get('buyer_address')
    price = request.args.get('price')
    sold = request.args.get('number_sold')
    
    rcp = Receipt(p_name, b_uname, sold, b_name, b_lname, addr, price)
    Receipt.insert_receipt(rcp)
    return "Receipted!"

@app.route("/product/all_product_list/")
@cross_origin()
def get_all_products():
    df = Product.get_all_products(orderBy='date')
    response = jsonify(df_to_dict(df))
    return response


@app.route("/product/product_list/")
@cross_origin()
def get_products():
    orderBy = request.args.get('orderBy')
    order = request.args.get('order')
    category = request.args.get('category')
    searchText = request.args.get('searchText')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    df = Product.get_all_products(orderBy=orderBy, order=order, filterCat=category, searchText=searchText,
                                  min_price=min_price, max_price=max_price)
    response = jsonify(df_to_dict(df))
    return response


@app.route("/category/category_list/")
@cross_origin()
def get_all_categories():
    df = Category._get_all()
    response = jsonify(df_to_dict(df))
    return response

@app.route("/protected/user/profile/<string:username>")
@cross_origin()
@jwt_required()
def get_user_info(username):
    # print(username)
    response = User.read_profile(username)
    response = jsonify(df_to_dict(response))
    return response

@app.route("/protected/user/get_username/")
@cross_origin()
@jwt_required()
def get_user_username():
    # print(username)
    current_user = get_jwt_identity()
    if current_user != 'jesus@christ':
        df = User.read_profile(current_user)
        token_holder = df.loc[0, 'name']
        print(df)
        print(token_holder)
        response = jsonify(token_holder)
        return response
    token_holder = 'jesus'
    response = jsonify(token_holder)
    return response

@app.route("/protected/user/get_user_username/")
@cross_origin()
@jwt_required()
def get_username():
    # print(username)
    current_user = get_jwt_identity()
    if current_user != 'jesus@christ':
        df = User.read_profile(current_user)
        token_holder = df.loc[0, 'username']
        print(df)
        print(token_holder)
        response = jsonify(token_holder)
        return response
    token_holder = 'jesus@christ'
    response = jsonify(token_holder)
    return response

@app.route("/protected/user/id/")
@cross_origin()
@jwt_required()
def get_user_id():
    current_user = get_jwt_identity()
    print(current_user)
    response = jsonify(current_user)
    return response

@app.route("/protected/user/receipts/<string:username>")
@cross_origin()
@jwt_required()
def get_user_receipts(username):
    # print(username)
    df = User.get_user_receipts(username)
    response = jsonify(df_to_dict(df))
    return response

@app.route("/protected/user/profile/<string:username>/inc_crd")
@cross_origin()
@jwt_required()
def increase_credit(username):
    User.update(username, new_credit=10000)
    return "Increased"

@app.route("/protected/user/profile/<string:username>/dec_crd/<string:amount>")
@cross_origin()
@jwt_required()
def decrease_credit(username, amount):
    amount = int(amount)
    User.update(username, new_credit=(-amount))
    return "Decreased"


@app.route("/protected/user/profile/<string:username>/update_prof")
@cross_origin()
@jwt_required()
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
    df = Receipt._get_all(searchText=r_code)
    response = jsonify(df_to_dict(df))
    return response

@app.route("/protected/receipts/change_status/<string:r_code>/")
@cross_origin()
def update_receipt(r_code):
    new_status = request.args.get('new_status')
    Receipt.update_status(r_code, new_status)
    return "Updated"

@app.route("/categories/get_categories")
@cross_origin()
def get_categories():
    df = Category._get_all()
    response = jsonify(df_to_dict(df))
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
    df = Receipt._get_all()
    response = jsonify(df_to_dict(df))
    return response

@app.route("/product/all_product_list/")
@cross_origin()
def get_products_date():
    df = Product.get_all_products(orderBy='date')
    response = jsonify(df_to_dict(df))
    print(response)
    return response

@app.route("/product/<string:p_id>/")
@cross_origin()
def get_product(p_id):
    df = Product.get_product(p_id)
    response = jsonify(df_to_dict(df))
    return response

@app.route("/product/update/<string:p_id>")
@cross_origin()
def set_product(p_id):
    name = request.args.get('name')
    category = request.args.get('category')
    price = request.args.get('price')
    available = request.args.get('available')
    picture = request.args.get('picture_addr')
    sold = request.args.get('sold')
    print("#####")
    print(sold)
    print("####")
    Product.update(p_id, new_name=name, new_cat=category, new_price=price, new_available=available, new_picture=picture)
    Product.sold_inc(p_id, sold)
    return "Updated"

@app.route("/create/product")
@cross_origin()
def create_product():
    name = request.args.get('name')
    category = request.args.get('category')
    price = request.args.get('price')
    available = request.args.get('available')
    picture = request.args.get('picture_addr')
    prod = Product(name=name, category=category, price=price, available=available, picture=picture)
    Product.insert_product(prod, category)
    return "Created"


if __name__ == '__main__':
    app.run(port=5002)
