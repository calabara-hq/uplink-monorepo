FROM nginx:stable-alpine
COPY ./packages/proxy/default.conf /etc/nginx/conf.d/default.conf
COPY ./packages/proxy/nginx-selfsigned.crt /etc/nginx/certs/nginx-selfsigned.crt
COPY ./packages/proxy/nginx-selfsigned.key /etc/nginx/certs/nginx-selfsigned.key
EXPOSE 80/tcp
EXPOSE 443/tcp
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /usr/share/nginx/html
