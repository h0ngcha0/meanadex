#!/bin/bash

passenger start --app-type=node \
  --static-files-dir=public/dist \
  --ssl \
  --ssl-certificate=config/sslcerts/cert.pem \
  --ssl-certificate-key=config/sslcerts/key.pem
