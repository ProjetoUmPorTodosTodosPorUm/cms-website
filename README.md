# ProjetoUmPorTodosTodosPorUm.org's CMS

## Dependencies

- [Docker with Docker Compose](https://docs.docker.com/get-docker/)
- [asdf](https://asdf-vm.com/guide/getting-started.html)

## Install

```bash
$ asdf install
$ npm install
```

## Run

### Development

```bash
# Start the API (api-projeto)
$ npm run start:dev

# Then the App
$ npm run dev
```

### Production

```bash
# Build docker image
$ npm run build:docker

# Then start from API's root folder
$ npm run start:prod
```

> It will need web image too.

## Related

Other repositories related to this:

- [api-projeto](https://github.com/RenanGalvao/api-projeto)
- [web-projeto](https://github.com/RenanGalvao/web-projeto)
