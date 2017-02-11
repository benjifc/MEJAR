#!/bin/bash
mongod  --fork --logpath data/mongo/log/messages.log --smallfiles --oplogSize 50 --port 27001 --dbpath data/mongo 
