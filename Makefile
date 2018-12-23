all: tag

DOCKER_REPO = docker.wouterdeschuyter.be

PWD = $(shell pwd)
VERSION = $(shell cat package.json | grep "\"version\"" | sed -e 's/^.*: "\(.*\)".*/\1/')
PROJECT = $(shell cat package.json | grep "\"name\"" | sed -e 's/^.*: "\(.*\)".*/\1/')

TAG_NGINX = $(DOCKER_REPO)/$(PROJECT)-nginx
TAG_NODE = $(DOCKER_REPO)/$(PROJECT)-node
TAG_NODE_CRON = $(DOCKER_REPO)/$(PROJECT)-node-cron
DOCKERFILE_NGINX = ./.docker/nginx/Dockerfile
DOCKERFILE_NODE = ./.docker/node/Dockerfile
DOCKERFILE_NODE_CRON = ./.docker/node-cron/Dockerfile

clean:
	-rm -rf ./node_modules
	-rm -rf ./package-lock.json
	-rm -rf ./.build-*
	-rm -rf ./dist

node_modules: package.json
	docker run --rm -v $(PWD):/code -w /code node:9-alpine npm install

dependencies: node_modules

lint: dependencies
	docker run --rm -v $(PWD):/code -w /code node:9-alpine npm run lint

.build-app: dependencies
	docker run --rm -v $(PWD):/code -w /code node:9-alpine npm run client:build
	touch .build-app

.build-node: dependencies $(DOCKERFILE_NODE)
	docker build -f $(DOCKERFILE_NODE) -t $(TAG_NODE) .
	touch .build-node

.build-node-cron: dependencies $(DOCKERFILE_NODE_CRON)
	docker build -f $(DOCKERFILE_NODE_CRON) -t $(TAG_NODE_CRON) .
	touch .build-node-cron

.build-nginx: .build-app $(DOCKERFILE_NGINX)
	docker build -f $(DOCKERFILE_NGINX) -t $(TAG_NGINX) .
	touch .build-nginx

build: .build-node .build-node-cron .build-nginx

tag: build
	docker tag $(TAG_NGINX) $(TAG_NGINX):$(VERSION)
	docker tag $(TAG_NODE) $(TAG_NODE):$(VERSION)
	docker tag $(TAG_NODE_CRON) $(TAG_NODE_CRON):$(VERSION)

push: tag
	docker push $(TAG_NGINX):$(VERSION)
	docker push $(TAG_NODE):$(VERSION)
	docker push $(TAG_NODE_CRON):$(VERSION)

push-latest: push
	docker push $(TAG_NGINX):latest
	docker push $(TAG_NODE):latest
	docker push $(TAG_NODE_CRON):latest
