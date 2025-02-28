FROM nginx:alpine

COPY  /dist/ /usr/share/nginx/html
COPY ./default.conf.template /etc/nginx/templates/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]