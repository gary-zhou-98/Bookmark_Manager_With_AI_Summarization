from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, URL

# Load environment variables first, before any database imports
load_dotenv()

db_url = URL.create(
        "postgresql",
        username=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),  # Get password from environment
        host=os.getenv("DATABASE_HOST"),
        port=int(os.getenv("DATABASE_PORT")),  # port needs to be an integer
        database=os.getenv("DATABASE_NAME")
)

print(f"Attempting to connect to: {db_url}")

try:
    engine = create_engine(db_url)
    connection = engine.connect()
    print("Successfully connected to the database!")
    connection.close()
except Exception as e:
    print(f"Error connecting to the database: {str(e)}") 