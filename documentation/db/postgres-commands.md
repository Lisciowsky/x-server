## connect to postgres database

psql -h my-postgres-instance.cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com -p 5432 -U username -d postgres

<br></br>

## connect to postgres proxy and db

psql -h postgres-proxy.proxy-cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com -p 5432 -U username -d twitter_db


# get connections
SELECT * FROM pg_stat_activity;

postgres=> \conninfo
You are connected to database "postgres" as user "username" on host "my-postgres-instance.cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com" (address "18.192.52.230") at port "5432".
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
