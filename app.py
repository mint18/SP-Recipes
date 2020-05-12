from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import os
import pyrebase
import uuid
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "./uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app = Flask(__name__)

#config db
app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = ""
app.config["MYSQL_DB"] = "recipes"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
mysql = MySQL(app)
CORS(app)

#firebase config
config = {
    
}


#init firebase app and storage
firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

#check file
def allowed_files(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

#get all recipes from db
@app.route("/api/recipes", methods=["GET"])
def getrecipes():
    if request.method == "GET":
        cur = mysql.connection.cursor()
        cur.execute(""" SELECT * FROM recipes """)
        recipes = cur.fetchall()
        cur.close()
        return jsonify(data=recipes)


@app.route("/api/addrecipe", methods=["POST"])
def addrecipe():
    if request.method == "POST":
        meal_name = request.form.get("meal_name")
        recipe = request.form.get("recipe")
        image_file = request.files["image_file"]

        if image_file and allowed_files(image_file.filename):
            filename = str(uuid.uuid4())
            filename += "."
            filename += image_file.filename.split(".")[len(image_file.filename.split("."))-1]
            #create secure name
            filename_secure = secure_filename(filename)
            #save the file inside the uploads folder
            image_file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename_secure))

            #local file
            local_filename = "./uploads/"
            local_filename += filename_secure

            #firebase filename
            firebase_filename = "uploads/"
            firebase_filename += filename_secure

            #upload the file and get the url
            storage.child(firebase_filename).put(local_filename)
            cover_image = storage.child(firebase_filename).get_url(None)


            cur = mysql.connection.cursor()
            cur.execute(""" INSERT INTO recipes (meal_name, recipe, image_addr, image_name) VALUES(%s, %s, %s, %s)""",
                        (meal_name, recipe, cover_image, filename_secure))
            mysql.connection.commit()
            cur.close()
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], filename_secure))

            return jsonify(data="addrecipe response")

@app.route("/api/recipe/<id>", methods=["GET"])
def singlepost(id):
    cur = mysql.connection.cursor()
    cur.execute(" SELECT * FROM recipes WHERE  id = '" + id + "' ")
    record = cur.fetchone()
    cur.close()
    return jsonify(data=record)

@app.route("/api/editrecipe/<id>", methods=["PUT"])
def editrecipe(id):
    if request.method == "PUT":
        recipeId = request.form.get("id")
        meal_name = request.form.get("meal_name")
        recipe = request.form.get("recipe")

        cur = mysql.connection.cursor()
        cur.execute(""" UPDATE recipes SET meal_name=%s, recipe=%s WHERE id=%s  """,
                    (meal_name, recipe, recipeId))
        mysql.connection.commit()
        cur.close()

        return jsonify(data="editrecipe response")


@app.route("/api/editfullrecipe/<id>", methods=["PUT"])
def editfullpost(id):
    if request.method == "PUT":
        print(request.form, flush=True)

        recipeId = request.form.get("id")
        meal_name = request.form.get("meal_name")
        recipe = request.form.get("recipe")
        old_image_addr = request.form.get("old_image_addr")
        image_name = request.form.get("image_name")

        if request.files["image_file"]:
            if allowed_files(request.files["image_file"].filename):
                image_file = request.files["image_file"]
                #creating the filename
                filename = str(uuid.uuid4())
                filename += "."
                filename += image_file.filename.split(".")[1]

                #create a secure name
                filename_secure = secure_filename(filename)
                # save the gile inside the uploads folder
                image_file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename_secure))

                # local file
                local_filename = "./uploads/"
                local_filename += filename_secure

                # firebase filename
                firebase_filename = "uploads/"
                firebase_filename += filename_secure

                # upload the file and get the url
                storage.child(firebase_filename).put(local_filename)
                new_image_addr = storage.child(firebase_filename).get_url(None)

                cur = mysql.connection.cursor()
                cur.execute(""" UPDATE recipes SET meal_name=%s, recipe=%s, image_addr=%s, image_name=%s WHERE id=%s  """,
                            (meal_name, recipe, new_image_addr, filename_secure, recipeId))
                mysql.connection.commit()
                cur.close()

                #delete the current image
                try:
                    os.remove(os.path.join(app.config["UPLOAD_FOLDER"], filename_secure))

                    #path of the image to delete inside firebase
                    firebase_filename_delete = "uploads/"
                    firebase_filename_delete += image_name

                    storage.delete(firebase_filename_delete)
                finally:
                    return jsonify(data="editfullrecipe response")


@app.route("/api/deleterecipe/<id>", methods=["DELETE"])
def deletepost(id):
    recipeId = request.form["id"]
    cur = mysql.connection.cursor()
    cur.execute(""" DELETE FROM recipes WHERE id=%s""" %(recipeId))
    mysql.connection.commit()
    cur.close()
    return jsonify(data="deleterecipe response")


if __name__ == "__main__":
    app.run(debug=True)