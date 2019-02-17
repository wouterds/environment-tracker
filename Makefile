all: tag

PWD = $(shell pwd)
VERSION = $(shell cat package.json | grep "\"version\"" | sed -e 's/^.*: "\(.*\)".*/\1/')
PROJECT = $(shell cat package.json | grep "\"name\"" | sed -e 's/^.*: "\(.*\)".*/\1/')

TAG_NGINX = $(DOCKER_REGISTRY_HOST)/$(PROJECT)-nginx
TAG_NODE = $(DOCKER_REGISTRY_HOST)/$(PROJECT)-node
TAG_NODE_CRON = $(DOCKER_REGISTRY_HOST)/$(PROJECT)-node-cron
DOCKERFILE_NGINX = ./.docker/nginx/Dockerfile
DOCKERFILE_NODE = ./.docker/node/Dockerfile
DOCKERFILE_NODE_CRON = ./.docker/node-cron/Dockerfile

clean:
	-rm -rf ./node_modules
	-rm -rf ./.build-*
	-rm -rf ./dist
	-rm -f ./qemu-arm-static

qemu-arm-static:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset
	curl -OL https://github.com/multiarch/qemu-user-static/releases/download/v3.1.0-2/qemu-arm-static
	chmod +x qemu-arm-static

node_modules: package.json
	docker run --rm -v $(PWD):/code -w /code node:9 npm install

dependencies: node_modules

lint: dependencies
	docker run --rm -v $(PWD):/code -w /code node:9 npm run lint

.build-app: dependencies
	docker run --rm -v $(PWD):/code -w /code node:9 npm run client:build
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

build: qemu-arm-static .build-node .build-node-cron .build-nginx
	docker tag $(TAG_NGINX) $(TAG_NGINX):$(VERSION)
	docker tag $(TAG_NODE) $(TAG_NODE):$(VERSION)
	docker tag $(TAG_NODE_CRON) $(TAG_NODE_CRON):$(VERSION)

push: build
	docker push $(TAG_NGINX):$(VERSION)
	docker push $(TAG_NODE):$(VERSION)
	docker push $(TAG_NODE_CRON):$(VERSION)

push-latest: push
	docker push $(TAG_NGINX):latest
	docker push $(TAG_NODE):latest
	docker push $(TAG_NODE_CRON):latest

deploy:
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p ${DEPLOY_LOCATION}"

	scp ./.docker/docker-compose.yml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_LOCATION}/docker-compose.yml

	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "cd ${DEPLOY_LOCATION}; docker-compose pull"
	ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "cd ${DEPLOY_LOCATION}; docker-compose up -d"
