from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

db = SQLAlchemy()


def create_app():
    # Load environment variables
    load_dotenv()
    
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize DB with app
    db.init_app(app)

    @app.route('/health')
    def health():
        return {"message": "Hello from Flask!"}, 200

    return app