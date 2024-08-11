import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from time import sleep
from re import match

# Use a service account.
cred = credentials.Certificate('serviceAccount.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

batch = db.batch()

index = 0

f = open("wordlist.txt", "r")

for x in f:
	if(match('^[a-z]{5}\n$', x)):
		batch.set(db.collection('word').document(x), {"index": index, "word": x.strip()})
		print(index,x.strip())
		index = index + 1


batch.commit()