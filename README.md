# tensoring

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


docker build . -t tensoring

docker run -d -p 8080:80 tensoring

docker save --output testImage.tar tensoring

docker load --input saved-image.tar
