# Podgroup

## Dev

Import data to mongodb in docker (expect `local-mongo` is the container name of mongo)

Database `podgroup`

Collection `testdata`

```
docker exec -it local-mongo mongo
# Remove header row before import !
docker cp assets/assetsSimcardTable-test.csv local-mongo:/tmp/data.csv
docker exec local-mongo mongoimport -d podgroup -c testdata --type csv --columnsHaveTypes --fields "subscriberId.string(),status.auto(),usageBytes.auto()" --file /tmp/data.csv
```

## Config (env)

## Run API

`npm start api` will start API server in watch mode.

Default urls

- `http://localhost:3333/api/data` - CRUD `data` endpoint
- `http://localhost:3333/docs` - Swagger
