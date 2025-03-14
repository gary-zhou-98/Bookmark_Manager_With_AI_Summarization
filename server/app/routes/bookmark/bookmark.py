from app import db
from app.models import Bookmark, User
from flask import request, jsonify, Blueprint
from flask_jwt_extended import ( jwt_required, 
                                get_jwt_identity)
from flask_cors import CORS

bookmark_bp = Blueprint("bookmark", __name__)
CORS(bookmark_bp, 
     resources={r"/bookmark/*": {"origins" : ["http://localhost:3000", "http://127.0.0.1:3000"]}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@bookmark_bp.post("/bookmark")
@jwt_required()
def create_bookmark():
    data = request.json
    user_id = get_jwt_identity()
    url = data.get("url")
    title = data.get("title")

    if not url or not title or not user_id:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if the bookmark already exists
    existing_bookmark = Bookmark.query.filter_by(url=url, user_id=user_id).first()
    if existing_bookmark:
       return jsonify({"error": "Bookmark already exists"}), 400
    
    # TODO: @gary-zhou-98 invoke APIs to generate favicon_url and summary
    
    new_bookmark = Bookmark(
        url=url,
        title=title,
        user_id=user_id
    )

    try:
      db.session.add(new_bookmark)
      db.session.commit()

      return jsonify({"bookmark": new_bookmark.to_dict()}), 201
    except Exception as e:
      db.session.rollback()
    return jsonify({"error": "Failed to create bookmark"}), 500

@bookmark_bp.get("/bookmarks")
@jwt_required()
def get_bookmarks():
    user_id = get_jwt_identity()
    if not user_id:
       return jsonify({"error": "Missing user authentication"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    if not user:
       return jsonify({"error": "User not found"}), 404
    
    bookmarks = user.bookmarks
    return jsonify({"bookmarks": [bookmark.to_dict() for bookmark in bookmarks]}), 200

@bookmark_bp.delete("/bookmark/<int:bookmark_id>")
@jwt_required()
def delete_bookmark(bookmark_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Missing user authentication"}), 401
    
    bookmark = Bookmark.query.filter_by(id=bookmark_id, user_id=user_id).first()
    
    if not bookmark:
        return jsonify({"error": "Bookmark not found"}), 404
    
    try:
      db.session.delete(bookmark)
      db.session.commit()
      return jsonify({"message": "Bookmark deleted successfully"}), 200
    except Exception as e:
      db.session.rollback()
      return jsonify({"error": "Failed to delete bookmark"}), 500

