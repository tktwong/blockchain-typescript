# BLOCKCHAIN-TYPESCRIPT

## Initialization

```
npm i
npm run build
```

## Start node

```
cd build
node main.js start --p2p-port 3001 --http-port 3002
node main.js start --p2p-port 3003 --http-port 3004
node main.js start --p2p-port 3005 --http-port 3006
```

## Add peers

```
curl --location --request POST 'http://localhost:3002/addPeer' \
--header 'Content-Type: application/json' \
--data-raw '{
    "peer": "ws://localhost:3003"
}'
curl --location --request POST 'http://localhost:3002/addPeer' \
--header 'Content-Type: application/json' \
--data-raw '{
    "peer": "ws://localhost:3005"
}'
```

## Mine block

```
curl --location --request POST 'http://localhost:3002/mineBlock' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": "Hello World 1"
}'
curl --location --request POST 'http://localhost:3004/mineBlock' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": "Hello World 2"
}'
curl --location --request POST 'http://localhost:3006/mineBlock' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": "Hello World 3"
}'
```

## Get blocks

```
curl --location --request GET 'http://localhost:3002/blocks' \
--header 'Content-Type: application/json'
```

## Get peers

```
curl --location --request GET 'http://localhost:3002/peers' \
--header 'Content-Type: application/json'
```
