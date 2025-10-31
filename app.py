from flask import Flask, render_template, request, jsonify, url_for, session, render_template, redirect
from flask_cors import CORS
from pymongo import MongoClient
import os



# from flask import Flask, request, redirect, url_for, session, render_template






app = Flask(__name__, static_folder='static')  # Default is 'static'
CORS(app)  # Allow cross-origin requests if needed


app.secret_key = "supersecretkey"
app.config['SESSION_PERMANENT'] = False  # Session ends when browser closes

USER_CREDENTIALS = {"admin": "password123"}


# app.secret_key = "supersecretkey"  # Change this for security

# # Mock user credentials (replace with database validation)
# USER_CREDENTIALS = {"admin": "password123"}






# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.form.get('username')
#         password = request.form.get('password')

#         # Check credentials
#         if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
#             session['user'] = username  # Store session
#             return redirect("http://127.0.0.1:5000/cafe")  # Redirect to your site

#         return "Invalid credentials. Try again."

#     return '''
#     <form method="post">
#         <input type="text" name="username" placeholder="Username" required>
#         <input type="password" name="password" placeholder="Password" required>
#         <button type="submit">Login</button>
#     </form>
#     '''

# @app.route('/logout')
# def logout():
#     session.pop('user', None)  # Remove session
#     return redirect(url_for('login'))

# @app.route('/cafe')
# def cafe():
#     if 'user' not in session:
#         return redirect(url_for('login'))  # Redirect if not logged in
#     return redirect("http://127.0.0.1:5000/cafe")













@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # username = request.form['username']
        # password = request.form['password']
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
            session['user'] = username
            return jsonify({"success": True, "redirect": url_for('cafe')})
        return jsonify({"success": False, "message": "Invalid credentials"}), 401
    
    return render_template('login.html')

@app.route('/cafe')
def cafe():
    if 'user' not in session:
        print("OOO NOT LOGGED IN ARE WE")  # Strictly check session
        return redirect(url_for('login')) 
    print("chill bill") # Force login if not authenticated
    print(session)
    session.clear()
    return render_template('cafe.html')  # Serve cafe page only if logged in


@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove session data
    return redirect(url_for('login'))














# MongoDB Connection
MONGO_URI = "mongodb+srv://sbudhdev:Black!23=;h@your-sight.zl5ej.mongodb.net/Sandwhich?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client.Sandwhich  # Database name
orders_collection = db.sandwich  # Updated collection name
filters_collection = db.filters
# ==================== STUDENT SIDE ====================
# dnlwhqor
# b70fb4b0-4bd9-4ec2-ae72-e84234069b6d
@app.route('/')
def student_page():
    """Renders the student order page."""
    return render_template('student.html')

# @app.route('/submit_order', methods=['POST'])
# def submit_order():
#     """Handles order submission and stores it in MongoDB."""
#     data = request.get_json()
#     if not data or "name" not in data or "ingredient" not in data:
#         return jsonify({"error": "Invalid data"}), 400
    
#     order = {
#         "name": data["name"],
#         "ingredient": data["ingredient"]
#     }
    
#     orders_collection.insert_one(order)
#     return jsonify({"message": "Order submitted successfully!"}), 201
@app.route('/submit_order', methods=['POST'])
def submit_order():
    """Handles order submission and stores it in MongoDB."""
    data = request.get_json()
    if not data or "name" not in data or "ingredients" not in data:
        return jsonify({"error": "Invalid data"}), 400

    order = {
        "name": data["name"],
        "ingredients": data["ingredients"],  # Store ingredients as an array
        "allergens": data["allergy"]  # Store allergens if provided
    }

    orders_collection.insert_one(order)
    return jsonify({"message": "Order submitted successfully!"}), 201


    order = {
        "name": data["name"],
        "ingredients": data["ingredients"]  # Store ingredients as an array
    }

    orders_collection.insert_one(order)
    return jsonify({"message": "Order submitted successfully!"}), 201
# ==================== CAFE SIDE ====================

# @app.route('/cafe')
# def cafe_page():
#     """Renders the cafe orders page."""
#     return render_template('cafe.html')




# EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE



# @app.route('/get_orders', methods=['GET'])
# def get_orders():
#     """Fetches all orders from MongoDB and sends them as JSON."""
#     orders = list(orders_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
#     return jsonify(orders)
# @app.route('/get_orders', methods=['GET'])
# def get_orders():
#     """Fetches all orders from the database."""
#     orders = orders_collection.find()  # Fetch all orders
#     order_list = [{"name": order["name"], "ingredient": order["ingredient"]} for order in orders]
#     return jsonify(order_list)
@app.route('/get_orders', methods=['GET'])
def get_orders():
    """Fetches all orders from the database."""
    orders = list(orders_collection.find({}, {'_id': 0}))  # Exclude _id from the response
    return jsonify({"orders": orders})


@app.route('/clear_orders', methods=['POST'])
def clear_orders():
    """Clears all orders from the database."""
    orders_collection.delete_many({})
    return jsonify({"message": "All orders cleared"}), 200


# @app.route('/clear_orders', methods=['POST'])
# def clear_orders():
#     """Clears all orders from the database."""
#     orders_collection.delete_many({})
#     return jsonify({"message": "All orders cleared"}), 200



@app.route('/update_disabled', methods=['POST'])
def update_disabled():
    """Updates the 'Disabled' field for items in the disabled list to 0."""
    data = request.get_json()
    disabled_items = data.get("disabled_items", [])
    all_ingredients = ["Baguette", "Wrap", "Cheese", "Vegetable spread", "Mayonnaise", "Barbecue sauce", "Mustard", "Sriracha", "Sweet chilli", "Turkey", "Beef Pastrami", "Salami", "Prosciutto", "Chorizo", "Ham", "Lettuce", "Cucumber", "Tomato","Red Onio", "Gherkin", "Jalapeno", "Sweetcorn", "Bell pepper" ]
    active_ingredients = [item for item in all_ingredients if item not in disabled_items]
    for item in disabled_items:
        db.ingredients.update_one({"_id": item}, {"$set": {"Disabled": 1}})
        filters_collection.update_one({"_id": item}, {"$set": {"Disabled": 1}})
    print(disabled_items)
    for item in active_ingredients:
        db.ingredients.update_one({"_id": item}, {"$set": {"Disabled": 0}})
        filters_collection.update_one({"_id": item}, {"$set": {"Disabled": 0}})
        
    print(active_ingredients)

    return jsonify({"message": "Disabled items updated successfully!"}), 200





@app.route('/get_disabled_ingredients', methods=['GET'])
def get_disabled_ingredients():
    """Fetches all document IDs where the Disabled field is set to 1."""
    disabled_docs = filters_collection.find({"Disabled": 1}, {"_id": 1})  # Get only the _id field
    disabled_ids = [str(doc["_id"]) for doc in disabled_docs]  # Convert ObjectId to string if needed
    print("FISHHHHH")
    print(disabled_ids)
    enabled_docs = filters_collection.find({"Disabled": 0}, {"_id": 1})  # Get only the _id field
    enabled_ids = [str(doc["_id"]) for doc in enabled_docs]  # Convert ObjectId to string if needed
    
    return jsonify({"disabled_ids": disabled_ids, "enabled_ids":enabled_ids})

@app.route('/list_disabled_ingredients', methods=['GET'])
def list_disabled_ingredients():
    """Fetches all document IDs where the Disabled field is set to 1."""
    disabled_docs = filters_collection.find({"Disabled": 1}, {"_id": 1})  # Get only the _id field
    disabled_ids = [str(doc["_id"]) for doc in disabled_docs]  # Convert ObjectId to string if needed
    print("FISHHHHH")
    print(disabled_ids)
    
    
    return jsonify({"disabled_ids": disabled_ids})






# ==================== RUN APP ====================

if __name__ == '__main__':
    app.run(debug=True)
