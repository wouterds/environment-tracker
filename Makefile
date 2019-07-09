PWD = $(shell pwd)
VERSION = $(shell cat package.json | grep "\"version\"" | sed -e 's/^.*: "\(.*\)".*/\1/')
PROJECT = $(shell cat package.json | grep "\"name\"" | sed -e 's/^.*: "\(.*\)".*/\1/')

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

build: .build-app
