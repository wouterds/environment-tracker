FROM arm32v6/node:9-alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

# Workdir
WORKDIR /code

# Copy source
COPY ./node_modules /code/node_modules
COPY ./src /code/src
COPY ./package.json /code/package.json
COPY ./tsconfig.json /code/tsconfig.json
COPY ./.docker/node-cron/crons ./crons

# Add qemu bin
COPY ./qemu-arm-static /usr/bin/qemu-arm-static

# Enable crontab
RUN crontab ./crons

# Remove qemu bin
RUN rm /usr/bin/qemu-arm-static

# Start cron deamon in foreground as main process
CMD ["crond", "-f"]
