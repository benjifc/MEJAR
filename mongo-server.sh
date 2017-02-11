#!/bin/bash
mongod  --fork --logpath data/mongo/log/mongo.log --smallfiles --oplogSize 50 --port 27001 --dbpath data/mongo 
