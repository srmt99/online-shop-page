from flask import Flask, request, render_template
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from backEnd import User
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
    print(username)
    response = df_to_json(User.read_profile(username))
    return response


@app.route("/user/receipts/<string:username>")
def get_user_receipts(username):
    df = User.get_user_receipts(username)
    return df_to_json(df)


if __name__ == '__main__':
    app.run(port=5002)
