# Podgroup

## Dev

Import data to mongodb in docker (expect `local-mongo` is the container name of mongo)

Database `podgroup`

Collection `testdata`

```
docker exec -it local-mongo mongo
# Remove header row before import !
docker cp assets/assetsSimcardTable-test.csv local-mongo:/tmp/data.csv
docker exec local-mongo mongoimport -d podgroup -c testdata --type csv --fields subscriberId,status,usageBytes --file /tmp/data.csv
```
