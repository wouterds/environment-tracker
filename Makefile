PWD = $(shell pwd)
VERSION = $(shell cat package.json | grep "\"version\"" | sed -e 's/^.*: "\(.*\)".*/\1/')
PROJECT = $(shell cat package.json | grep "\"name\"" | sed -e 's/^.*: "\(.*\)".*/\1/')

DOCKERFILE_NGINX = ./.docker/nginx/Dockerfile
DOCKERFILE_NODE = ./.docker/node/Dockerfile

TAG_NGINX = $(DOCKER_REGISTRY_HOST)/$(PROJECT)${ENV_SUFFIX}-nginx
TAG_NODE = $(DOCKER_REGISTRY_HOST)/$(PROJECT)${ENV_SUFFIX}-node

all: build

clean:
	-rm -rf node_modules
	-rm -rf dist
	-rm -rf .build-*

node_modules: package.json
	docker run --rm -v $(PWD):/code -w /code node:10-slim npm install

lint: node_modules
	docker run --rm -v $(PWD):/code -w /code node:10-slim npm run lint

.build-app: node_modules
	docker run --rm -v $(PWD):/code -w /code --env=VERSION=$(VERSION) node:10-slim npm run build
	touch .build-app

.build-nginx: $(DOCKERFILE_NGINX)
	docker build -f $(DOCKERFILE_NGINX) -t $(TAG_NGINX) .
	touch .build-nginx

.build-node: .build-app $(DOCKERFILE_NODE)
	docker build --build-arg=VERSION=$(VERSION) -f $(DOCKERFILE_NODE) -t $(TAG_NODE) .
	touch .build-node

build: .build-node .build-nginx
	docker tag $(TAG_NODE) $(TAG_NODE):$(VERSION)
	docker tag $(TAG_NGINX) $(TAG_NGINX):$(VERSION)
