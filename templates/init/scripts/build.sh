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
echo '[build.sh] .env created.'

# 选择 node 编译类型时，jenkins 会自动安装依赖
# 为了确保依赖包成功安装，此处再检查一下 packing 依赖包是否安装
if [ ! -d node_modules/packing ]; then
  npm install --production --registry https://registry.npm.taobao.org
fi

npm run build

ls -la
