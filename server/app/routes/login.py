from app.models import User
from app.service.authService import check_password
from flask import request, jsonify, Blueprint
from flask_jwt_extended import (create_access_token, 
                                set_access_cookies, 
                                unset_jwt_cookies, 
                                jwt_required, 
                                get_jwt_identity)
from flask_cors import CORS
from datetime import timedelta

login_bp = Blueprint("login", __name__)
CORS(login_bp, 
     resources={r"/auth/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
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

  # Create access token with string user ID
  access_token = create_access_token(
    identity=str(user.id),  # Convert ID to string
    additional_claims={"email": user.email},
    expires_delta=timedelta(minutes=15)
  )
  
  response = jsonify({
    "user": user.to_dict()
  })

  # Set cookies and debug
  set_access_cookies(response, access_token)
  return response, 200

@login_bp.post("/auth/logout")
@jwt_required()
def logout():
  user = get_jwt_identity()
  if not user:
    return jsonify({"error": "User not found"}), 401
  
  response = jsonify({"message": "Logged out successfully"})
  unset_jwt_cookies(response)
  return response, 200

