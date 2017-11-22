#!/bin/bash

# 编译机上可用node版本：[0.12.7/4.2.4/5.12.0/6.2.1/6.9.2/7.10.0/8.9.1]
# export PATH=/usr/local/n/versions/node/6.2.1/bin:$PATH
# export PATH=/usr/local/n/versions/node/7.10.0/bin:$PATH
export PATH=/usr/local/n/versions/node/8.9.1/bin:$PATH

echo "[build.sh] hostname: `hostname`"
echo "[build.sh] node version: `node -v`"
echo "[build.sh] NPM version: `npm -v`"
echo "[build.sh] NODE_ENV: ${NODE_ENV}"

pwd

ls -la

echo NODE_ENV=${NODE_ENV} > .env
echo '.env created.'

npm install && npm run build

ls -la
