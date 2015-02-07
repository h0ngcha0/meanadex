#!/bin/bash

passenger start --app-type=node \
  --ssl \
  --ssl-certificate=config/sslcerts/cert.pem \
  --ssl-certificate-key=config/sslcerts/key.pem
