server {
  listen 80 default_server;
  listen [::]:80 default_server ipv6only=on;

  server_name mootee.io www.mootee.io api.mootee.io;

  return 301 https://$server_name$request_uri;
}


server {
  listen 443;
  server_name mootee.io www.mootee.io api.mootee.io;

  root /home/ubuntu/mootee/public;
  index index.html index.htm;

  passenger_enabled on;

  ssl on;
  ssl_certificate cert.pem;
  ssl_certificate_key key.pem;

  ssl_session_timeout 5m;

  ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers "HIGH:!aNULL:!MD5 or HIGH:!aNULL:!MD5:!3DES";
  ssl_prefer_server_ciphers on;
}
