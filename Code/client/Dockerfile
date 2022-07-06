FROM nginx:1.15.2-alpine

# use nginx server to serve file index.html
COPY build/index.html /usr/share/nginx/html

# update configuration for HTML5 push state
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
