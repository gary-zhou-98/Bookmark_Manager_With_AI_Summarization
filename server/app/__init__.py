from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)
db = SQLAlchemy()
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

def create_app():
    # Load environment variables
    load_dotenv()
    db_url = URL.create(
        "postgresql",
        username=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),  # Get password from environment
        host=os.getenv("DATABASE_HOST"),
        port=int(os.getenv("DATABASE_PORT")),  # port needs to be an integer
        database=os.getenv("DATABASE_NAME")
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")

    db.init_app(app)

    @app.route('/health')
    def health():
        return {"message": "Hello from Flask!"}, 200

    return app