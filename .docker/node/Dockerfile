FROM arm32v6/node:9-alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

# Copy source
COPY ./node_modules /code/node_modules
COPY ./src /code/src
COPY ./.editorconfig /code/.editorconfig
COPY ./.prettierrc /code/.prettierrc
COPY ./nodemon.json /code/nodemon.json
COPY ./package.json /code/package.json
COPY ./tsconfig.json /code/tsconfig.json
COPY ./tslint.json /code/tslint.json

# Workdir
WORKDIR /code

CMD ["npm", "run", "http-app:watch"]
