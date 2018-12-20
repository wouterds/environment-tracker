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

# Enable crontab
RUN crontab ./crons

# Start cron deamon in foreground as main process
CMD ["crond", "-f"]
