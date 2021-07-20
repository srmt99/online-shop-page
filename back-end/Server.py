from flask import Flask, request, render_template, jsonify
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from backEnd import User, Product, Category
import datetime
from collections import defaultdict


app = Flask(__name__)
CORS(app)
api = Api(app)
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
    if username not in userid_table or password not in password_table:
        return jsonify({"msg": "Bad username or password"}), 401
    elif userid_table[username] != password_table[password]:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=username)
    print("TOKEN:")
    print(jsonify(access_token=access_token))
    return jsonify(access_token=access_token)


# Protected resource with jwt example
@app.route("/protected/", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


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
    df = Category._get_all()
    response = jsonify(df_to_dict(df))
    return response


if __name__ == '__main__':
    app.run(port=5002)
