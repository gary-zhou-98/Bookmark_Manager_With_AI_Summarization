from app import db
from app.models import User
from app.service.authService import hash_password
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies

register_bp = Blueprint("register", __name__)
CORS(register_bp, 
     resources={r"/auth/register": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

@register_bp.post("/auth/register")
def register():
  data = request.json
  email = data.get("email")
  password = data.get("password")

  if not email or not password:
    return jsonify({"error": "Email and password are required"}), 400
  
  # Check if user already exists
  if User.query.filter_by(email=email).first():
    return jsonify({"error": "User already exists"}), 400

  hashed_password = hash_password(password)

  new_user = User(email=email, password=hashed_password)
  try:
    db.session.add(new_user)
    db.session.commit()
    # Create access token
    access_token = create_access_token(identity=new_user.id)
    refresh_token = create_refresh_token(identity=new_user.id)
    response = jsonify({
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "user_id": new_user.id
      })

    set_access_cookies(response, access_token)

    return response, 201
  except Exception as e:
    print(f"Error registering user: {e}")
    db.session.rollback()
    return jsonify({"error": "Failed to register user"}), 500
