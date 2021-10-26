# shopping-portal

## Tech-Stacks:
- [React.js] - 
- Go (Flask) (BackEnd)
- Postgresql (DB)
- Nginx (proxy-server)
    - runs for the handling the CORS issue and running it under same host.
## Installation

Tool requires:
[Node](https://nodejs.org/) v15+ 
[go](https://golang.org/) v1.17
[docker](hub.docker.com) v20.10.8
[Nginx](https://www.nginx.com/)

Install the dependencies and devDependencies and start the server.

For frontend environments...

```sh
cd to the directory where FE is located.
npm i
npm run build:development
(keep the build location and nginx location as same refer to nginx readme below)
```

For Docker environments....

```sh
docker-compose up -d
docker ps 
```

For Nginx Setup....
```sh
go the directory conf.d and create file as default.conf and edit details as:
    map $sent_http_content_type $expires {
    default                    off;
    text/html                  -1;
    text/css                   -1;
    application/javascript     -1;
    ~image/                    max;
}
server {
    listen 80;
    server_name localhost;
    location / {
               try_files $uri $uri/ /index.html;
# index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
location /shopper {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
        proxy_connect_timeout      240;
        proxy_send_timeout         240;
        proxy_read_timeout         240;
        proxy_set_header Scheme $scheme;
        proxy_http_version 1.1;
        proxy_pass http://shopper ;
   }
   location /shop {
        alias <BUILD location>;
  }     
expires $expires;
}
```
```sh
edit the file nginx.conf as(change username as your):
user sagar;
worker_processes  2;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
    use epoll;
    multi_accept on;
}
http {

     upstream ai-server {
    server 127.0.0.1:7000;
    }
   sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    open_file_cache max=40000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    client_max_body_size 10M;
    gzip on;
    gzip_disable "msie6";
    gzip_proxied any;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types       text/plain application/xml text/css text/js text/xml application/x-javascript text/javascript application/javascript application/json    application/xml+rss;
    include /etc/nginx/conf.d/default.conf;
}
```

```sh
run the main.go file using command as go run main.go
```

## Look:

![Shoppin_Poprtal](https://github.com/Sagar2011/shopping-portal/blob/main/Screenshot%20from%202021-10-26%2012-29-53.png)

## QNA:

1. Nginx?: To avoid issue like CORS and making nginx to work here as API Gateway working and transferring the service call based on configuration.
2. Usage: Use as many user item right now persisted in the db with the help of docer, For faster exp use credentials, username: sezzle@email.com password: sezzle@3245
3. There are few bugs which I indentified working with Go like proper error handling and modularise codes. But in just 1.5 days it was difficult to learn all new language and develop generic codes,I will try to learn more n more and fix it in free time on github link.
4. Followed React Material codes in ease to design UI.



- developed by Sagar Jain
Note: Let me know if you have any doubts inorder to run tool or anything I will clarify it.

