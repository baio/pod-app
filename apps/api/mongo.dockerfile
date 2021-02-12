# (( Not working 
FROM mongo
WORKDIR /app
RUN mkdir -p /tmp
COPY assets/data.csv ./data.csv
CMD ["mongod && mongoimport -d dev -c testdata --type csv --headerline --file  data.csv"]
