from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, jwt_required, get_jwt, create_access_token, set_access_cookies, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
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
    
    # JWT Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False  # True in production if using HTTPS
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"  # or "None" if cross-site
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False # True in production
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # JWT error handlers
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"Invalid token error: {error}")  # Debug log
        return jsonify({
            'status': 422,
            'sub_status': 42,
            'message': 'Invalid token',
            'error': str(error)
        }), 422

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        print(f"Expired token: {jwt_data}")  # Debug log
        return jsonify({
            'status': 401,
            'sub_status': 42,
            'message': 'Token has expired'
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"Missing token: {error}")  # Debug log
        return jsonify({
            'status': 401,
            'sub_status': 42,
            'message': 'Missing token',
            'error': str(error)
        }), 401

    CORS(app,
         resources={r"/health": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         expose_headers=["Content-Type", "Authorization"])

    # Import and register blueprints
    from app.routes.auth.register import register_bp
    app.register_blueprint(register_bp)
    
    from app.routes.auth.login import login_bp
    app.register_blueprint(login_bp)

    from app.routes.bookmark.bookmark import bookmark_bp
    app.register_blueprint(bookmark_bp)

    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity(),
                                                   expires_delta=timedelta(minutes=30))
                set_access_cookies(response, access_token)
                return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original response
            return response


    @app.route('/health')
    @jwt_required()
    def health():
        try:
            current_user = get_jwt()
            print(f"JWT payload: {current_user}")  # Debug log
            user_id = current_user["sub"]  # This will now be a string
            return {
                "message": "Hello from Flask!", 
                "user_id": user_id,
            }, 200
        except Exception as e:
            print(f"Error in health route: {str(e)}")  # Debug log
            return jsonify({
                'message': 'Internal server error',
                'error': str(e)
            }), 500

    return app

