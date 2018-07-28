PWD = $(shell pwd)

clean:
	-rm -rf ./node_modules
	-rm -rf ./package-lock.json
	-rm -f ./public

node_modules: package.json
	docker run --rm --volume=$(PWD):/code -w=/code arm32v6/node:9.6-alpine npm install

dependencies: node_modules

build: dependencies
	docker run --rm --volume=$(PWD):/code -w=/code arm32v6/node:9.6-alpine npm run build
