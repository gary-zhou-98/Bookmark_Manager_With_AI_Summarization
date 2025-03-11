from app import db
from app.models import User
from app.service.authService import hash_password
from flask import request, jsonify, Blueprint
from flask_cors import CORS

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
  except Exception as e:
    print(f"Error registering user: {e}")
    db.session.rollback()
    return jsonify({"error": "Failed to register user"}), 500

  return jsonify({"message": "User registered successfully"}), 201
