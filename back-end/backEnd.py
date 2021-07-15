import pyodbc
import pandas as pd 
import datetime

def connect_db():
    conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=DESKTOP-UH3DDJR;'
                      'Database=shop;'
                      'User=srmt;'
                      'Password=123'
                      'Trusted_Connection=yes;')
    return conn

def _log(massage):
    with open("logs/logs.txt",'a')as f:
        f.write(str(datetime.datetime.now())+" --- "+massage+"\n")

def check_categories(cat):
    conn = connect_db()
    cursor = conn.cursor()
    categories = [i[0] for i in pd.read_sql_query(f"SELECT * FROM Categories",conn).to_numpy()]
    if cat not in list(categories):
        cursor.execute("insert into Categories(name) values (?)",cat)
        _log(f"inserted category:{cat} to database")
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False

class Product:
    def __init__(self, name, price, available, sold=0, category="uncategorized", picture=None):
        conn = connect_db()
        cursor = conn.cursor()
        # check if category does not exist, insert it into database
        check_categories(category)

        self.name = name
        self.category = category
        self.price = price
        self.available = available
        self.sold = 0
        self.picture = picture

        cursor.execute("insert into Products(name, price, available, sold, category, picture) values (?,?,?,?,?,?)",
                                             name, price, available, sold, category, picture)
        conn.commit()
        sql_query = pd.read_sql_query(f"SELECT * FROM Products WHERE name='{name}' and price={price} and available={available} and category='{category}' and sold={sold}",conn)
        self.p_id = sql_query.iloc[-1]['p_id']
        _log(f"inserted product: p_id={self.p_id} and name='{name}' and price={price} and available={available} and category='{category}' and sold={sold}")
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
        sql_query = pd.read_sql_query(f"SELECT * FROM Products WHERE p_id='{p_id}'",conn)

        name, category, price, available, pic = sql_query['name'][0], sql_query['category'][0], sql_query['price'][0], sql_query['available'][0], sql_query['picture'][0]
        
        
        if new_name:
            name = new_name
        if new_cat:
            category = new_cat
            # check if new category does not exist, insert it into database
            check_categories(category)

        if new_price!=None:
            price = new_price
        if new_picture:
            picture = new_picture
        else:
            picture = 'null'
        if new_available!=None:
            available = new_available
        
        count = cursor.execute(f"update Products set name='{name}',price={price}, available={available},category='{category}', picture={picture} WHERE p_id={p_id}").rowcount
        conn.commit()
        _log(f"updated product with p_id={p_id} : name={name}, price={price}, available={available}, category={category}, picture={picture}")
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
        _log(f"updated product with p_id={p_id} : sold += {amount}")
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
        _log(f"Deleted product with p_id={p_id} ")
        conn.close()

    @staticmethod
    def _get_all():
        conn = connect_db()
        # cursor = conn.cursor()
        sql_query = pd.read_sql_query(f"SELECT * FROM Products", conn)
        conn.close()
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
        count = cursor.execute(f"update Categories set name='{new_name}' WHERE name={old_name}").rowcount
        conn.commit() # update is cascaded on products as well (catrgory foreign key)
        _log(f"updated Category '{old_name}' --> '{new_name}'")
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
        _log(f"Deleted Category '{name}'")
        conn.close()
    
    @staticmethod
    def _get_all():
        conn = connect_db()
        # cursor = conn.cursor()
        sql_query = pd.read_sql_query(f"SELECT * FROM Categories", conn)
        conn.close()
        return sql_query