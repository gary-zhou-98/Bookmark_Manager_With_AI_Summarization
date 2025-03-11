from app.models import User
from app.service.authService import check_password
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies
from flask_cors import CORS

login_bp = Blueprint("login", __name__)
CORS(login_bp, 
     resources={r"/auth/login": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)


@login_bp.post("/auth/login")
def login():
  data = request.json
  email = data.get("email")
  password = data.get("password")

  if not email or not password:
    return jsonify({"error": "Email and password are required"}), 400
  
  user = User.query.filter_by(email=email).first()
  # Check if user exists
  if not user:
    return jsonify({"error": "User does not exist"}), 400

  # Check if password is correct
  if not check_password(user.password, password):
    return jsonify({"error": "Invalid password"}), 401

  # Create access token
  access_token = create_access_token(identity=user.id)
  refresh_token = create_refresh_token(identity=user.id)

  response = jsonify({
    "access_token": access_token, 
    "refresh_token": refresh_token,
    "user_id": user.id
  })

  set_access_cookies(response, access_token)

  return response, 200
