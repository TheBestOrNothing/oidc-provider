openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

openssl rsa -pubout -in private_key.pem -out public_key.pem

openssl rsa -in private_key.pem -pubout -text

node pem2jwk.js
