import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from re import match
from random import randint
import os
import json
from http.server import BaseHTTPRequestHandler

def today():
    cred = credentials.Certificate(json.loads(os.environ.get('SERVICE_ACCOUNT')))
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()
    day_count =  db.collection('day').count().get()[0][0].value
    word = db.collection('day').where("day", "==", day_count).limit(1).get()[0].get('word')
    firebase_admin.delete_app(app)
    return word 

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(today().encode('utf-8'))
        return
