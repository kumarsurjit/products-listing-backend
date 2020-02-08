# Products listing APIs
NodeJS, ExpressJS and Mysql Application for product
## Software Requirements
Following are the requirement for this application

- NodeJS **10+**
- MySql
- Python **3**
- pip
## Config
Update the database config in the following file.

```config/config.json```
## Installation
Run the following command to install the dependencies

```npm install```

For database migration run following command

```npm run db:migrate```

Then run the following command to install python dependencies

```pip install -r requirements.txt```


Then run the following command to insert data from csv file for csv format reference please check `products.csv`

```python insert_products.py <csv_file_location>```

To start the application execute

```npm start```

