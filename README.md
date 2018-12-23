# tracker.wouterdeschuyter.be

![Tag)](https://img.shields.io/github/tag/wouterds/tracker.wouterdeschuyter.be.svg)
![Code Size](https://img.shields.io/github/languages/code-size/wouterds/tracker.wouterdeschuyter.be.svg)
![Last Commit](https://img.shields.io/github/last-commit/wouterds/tracker.wouterdeschuyter.be.svg)
![CircleCI](https://circleci.com/gh/wouterds/tracker.wouterdeschuyter.be.svg?style=shield)
![Dependencies](https://img.shields.io/david/wouterds/tracker.wouterdeschuyter.be.svg)

![Screenshot](resources/images/screenshot.jpg?raw=true)

## Setup

### Dependencies

```shell
make dependencies
```

### Linting

```shell
make lint
```

### Running app locally

```shell
docker-compose -f .docker/docker-compose.dev.yml up
```

### VSCode

Added the following to your VSCode workspace config;

```json
{
  "tslint.autoFixOnSave": true,
}
```
