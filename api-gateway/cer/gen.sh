# ES512
# private key
openssl ecparam -genkey -name secp521r1 -noout -out ecdsa-nist-p521-private.pem
# public key
openssl ec -in ecdsa-nist-p521-private.pem -pubout -out ecdsa-nist-p521-public.pem