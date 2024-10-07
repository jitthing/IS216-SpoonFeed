from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myapp"
mongo = PyMongo(app)
CORS(app)

# placeholder api routes for our DB
@app.route('/api/items', methods=['GET'])
def get_items():
    items = mongo.db.items.find()
    return jsonify([{"id": str(item["_id"]), "name": item["name"]} for item in items])

@app.route('/api/items', methods=['POST'])
def add_item():
    item = request.json
    result = mongo.db.items.insert_one(item)
    return jsonify({"id": str(result.inserted_id), "name": item["name"]}), 201

if __name__ == '__main__':
    app.run(debug=True)