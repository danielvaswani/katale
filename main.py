from re import match
from random import shuffle

f = open("wordlist.txt", "r")
words = []
for x in f:
	if(match('^[a-z]{5}\n$', x)):
		words.append(x.strip())
	# else:
	# 	print(x)

shuffle(words)
print(words[0])