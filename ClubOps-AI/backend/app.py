from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
from database import get_connection

app = Flask(__name__)
CORS(app)


# ---------------- HOME ----------------
@app.route("/")
def home():
    return jsonify({
        "message": "ClubOps AI backend is running!"
    })


# ---------------- SIGNUP ----------------
@app.route("/api/signup", methods=["POST"])
def signup():

    data = request.get_json()

    # Get data from frontend
    role = data.get("role")
    full_name = data.get("full_name")
    roll_no = data.get("roll_no")
    department = data.get("department")
    club_name = data.get("club_name")
    club_category = data.get("club_category")
    phone = data.get("phone")
    interest = data.get("interest")
    email = data.get("email")
    password = data.get("password")
    terms_accepted = data.get("terms_accepted", False)

    # Basic validation
    if not role or not full_name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Please fill all required fields."
        }), 400

    if not terms_accepted:
        return jsonify({
            "success": False,
            "message": "Please accept the terms and conditions."
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check whether email already exists
        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "success": False,
                "message": "Email already registered."
            }), 409

        # Hash password
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Insert user
        query = """
            INSERT INTO users
            (
                role,
                full_name,
                roll_no,
                department,
                club_name,
                club_category,
                phone,
                interest,
                email,
                password,
                terms_accepted
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            role,
            full_name,
            roll_no,
            department,
            club_name,
            club_category,
            phone,
            interest,
            email,
            hashed_password,
            terms_accepted
        )

        cursor.execute(query, values)
        connection.commit()

        return jsonify({
            "success": True,
            "message": "Account created successfully!"
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    role = data.get("role")
    email = data.get("email")
    password = data.get("password")

    roll_no = data.get("rollNo")
    club_name = data.get("clubName")
    phone = data.get("phone")

    if not role or not email or not password:
        return jsonify({
            "success": False,
            "message": "Please enter all required details."
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        # Find user by email AND role
        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email = %s
            AND role = %s
            """,
            (email, role)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Account not found. Check your role and email."
            }), 401

        # Check role-specific information

        if role == "student":

            if user["roll_no"] != roll_no:
                return jsonify({
                    "success": False,
                    "message": "Incorrect roll number."
                }), 401

        elif role == "head":

            if user["club_name"] != club_name:
                return jsonify({
                    "success": False,
                    "message": "Incorrect club name."
                }), 401

        elif role == "volunteer":

            if user["phone"] != phone:
                return jsonify({
                    "success": False,
                    "message": "Incorrect phone number."
                }), 401

        # Check password
        password_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"].encode("utf-8")
        )

        if not password_valid:
            return jsonify({
                "success": False,
                "message": "Incorrect password."
            }), 401

        # Login successful
        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "role": user["role"],
                "full_name": user["full_name"],
                "email": user["email"],
                "roll_no": user["roll_no"],
                "department": user["department"],
                "club_name": user["club_name"],
                "club_category": user["club_category"],
                "phone": user["phone"],
                "interest": user["interest"]
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        # Find user by email
        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        # Email not found
        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        # Check password
        password_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"].encode("utf-8")
        )

        if not password_valid:
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        # Login successful
        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "role": user["role"],
                "full_name": user["full_name"],
                "email": user["email"],
                "roll_no": user["roll_no"],
                "department": user["department"],
                "club_name": user["club_name"],
                "club_category": user["club_category"],
                "phone": user["phone"],
                "interest": user["interest"]
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)

