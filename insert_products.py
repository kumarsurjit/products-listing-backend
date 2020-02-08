import csv
import sys
import json
from datetime import datetime
import mysql.connector
from os import path
from mysql.connector import Error


def read_csv(file):
    with open(file) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                pass
            else:
                create_product(row)
            line_count +=1

def get_products(file):
    read_csv(file)

def trim_and_lower_case(str):
    return str.strip().lower()

def create_product(details):
    categories = check_category(list(map(trim_and_lower_case, details[0].split(','))))
    product = {
        'name': details[1],
        'description': details[2],
        'price': details[3],
        'categories': categories
    }
    insert_product(product)

def insert_product(product):
    insert_cursor = connection.cursor(prepared=True)
    query = """INSERT INTO `products`(`name`, `description`, `price`, `createdAt`, `updatedAt`) VALUES(%s, %s, %s, %s, %s)"""
    record = (product['name'], product['description'], product['price'], current, current)
    insert_cursor.execute(query, record)
    product_id = insert_cursor.lastrowid
    relation_query = """INSERT INTO `product_categories`(`productId`, `categoryId`) VALUES(%s, %s)"""
    for category in product['categories']:
        insert_cursor.execute(relation_query, (product_id, category))
    connection.commit()
    insert_cursor.close()


def check_category(categories):
    category_list = []
    for category in categories:
        category_list.append(category_exists(category))
    return category_list


def category_exists(category):
    query = "SELECT * FROM `categories` WHERE `name` = '" + category + "'"
    cursor.execute(query)
    if cursor.rowcount == 0:
        return create_category(category)
    category = cursor.fetchone()
    return category[0]

def create_category(name):
    insert_cursor = connection.cursor(prepared=True)
    query = """insert into categories(`name`, `createdAt`, `updatedAt`) values(%s, %s, %s)"""
    record = (name, current, current)
    insert_cursor.execute(query, record)
    category_id = insert_cursor.lastrowid
    connection.commit()
    return category_id


try:
    with open('config/config.json') as file:
        config = json.load(file)
    current = datetime.now()
    current = current.strftime('%Y-%m-%d %H:%M:%S')
    filePath = sys.argv[1]
    if not path.exists(filePath):
        raise Exception('file does not exists')
    connection = mysql.connector.connect(host=config['host'], database=config['database'], user=config['username'], password=config['password'])
    if connection.is_connected():
        cursor = connection.cursor(buffered=True)
        get_products(filePath)
except Error as e:
    print("Error while connecting to MySQL", e)
    exit(0)
except Exception as e:
    print("error", e)
    exit(0)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")

