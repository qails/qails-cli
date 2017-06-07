#!/bin/bash
# chkconfig: 2345 10 90
# description: qunar_<%=appname%>

export PATH=/usr/local/node/bin:$PATH

# 常量定义 development/beta/production
NODE_ENV=
[[ `hostname` =~ "dev" ]] && NODE_ENV=development
[[ `hostname` =~ "beta" ]] && NODE_ENV=beta
if [ ! -n "${NODE_ENV}" ]; then
  NODE_ENV=production
fi

BIN_DIR=/usr/local/bin/
CWD=/home/q/www/<%=appname%>.qunar.com
PROG=qunar_<%=appname%>
LOG=logs/${PROG}.log
EXIT_CODE=0
PROCESSES=${CWD}/ecosystem.config.js

# 变量赋值
action=${!#}
first=$1

export PATH=$PATH:/usr/local/bin;
# 为了好管理 .pm2 目录
export HOME=/root

if [ ! -d "${CWD}/static" ]; then
  echo -n "[info] ${CWD}/static not exist, create it now"
  mkdir -p ${CWD}/static
  echo "...ok"
fi

if [ ! -d "${CWD}/logs" ]; then
  echo -n "[info] ${CWD}/logs not exist, create it now"
  mkdir ${CWD}/logs
  echo "...ok"
fi

# 进入工作目录
cd ${CWD}

start() {
  # 启动web服务
  echo "Starting ${PROG}:"
  pm2 start ${PROCESSES} || exit 1
  echo "The ${PROG} service is started"
}

stop() {
  pm2 delete ${PROCESSES} -m
}

case "${action}" in
  start)
	 start
	  ;;
  stop)
  	stop
  	;;
  restart)
  	stop
  	start
  	;;
  *)
    echo "invalid action is : ${action}"
  	echo $"Usage: ${PROG} {start|stop|restart|}"
    EXIT_CODE=2
esac

exit $EXIT_CODE
