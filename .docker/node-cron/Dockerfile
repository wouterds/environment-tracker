FROM arm32v6/node:9-alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

# Workdir
WORKDIR /code

# Copy source
COPY ./ /code
COPY ./.docker/node-cron/crons ./crons

# Enable crontab
RUN crontab ./crons

# Start cron deamon in foreground as main process
CMD ["crond", "-f"]
