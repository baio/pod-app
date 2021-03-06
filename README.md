## Development

There is 2 way to start project locally

+ Using docker compose `docker-compose up --build --force-recreate` it will start mongo, api and application. API will start on 3333 port and app on 4200, make sure these ports are available !Important! After containers start you still have to export initial data file manually 
```
docker cp assets/data.csv podmongo:/tmp/data.csv
docker exec podmongo mongoimport -d dev -c testdata --type csv --columnsHaveTypes --fields "subscriberId.string(),status.auto(),usageBytes.auto()" --file /tmp/data.csv
```

In order to use run with fresh data use `docker-compose down` and then start again - it will remove all cached mongo volumes

+ Start all manually
    + Ensure mongo run
    + Migrate data (see API dev section)
    + Ensure `env/.env` file contains correct config to connect mongo (tested connections without authorization)
    + `npm run start api` will run api app (see API run section)
    + `npm run start podgroup` it will start app on port 4200 and it will be connected to api on port 3333

Default urls after start

- `http://localhost:3333/api/data` - CRUD `data` endpoint
- `http://localhost:3333/docs` - Swagger
- `http://localhost:4200` - Web app

## API Dev 

Import data to mongodb in docker (expect `local-mongo` is the container name of mongo)

Database `podgroup_dev`

Collection `testdata`

```
docker exec -it local-mongo mongo
# Remove header row before import !
docker cp assets/data.csv local-mongo:/tmp/data.csv
docker exec local-mongo mongoimport -d podgroup -c testdata --type csv --columnsHaveTypes --fields "subscriberId.string(),status.auto(),usageBytes.auto()" --file /tmp/data.csv
```


mongoimport -d dev -c testdata --type csv --file data.csv
## API Dev Env

Following env variables defined by default for api app 
```
PORT=3333
DB_HOST=mongodb://localhost:27017
DB_NAME=podgroup
```

[dotenv](https://www.npmjs.com/package/dotenv) package is used for configuration setup.
If `NODE_ENV` is not defined or `NODE_ENV` is `development` then `.env` file will be used.
For other configurations `env/${NODE_ENV.toLowerCase()}.env` file must exists.

## API Tests

Important ! This is integration tests which means all requests will be dispatched to the real database, 
db connection params must be setup in `env/test.env` and database should be different from `dev` database

+ `npm run test:api` just once
+ `npm run test:api -- --watch` watch mode

## API Run

`npm start api` will start API server in watch mode.

Default urls

- `http://localhost:3333/api/data` - CRUD `data` endpoint
- `http://localhost:3333/docs` - Swagger

### Web app run 

```
npm run start podgroup
```