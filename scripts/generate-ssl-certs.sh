#!/bin/bash

if [ ! -e server.js ]
then
	echo "Error: could not find main application server.js file"
	echo "You should run the generate-ssl-certs.sh script from the main MEAN application root directory"
	echo "i.e: bash scripts/generate-ssl-cers.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./config/sslcerts
openssl req  -nodes -new -x509  -keyout ./config/sslcerts/key.pem \
    -out ./config/sslcerts/cert.pem
chmod 600 ./config/sslcerts/key.pem ./config/sslcerts/cert.pem
