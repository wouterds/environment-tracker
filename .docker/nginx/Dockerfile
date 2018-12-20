FROM arm32v6/nginx:alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

# Copy config
COPY ./.docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Workdir
WORKDIR /code
