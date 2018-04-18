PWD = $(shell pwd)

clean:
	-rm -rf ./node_modules
	-rm -rf ./package-lock.json
	-rm -f ./public

node_modules: package.json
	docker run --rm --volume=$(PWD):/code -w=/code node:9-slim npm install

dependencies: node_modules
