import pyodbc
import pandas as pd
import datetime
import string
import random
import re


def connect_db():
    conn = pyodbc.connect('Driver={SQL Server};'
                          'Server=DESKTOP-UH3DDJR;'
                          'Database=shop;'
                          'User=srmt;'
                          'Password=123'
                          'Trusted_Connection=yes;')
    return conn


def _log(massage):
    with open("static/logs/logs.txt", 'a', encoding="utf-8")as f:
        f.write(str(datetime.datetime.now()) + " --- " + massage + "\n")


def check_categories(cat):
    conn = connect_db()
    cursor = conn.cursor()
    categories = [i[0] for i in pd.read_sql_query(f"SELECT * FROM Categories", conn).to_numpy()]
    if cat not in list(categories):
        cursor.execute("insert into Categories(name) values (?)", cat)
        _log(f"inserted category:{cat} to database")
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False


class Product:
    def __init__(self, name, price, available, sold=0, category="uncategorized", picture="null"):
        self.name = name
        self.category = category
        self.price = price
        self.available = available
        self.sold = 0
        self.picture = picture

    @staticmethod
    def insert_product(self, category):
        conn = connect_db()
        cursor = conn.cursor()
        # check if category does not exist, insert it into database
        check_categories(self.category)
        cursor.execute("insert into Products(name, price, available, sold, category, picture) values (?,?,?,?,?,?)",
                       self.name, self.price, self.available, self.sold, self.category, self.picture)
        conn.commit()
        sql_query = pd.read_sql_query(
            f"SELECT * FROM Products WHERE name='{self.name}' and price={self.price} and available={self.available} and category='{self.category}' and sold={self.sold}",
            conn)
        self.p_id = sql_query.iloc[-1]['p_id']
        _log(
            f"inserted product: p_id={self.p_id} and name='{self.name}' and price={self.price} and available={self.available} and category='{self.category}' and sold={self.sold}")
        conn.close()

    def update_self(self, new_name=None, new_cat=None, new_price=None, new_available=None, new_picture=None):
        if new_name:
            self.name = new_name
        if new_cat:
            self.category = new_cat
        if new_price:
            self.price = new_price
        if new_picture:
            self.picture = new_picture
        if new_available:
            self.available = new_available

        Product.update(self.p_id, self.name, self.category, self.price, self.available, self.picture)

    @staticmethod
    def update(p_id, new_name=None, new_cat=None, new_price=None, new_available=None, new_picture=None):
        conn = connect_db()
        cursor = conn.cursor()
        sql_query = pd.read_sql_query(f"SELECT * FROM Products WHERE p_id='{p_id}'", conn)

        name, category, price, available, pic = sql_query['name'][0], sql_query['category'][0], sql_query['price'][0], \
                                                sql_query['available'][0], sql_query['picture'][0]

        if new_name:
            name = new_name
        if new_cat:
            category = new_cat
            # check if new category does not exist, insert it into database
            check_categories(category)

        if new_price != None:
            price = new_price
        if new_picture:
            picture = new_picture
        else:
            picture = pic
        if new_available != None:
            available = new_available


        count = cursor.execute(
            f"update Products set name='{name}',price={price}, available={available},category='{category}', picture='{picture}' WHERE p_id={p_id}").rowcount
        conn.commit()
        _log(
            f"updated product with p_id={p_id} : name={name}, price={price}, available={available}, category={category}, picture={picture} [{count} rows affected]")
        conn.close()

    def available_dec_self(self, amount=1):
        if self.available >= amount:
            self.available -= amount
            Product.available_dec(self.p_id, amount)
        else:
            _log(f"product with p_id={self.p_id} : available < amount - action failed")

    @staticmethod
    def available_dec(p_id, amount=1):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"update Products set available=available - {amount} WHERE p_id={p_id}").rowcount
        conn.commit()
        _log(f"updated product with p_id={p_id} : available -= {amount} [{count} rows affected]")
        conn.close()

    def sold_inc_self(self, amount=1):
        self.sold += amount
        Product.sold_inc(self.p_id, amount)

    @staticmethod
    def sold_inc(p_id, amount=1):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"update Products set sold=sold + {amount} WHERE p_id={p_id}").rowcount
        conn.commit()
        _log(f"updated product with p_id={p_id} : sold += {amount} [{count} rows affected]")
        conn.close()

    def delete_self(self):
        self.name = None
        self.picture = None
        self.sold = None
        self.price = None
        self.category = None

    @staticmethod
    def delete(p_id):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"DELETE FROM Products WHERE p_id={p_id}").rowcount
        conn.commit()
        _log(f"Deleted product with p_id={p_id}  [{count} rows affected]  ")
        conn.close()

    @staticmethod
    def get_all_products(orderBy=None, order=None, filterCat=None, searchText=None, min_price=None, max_price=None):
        conn = connect_db()
        if orderBy is None:
            orderBy = 'sold'
        if order is None:
            order = 'desc'
        if searchText is None:
            searchText = ''
        if min_price is None:
            min_price = 0
        if filterCat is None:  # No category filter available
            if max_price is not None:
                sql_query = pd.read_sql_query(
                    f"SELECT * FROM Products WHERE name LIKE '%{searchText}%' and price between {min_price} and {max_price} ORDER BY {orderBy} {order}",
                    conn)
            else:
                sql_query = pd.read_sql_query(
                    f"SELECT * FROM Products WHERE name LIKE '%{searchText}%' and price >= {min_price} ORDER BY {orderBy} {order}",
                    conn)
        else:  # category filter available
            filterCat = tuple(filterCat.split(","))
            if len(filterCat) == 1:
                filterCat = filterCat[0]
                if max_price is not None:
                    sql_query = pd.read_sql_query(
                        f"SELECT * FROM Products WHERE category = '{filterCat}' and name LIKE '%{searchText}%' and price between {min_price} and {max_price} ORDER BY {orderBy} {order}",
                        conn)
                else:
                    sql_query = pd.read_sql_query(
                        f"SELECT * FROM Products WHERE category = '{filterCat}' and name LIKE '%{searchText}%' and price > {min_price} ORDER BY {orderBy} {order}",
                        conn)
            else:
                if max_price is not None:
                    sql_query = pd.read_sql_query(
                        f"SELECT * FROM Products WHERE category in {filterCat} and name LIKE '%{searchText}%' and price between {min_price} and {max_price} ORDER BY {orderBy} {order}",
                        conn)
                else:
                    sql_query = pd.read_sql_query(
                        f"SELECT * FROM Products WHERE category in {filterCat} and name LIKE '%{searchText}%' and price > {min_price} ORDER BY {orderBy} {order}",
                        conn)
        conn.close()
        return sql_query
    
    @staticmethod
    def get_product(p_id):
        conn = connect_db()
        sql_query = pd.read_sql_query(f"SELECT * FROM Products WHERE p_id={p_id}", conn)
        return sql_query

class Category:
    def __init__(self, name):
        self.name = name
        # insert the category if it doesn't already exits
        if check_categories(name):
            print("added categoey")
        else:
            print("category already exists")

    @staticmethod
    def update(old_name, new_name):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"update Categories set name='{new_name}' WHERE name='{old_name}'").rowcount
        conn.commit()  # update is cascaded on products as well (catrgory foreign key)
        _log(f"updated Category '{old_name}' --> '{new_name}' [{count} rows affected] ")
        conn.close()

    def update_self(self, new_name):
        Category.update(self.name, new_name)
        self.name = new_name

    @staticmethod
    def delete(name):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"DELETE FROM Categories WHERE name='{name}'").rowcount
        conn.commit()
        _log(f"Deleted Category '{name}' [{count} rows affected] ")
        conn.close()

    @staticmethod
    def _get_all():
        conn = connect_db()
        # cursor = conn.cursor()
        sql_query = pd.read_sql_query(f"SELECT * FROM Categories", conn)
        conn.close()
        return sql_query


class Receipt:
    def __init__(self, name, buyer_username, number_sold, buyer_firstname, buyer_lastname, buyer_address, price, status='Pending'):
        self.r_code = self.generate_r_code()
        self.name = name
        self.buyer_username = buyer_username
        self.number_sold = number_sold
        self.buyer_firstname = buyer_firstname
        self.buyer_lastname = buyer_lastname
        self.buyer_address = buyer_address
        self.price = price
        self.buy_date = (datetime.datetime.now()).strftime("%Y-%m-%d %H:%M:%S")
        self.status = status

    def generate_r_code(self):
        conn = connect_db()
        cursor = conn.cursor()
        generated_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        all_r_codes = cursor.execute("select r_code from Receipts")
        while generated_code in all_r_codes:
            generated_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        conn.close()
        return generated_code

    def insert_receipt(self):
        conn = connect_db()
        cursor = conn.cursor()
        print(self.r_code, self.name, self.number_sold, self.buyer_firstname, self.buyer_lastname,
              self.buyer_address, self.price, self.buy_date, self.status)
        cursor.execute("insert into Receipts(r_code, name, number_sold, buyer_firstname, buyer_lastname, "
                       "buyer_address, price, buy_date, status) values (?,?,?,?,?,?,?,?,?)",
                       self.r_code, str(self.name), str(self.number_sold), str(self.buyer_firstname),
                       str(self.buyer_lastname),
                       str(self.buyer_address), int(self.price), str(self.buy_date), str(self.status))
        cursor.execute("insert into USer_Receipts (username, r_code) values (?, ?)", self.buyer_username, self.r_code)
        conn.commit()
        sql_query = pd.read_sql_query(
            f"SELECT * FROM Receipts WHERE r_code='{self.r_code}' and name='{self.name}' and number_sold={self.number_sold} and buyer_firstname='{self.buyer_firstname}' and buyer_lastname='{self.buyer_lastname}' and buyer_address='{self.buyer_address}' and price={self.price} and buy_date='{self.buy_date}' and status='{self.status}'",
            conn)
        self.r_code = sql_query.iloc[-1]['r_code']
        _log(
            f"inserted receipt: r_code={self.r_code} and name='{self.name}' and number_sold={self.number_sold} and buyer_firstname={self.buyer_firstname} buyer_lastname='{self.buyer_lastname}' and buyer_address='{self.buyer_address}' and price={self.price} and buy_date='{self.buy_date}' and status={self.status}")
        _log(f"inserted into User_receipts : user:{self.buyer_username} --> Receipt:{self.r_code}")
        conn.close()

    @staticmethod
    def _get_all(orderBy='buy_date', order='desc', searchText=''):
        conn = connect_db()
        # cursor = conn.cursor()
        sql_query = pd.read_sql_query(
            f"SELECT * FROM Receipts WHERE r_code LIKE '%{searchText}%' ORDER BY {orderBy} {order}", conn)
        conn.close()
        return sql_query


class User:
    def __init__(self, username, password, name=None, lastname=None, address=None):
        self.username = username
        self.password = password
        self.name = name
        self.lastname = lastname
        self.address = address
        self.credit = 0
        self.logins_status = False

    def sign_up(self):  # IN PHASE THREE ONLY USERNAME AND PASSWORD ARE MANDATORY - IN PHASE 2 ALL FIELDS ARE MANDATORY!
        conn = connect_db()
        cursor = conn.cursor()
        sql_query = pd.read_sql_query(f"SELECT username FROM Users WHERE username = '{self.username}'", conn)
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if sql_query.empty and self.password.isalnum() and re.match(regex, self.username) \
                and self.check_length_validity_or_none(self.username, 255) and \
                self.check_length_validity_or_none(self.password, 255, 8) and \
                self.check_length_validity_or_none(self.name, 255) and \
                self.check_length_validity_or_none(self.lastname, 255) and \
                self.check_length_validity_or_none(self.address, 1000):
            cursor.execute(
                "insert into Users(username, password, name, lastname, address, credit) values (?,?,?,?,?,?)",
                self.username, self.password, self.name, self.lastname, self.address, 0)
            conn.commit()
            _log(
                f"inserted user: username={self.username} and password='{self.password}' and name={self.name} and lastname={self.lastname} and address='{self.address}' and credit={0}")
        else:
            _log(
                f"user: username={self.username} - cannot add user to database")
        conn.close()

    def sign_in(self):  # CHANGE AFTER ADDING JWT
        conn = connect_db()
        sql_query = pd.read_sql_query(f"SELECT password FROM Users WHERE username = '{self.username}'", conn)
        if sql_query.iloc[0]['password'] == self.password and not sql_query.empty:
            print("Successful")
            self.logins_status = True
            return True
        print("not successful")
        return False

    @staticmethod
    def check_length_validity_or_none(input_check, max_length, min_length=0):
        if input_check is None:
            return True
        if min_length <= len(input_check) <= max_length:
            return True
        return False

    @staticmethod
    def read_profile(username):
        conn = connect_db()
        sql_query = pd.read_sql_query(f"SELECT * FROM Users WHERE username ='{username}'", conn)
        conn.close()
        return sql_query

    def get_self_receipts(self):
        conn = connect_db()
        sql_query = pd.read_sql_query(
            f"SELECT * FROM Receipts r inner join User_Receipts ur on r.r_code = ur.r_code WHERE ur.username = '{self.username}'",
            conn)
        conn.close()
        return sql_query
    
    @staticmethod
    def get_user_receipts(username):
        conn = connect_db()
        sql_query = pd.read_sql_query(f"SELECT * FROM User_Receipts WHERE username = '{username}'", conn)
        conn.close()
        return sql_query

    def update_self(self, new_password=None, new_name=None, new_lastname=None, new_address=None, credit_difference=0):
        if new_password:
            self.password = new_password
        if new_name:
            self.name = new_name
        if new_lastname:
            self.lastname = new_lastname
        if new_address:
            self.address = new_address
        if credit_difference != 0:
            self.credit += credit_difference

        User.update(self.username, self.password, self.name, self.lastname, self.address, self.credit)

    @staticmethod
    def update(username, new_password=None, new_name=None, new_lastname=None, new_address=None, new_credit=None):
        conn = connect_db()
        cursor = conn.cursor()
        sql_query = pd.read_sql_query(f"SELECT * FROM Users WHERE username='{username}'", conn)

        password, name, lastname, address, credit = sql_query['password'][0], sql_query['name'][0], \
                                                    sql_query['lastname'][0], \
                                                    sql_query['address'][0], sql_query['credit'][0]

        print(password, name, lastname, address, credit)

        if new_password:
            password = new_password
        if new_name:
            name = new_name
        if new_lastname:
            lastname = new_lastname
        if new_address:
            address = new_address
        if new_credit:
            credit += new_credit
        
        count = cursor.execute(
            f"update Users set password='{password}',name='{name}' , lastname='{lastname}',address='{address}', credit={credit} WHERE username='{username}'").rowcount
        conn.commit()
        _log(
            f"updated user with username={username} : password={password}, name={name}, lastname={lastname}, address={address}, credit={credit} [{count} rows affected] ")
        conn.close()

    def inc_credit_self(self, amount=0):
        print(self.credit)
        self.credit += amount
        User.inc_credit(self.username, amount)

    @staticmethod
    def inc_credit(username, amount=0):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"update Users set credit=credit + {amount} WHERE username='{username}'").rowcount
        conn.commit()
        _log(f"updated user with username={username} : credit += {amount} [{count} rows affected] ")
        conn.close()

    def delete_self(self):
        self.password = None
        self.name = None
        self.lastname = None
        self.address = None
        self.credit = None
        self.delete(self.username)

    @staticmethod
    def delete(username):
        conn = connect_db()
        cursor = conn.cursor()
        count = cursor.execute(f"DELETE FROM Users WHERE username='{username}'").rowcount
        conn.commit()
        _log(f"Deleted user with username={username}  [{count} rows affected] ")
        conn.close()

    @staticmethod
    def buy_product(username, product_id, amount=1):
        # THE FIRST THREE LINES COULD BE REFACTORED AS A METHOD IN PRODUCT (SIMILAR TO read_profile IN USER)
        conn = connect_db()
        cursor = conn.cursor()
        product_desc = pd.read_sql_query(f"SELECT * FROM Products WHERE p_id ='{product_id}'", conn)
        current_user = User.read_profile(username)
        if current_user.iloc[0]['credit'] >= product_desc.iloc[0]['price'] * amount and amount < product_desc.iloc[0][
            'available']:
            new_receipt = Receipt(product_desc.iloc[0]['name'], amount, current_user.iloc[0]['name'],
                                  current_user.iloc[0]['lastname'], current_user.iloc[0]['address'],
                                  product_desc.iloc[0]['price'], 'Pending')
            new_receipt.insert_receipt()
            cursor.execute("insert into User_Receipts(username, r_code) values (?, ?)", username, new_receipt.r_code)
            conn.commit()
            User.inc_credit(username, -product_desc.iloc[0]['price'] * amount)
            Product.available_dec(product_id, amount)
            Product.sold_inc(product_id, amount)
        conn.close()

    @staticmethod
    def get_all_users():
        conn = connect_db()
        sql_query = pd.read_sql_query(
            f"SELECT * FROM Users",
            conn)
        conn.close()
        idList = sql_query['username'].tolist()
        sql_query['id'] = idList
        return sql_query