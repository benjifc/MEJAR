#!/bin/bash
mongod  --fork --logpath mongo.log --smallfiles --oplogSize 50 --port 27001 --dbpath data/mongo 
