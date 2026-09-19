import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )


if __name__ == "__main__":

    try:
        connection = get_connection()

        print("Database connected successfully!")

        connection.close()

    except Exception as e:

        print("Database connection failed!")
        print(e)