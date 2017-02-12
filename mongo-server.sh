#!/bin/bash
if ! [ -d data ];
then
echo "Carpeta DATA, no existe"
    mkdir data
    mkdir data/mongo
    mkdir data/mongo/log
echo "Creada carpeta DATA"
fi

`ps -A | grep -q '[m]ongod'`

if [ "$?" -eq "0" ]; then
    echo "¡ SERVIDOR YA INICIADO !"
    exit 0
else
    mongod  --fork --logpath data/mongo/log/messages.log --smallfiles --oplogSize 50 --port 27001 --dbpath data/mongo 
    echo "INICIANDO SERVIDOR ... " 
fi

exit 0


_MyIP="$( ip route get 8.8.8.8 | awk 'NR==1 {print $NF}' )"
if [ "A$_MyIP" == "A" ]
then
    _MyIPs="$( hostname -I )"
    for _MyIP in "$_MyIPs"
    do
        echo "SERVIDOR INICIADO EN IP : \"$_MyIP\" : 27001 "
    done
else
    echo "SERVIDOR INICIADO EN IP: $_MyIP : 27001"
fi
