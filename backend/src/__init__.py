from dotenv import load_dotenv, find_dotenv
from flask_pymongo import PyMongo
from flask_restful import Api, Resource
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
from flask import Flask, request, Response
from flask_bcrypt import Bcrypt
from flask_jwt import JWT, jwt_required

import json
import os
import requests
import datetime

app = Flask(__name__)

# .ENV FILE LOAD
try:
    load_dotenv(find_dotenv())
except Exception:
    raise RuntimeError("Failed to load .env file")

# CONFIGURATIONS
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MONGO_URI'] = os.getenv('MONGO_URI')  #  "mongodb://localhost:27017/adoptAFriend"

# INITIALIZATION
api = Api(app)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
CORS(app)


## AUTHENTICATION
def authenticate(username, password):
    class User(object):
        def __init__(self, id, username, password):
            self.id = id
            self.username = username
            self.password = password
    
    # check if user exists
    # if so return user
    user = mongo.db.users.find_one({'email': username})
    user = json_util.dumps(user)
    user = json.loads(user)
    
    user_email = user.get('email', None)
    hashed_password = user.get('password', None)
    
    if not user_email or not hashed_password:
        return {'msg': 'Authentication failed.'}
    
    pw_check = bcrypt.check_password_hash(hashed_password, password)
    if pw_check:
        temp = user.get('_id', None)
        user_id = str(temp.get('$oid', None))
        user = User(user_id, user['email'], user['password'])
        
        return user
    
    return {'msg': 'Authentication failed.'}

def identity(payload):
    user_id = payload['identity']
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    return user

jwt = JWT(app, authenticate, identity)
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(days=1)

# VALIDATIONS
def id_validation(result):
    '''
    result - recieves the result of a find_one query
    '''
    result = json_util.dumps(result)
    result = json.loads(result)

    result_id = result.get('_id', None)
    result_id = result_id.get('$oid', None)
    
    return str(result_id)  

# RESOURCES
class Pets(Resource):

    # Get one pet
    def get(self, id):

        if id:
            pet = mongo.db.pets.find_one({'_id': ObjectId(id)})
            response = json_util.dumps(pet)
            return Response(response, mimetype='application/json')
        else:
            return {'msg': 'Error - id not found'}, 404

    # Create a pet
    @jwt_required()
    def post(self):

        name = request.json['name']
        breed = request.json['breed']
        type = request.json['type']
        sex = request.json['sex']
        image_url = request.json['image_url']
        user_email = request.json['user_email']
        
        if name and breed:
            id = mongo.db.pets.insert(
                {
                    'user_email': user_email,
                    'name': name,
                    'breed': breed,
                    'type': type,
                    'sex': sex,
                    'image_url': image_url
                }
            )

            return {
                'msg': 'Pet created successfully!',
                'petInfo': {
                    'user_email': user_email,
                    'id': str(id),
                    'name': name,
                    'breed': breed,
                    'type': type,
                    'sex': sex,
                    'image_url': image_url
                }
            }
        else:
            return {'msg': 'Please fill all required fields.'}

        
    # Delete a pet
    @jwt_required()
    def delete(self, id):
        result = mongo.db.pets.find_one({'_id': ObjectId(id)})
        result_id = id_validation(result)
        
        if result_id != id:
            return {'msg': 'Error - id not found'}, 404
        
        if id:
            mongo.db.pets.delete_one({'_id': ObjectId(id)})
            return {'msg': f'Pet with id "{id}" was deleted successfully.'}
        else:
            return {'msg': 'Error - id not found'}, 404
    
    # Update a pet
    @jwt_required()
    def put(self, id):
        
        name = request.json['name']
        breed = request.json['breed']
        type = request.json['type']
        sex = request.json['sex']
        image_url = request.json['image_url']
        
        if id and name and breed and image_url:
            mongo.db.pets.update_one({'_id': ObjectId(id)}, {'$set': {
                'name': name,
                'breed': breed,
                'type': type,
                'sex': sex,
                'image_url': image_url
            }})
            
            response = {'msg': f'Pet with id "{id}" updated successfully.'}
            return response


class AllPets(Resource):
    
    def get(self, type):
        if type != 'All':
            all_pets = mongo.db.pets.find({'type': type})
        else:
            all_pets = mongo.db.pets.find()

        response = json_util.dumps(all_pets)
        return Response(response, mimetype='application/json')


class Users(Resource):

    @jwt_required()
    def get(self):
        all_users = mongo.db.users.find()
        response = json_util.dumps(all_users)
        return Response(response, mimetype='application/json')

    def post(self):
        uname = request.json['uname']
        email = request.json['email']
        password = request.json['password']
        pconfirm = request.json['pconfirm']
        
        # Check if user already exists
        result = mongo.db.users.find_one({'email': email})
        result = json_util.dumps(result)
        result = json.loads(result)
        
        try:
            result_email = result.get('email')
        except Exception:
            result_email = None

        if result_email == email:
            return {'msg': "User already exists."}
        
        # Check if all fields are filled
        if uname and email and password and pconfirm:
            if password != pconfirm:
                return {'msg': "Passwords doesn't match."}
            
            
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            id = mongo.db.users.insert(
                {
                    'uname': uname,
                    'email': email,
                    'password': hashed_password
                }
            )

            return {
                'msg': 'User created successfully!',
                'userInfo': {
                    'id': str(id),
                    'uname': uname,
                    'email': email,
                    'password': str(hashed_password)
                }
            }
        else:
            return {'msg': 'Please fill all required fields.'}
    
    @jwt_required()
    def delete(self, id):
        result = mongo.db.users.find_one({'_id': ObjectId(id)})
        result_id = id_validation(result)
        
        if result_id != id:
            return {'msg': 'Error - id not found'}, 404

        if id:
            mongo.db.users.delete_one({'_id': ObjectId(id)})
            return {'msg': f'User with id "{id}" was deleted successfully.'}
        else:
            return {'msg': 'Error - id not found'}, 404

class Login(Resource):
    
    def post(self):
        email = request.json['email']
        password = request.json['password']
        
        url= f'{os.getenv("BASE_URL")}/auth'
        response = requests.post(
            url,
            json={'username': email, 'password': password}
        )
        response = json.loads(response.text)
        return response

# DEFAULT
@app.route('/')
def index():
    return 'Welcome to Adopt a Friend API'

# RESOURCE URLs
api.add_resource(Pets, '/api/pet', '/api/pet/<string:id>')
api.add_resource(AllPets, '/api/pets/<string:type>')
api.add_resource(Users, '/api/user', '/api/user/<string:id>')
api.add_resource(Login, '/api/login')
