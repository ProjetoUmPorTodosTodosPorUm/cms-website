# CMS
CMS component of [projetoumportodostodosporum.org's](https://projetoumportodostodosporum.org) website.


## Dependencies
- [Server Component](https://github.com/ProjetoUmPorTodosTodosPorUm/server)
- [API Component](https://github.com/ProjetoUmPorTodosTodosPorUm/api)
- [asdf](https://asdf-vm.com/guide/getting-started.html)


## Install
```bash
$ asdf install
$ npm install
```


## Environment Vars
Create a copy from ".env.development.example" file in the root folder and rename to ".env.development" and update it accordingly.


## Run
### Development
```bash
$ npm run dev
```

### Preview
Build the preview image of this componenet with ``$ npm run build:docker:preview`` and others, then start the [Server](https://github.com/ProjetoUmPorTodosTodosPorUm/server) in preview mode.

### Production
Build the production image of this componenet with ``$ npm run build:docker`` and others, then start the [Server](https://github.com/ProjetoUmPorTodosTodosPorUm/server) in production mode.

## Related Repositories
- [Server](https://github.com/ProjetoUmPorTodosTodosPorUm/server) (server)
- [API](https://github.com/ProjetoUmPorTodosTodosPorUm/api) (api)
- [Website](https://github.com/ProjetoUmPorTodosTodosPorUm/cms) (website)
