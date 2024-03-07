echo -n "passwordusername" | md5sum | awk '{print "md5"$1}'


docker run --name pgbouncer -p 6432:6432 \
  -v ./pgbouncer.ini:/etc/pgbouncer/pgbouncer.ini \
  -v ./userlist.txt:/etc/pgbouncer/userlist.txt \
  -d edoburu/pgbouncer

psql -h localhost -p 6432 -U username twitter_db


/var/log/pgbouncer/pgbouncer.log