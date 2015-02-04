#!/bin/bash

passenger start --app-type=node \
  --startup-file=server.js \
  --static-files-dir=public/dist \
  --ssl \
  --ssl-certificate=config/sslcerts/cert.pem \
  --ssl-certificate-key=config/sslcerts/key.pem
