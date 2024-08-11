import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from re import match
from random import randint
import os
import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
	def do_POST(self):
	# Use a service account.
		cred = credentials.Certificate(json.loads(os.environ.get('SERVICE_ACCOUNT')))

		app = firebase_admin.initialize_app(cred)

		db = firestore.client()

		count = db.collection('word').count().get()[0][0].value
		random_number = randint(0, count)
		print(random_number)

		word_of_the_day = db.collection('word').where("index", "==", random_number).limit(1).get()[0].get('word')
		already_exists = 0

		try: 
			already_exists = db.collection('day').where("word", "==", word_of_the_day).limit(1).get()[0].get('day')
			while(already_exists > 0):
				print("Try another word")
				random_number = randint(0, count)
				word_of_the_day = db.collection('word').where("index", "==", random_number).limit(1).get()[0].get('word')
				already_exists = db.collection('day').where("word", "==", word_of_the_day).limit(1).get()[0].get('day')

		except:
			print("Not found")

		day_count =  db.collection('day').count().get()[0][0].value
		db.collection("day").document(word_of_the_day).set({"day": day_count+1, "word":word_of_the_day})

		self.send_response(200)
		self.send_header('Content-type','text/plain')
		self.end_headers()
		return