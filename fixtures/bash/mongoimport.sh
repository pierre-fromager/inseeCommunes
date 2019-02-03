#!/bin/bash

# Correspondance Code INSEE - Code Postal 2013 / :’ :’3 ;w; ;_; 
# @see https://public.opendatasoft.com/explore/dataset/correspondance-code-insee-code-postal/table/

MONGO_HOST='localhost';
MONGO_LOGIN='pierre';
MONGO_PASSWORD='pierre';
MONGO_DB='insee';
MONGO_COLLECTION='communes';
MONGO_DB_AUTH='admin';
MONGO_IMPORT_TYPE='tsv';

ETGZ='.tgz';
ECSV='.csv';

HERE=$(pwd);
FILENAME='insee_communes';
DATA_PATH="$(pwd)"/fixtures/datas/;
DATA_FILENAME="$DATA_PATH""$FILENAME";
TGZ_FILE="$DATA_FILENAME""$ETGZ";
DATA_FILE="$DATA_PATH""$FILENAME""$ECSV";

# uncompress archive
tar zxvf "$TGZ_FILE" -C "$DATA_PATH";

# import into mongodb (tested on v4.0), means mongo server is running on host
mongoimport --username "$MONGO_LOGIN" --password "$MONGO_PASSWORD" \
--authenticationDatabase "$MONGO_DB_AUTH" \
--host "$MONGO_HOST" --db "$MONGO_DB" --collection "$MONGO_COLLECTION" \
--type "$MONGO_IMPORT_TYPE" --headerline --file="$DATA_FILE"

# clean imported file
rm $DATA_FILE;