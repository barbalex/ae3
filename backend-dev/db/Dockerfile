# see: https://hub.docker.com/_/postgres
# 2026.10.14: live server (arteigenschaften.ch) still runs postgres 14
# new production server will run 18
FROM postgres:18.4

# init db from ae.backup (only runs when no db detected)
COPY ./init/ /docker-entrypoint-initdb.d/
COPY ./ae.backup /sik_data/ae.backup
RUN chmod +x /docker-entrypoint-initdb.d/02_restore.sh

# Install some helpful stuff
RUN apt-get -qq update
# log less: https://askubuntu.com/a/668859
RUN apt-get install -y -qq curl
RUN apt-get install -y -qq bash
RUN apt-get install -y -qq nano
RUN apt-get install -y -qq rclone