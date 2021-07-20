from flask import Flask, request, render_template, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from backEnd import User, Product, Category
import os
import json
import datetime
from collections import defaultdict

from flask_restful.utils.cors import crossdomain

app = Flask(__name__, template_folder=os.path.abspath("../"))
# CORS(app)
api = Api(app)
app = Flask(__name__, template_folder="../")


def df_to_dict(df):
    dict_df = df.to_dict()
    print(dict_df)
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


@app.route("/user/profile/<string:username>")
def get_user_info(username):
    return df_to_dict(User.read_profile(username))


@app.route("/user/receipts/<string:username>")
def get_user_receipts(username):
    df = User.get_user_receipts(username)
    return df_to_dict(df)


@app.route("/product/product_list/")
@cross_origin()
def get_all_products():
    orderBy = request.args.get('orderBy')
    order = request.args.get('order')
    category = request.args.get('category')
    searchText = request.args.get('searchText')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    df = Product.get_all_products(orderBy=orderBy, order=order, filterCat=category, searchText=searchText,
                                  min_price=min_price, max_price=max_price)
    print(df)
    response = jsonify(df_to_dict(df))
    return response


@app.route("/category/category_list/")
@cross_origin()
def get_all_categories():
    df =    Category._get_all()
    response = jsonify(df_to_dict(df))
    return response


if __name__ == '__main__':
    app.run(port=5002)
