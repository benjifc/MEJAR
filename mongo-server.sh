#!/bin/bash
if [ -d data ];
then

else
echo "Carpeta DATA, no existe"
    mkdir data
    mkdir data/mongo
    mkdir data/mongo/log
echo "Creada carpeta DATA"
fi



mongod  --fork --logpath data/mongo/log/messages.log --smallfiles --oplogSize 50 --port 27001 --dbpath data/mongo 
_MyIP="$( ip route get 8.8.8.8 | awk 'NR==1 {print $NF}' )"
if [ "A$_MyIP" == "A" ]
then
    _MyIPs="$( hostname -I )"
    for _MyIP in "$_MyIPs"
    do
        echo "SERVIDOR INICIADO: \"$_MyIP\""
    done
else
    echo "SERVIDOR INICIADO IP: $_MyIP : 27001"
fi
