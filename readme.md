# This is the start of the ELO-beggers backend service

This backend connects to the Mongo database and emits changes to the frontend when something happens.

## Installation:

`npm install`

`npm start`

open [http://localhost:3000/](http://localhost:3000/)

## Mongo
Start mongodb with a replicaset configured:
  
    mongod --replSet "rs0" --config /usr/local/etc/mongod.conf

Make sure your (local) mongodb knows the hostname you run it on:

    /etc/hosts:
    127.0.0.1	localhost zwadonk.local

Initialize the replicaset in your mongo-cli:

    rs.initiate({_id:"rs0", members: [{"_id":1, "host":"zwadonk.local:27017"}]})

## ToDo:
- ~~everything except this lame websocket example~~
- when subscribes to a mongo-collection propagate the chenges to the websocket
