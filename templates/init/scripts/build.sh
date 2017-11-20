#!/bin/bash

# export PATH=/usr/local/n/versions/node/6.2.1/bin:$PATH
export PATH=/usr/local/n/versions/node/7.10.0/bin:$PATH

echo "[build.sh] hostname: `hostname`"
echo "[build.sh] node version: `node -v`"
echo "[build.sh] NPM version: `npm -v`"
echo "[build.sh] NODE_ENV: ${NODE_ENV}"

pwd

ls -la

cp profiles/.env.${NODE_ENV} .env && echo '.env copied'

yarn && yarn build

ls -la
