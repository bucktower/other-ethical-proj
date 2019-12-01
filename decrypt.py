import pyrebase
import os
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random
import random
import string

# Get all files in a directory
path = os.path.expanduser("~/sensitive")
myfiles = os.listdir(path)

# Encrypt using secret key
def decrypt(key, filename):
  chunksize = 64 * 1024
  outputFile = filename + "--UNENCRYPTED"

  with open(filename, 'rb') as infile:
    filesize = int(infile.read(16))
    IV = infile.read(16)

    decryptor = AES.new(key, AES.MODE_CBC, IV)

    with open(outputFile, 'wb') as outfile:
      while True:
        chunk = infile.read(chunksize)

        if len(chunk) == 0:
          break

        outfile.write(decryptor.decrypt(chunk))
        outfile.truncate(filesize)

# Generate SHA256 key based off of password
def getKey(password):
  hasher = SHA256.new(password.encode('utf-8'))
  return hasher.digest()

some_key = input("Secret key you were given: ")
print("Decrypting with: " + some_key)

# Encrypt ze files
for file in myfiles:
  decrypt(getKey(some_key), path + '/' + file)
