from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, jwt_required, get_jwt
from flask_bcrypt import Bcrypt

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Load environment variables
    load_dotenv()
    
    # Configure database
    db_url = URL.create(
        "postgresql",
        username=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        host=os.getenv("DATABASE_HOST"),
        port=int(os.getenv("DATABASE_PORT")),
        database=os.getenv("DATABASE_NAME")
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False  # True in production if using HTTPS
    app.config["JWT_COOKIE_SAMESITE"] = "None"  # or "None" if cross-site
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True  # or True if you want CSRF protection

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import and register blueprints
    from app.routes.register import register_bp
    app.register_blueprint(register_bp)
    
    from app.routes.login import login_bp
    app.register_blueprint(login_bp)

    @app.route('/health')
    @jwt_required()
    def health():
        current_user = get_jwt()
        return {"message": "Hello from Flask!", "user_id": current_user["sub"]}, 200

    return app