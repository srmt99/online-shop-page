from flask import Flask, request, render_template
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from backEnd import User, Receipt, Product, Category
import json
import pandas as pd
import datetime

app = Flask(__name__)
CORS(app)
api = Api(app)
app = Flask(__name__, template_folder="../")


def df_to_json(df):

    result = df.to_json(orient="records")
    parsed = json.loads(result)
    return json.dumps(parsed) 

    # dict_df = df.to_dict()
    # for value in list(dict_df.items()):
    #     for v in list(value[1].items()):
    #         if isinstance(v[1], datetime.datetime):
    #             dict_df[value[0]][v[0]] = str(dict_df[value[0]][v[0]])
    # json_df = json.dumps(dict_df)
    # return json_df


@app.route("/user/profile/<string:username>")
@cross_origin()
def get_user_info(username):
    # print(username)
    response = df_to_json(User.read_profile(username))
    return response

@app.route("/user/receipts/<string:username>")
@cross_origin()
def get_user_receipts(username):
    # print(username)
    response = df_to_json(User.get_user_receipts(username))
    return response


@app.route("/user/profile/<string:username>/inc_crd")
@cross_origin()
def increase_credit(username):
    User.update(username, new_credit=10000)
    return "Increased"


@app.route("/user/profile/<string:username>/update_prof")
@cross_origin()
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
    response = df_to_json(Receipt._get_all(searchText=r_code))
    return response

@app.route("/categories/get_categories")
@cross_origin()
def get_categories():
    response = df_to_json(Category._get_all())
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
    response = df_to_json(Receipt._get_all())
    return response

@app.route("/product/all_product_list/")
@cross_origin()
def get_all_products():
    df = Product.get_all_products(orderBy='date')
    response = df_to_json(df)
    return response

@app.route("/product/<string:p_id>/")
@cross_origin()
def get_product(p_id):
    df = Product.get_product(p_id)
    response = df_to_json(df)
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
