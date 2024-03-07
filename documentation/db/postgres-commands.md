## connect to postgres database

psql -h my-postgres-instance.cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com -p 5432 -U username -d postgres

<br></br>

## connect to postgres proxy and db

psql -h postgres-proxy.proxy-cbsoi6gs4a1o.eu-central-1.rds.amazonaws.com -p 5432 -U username -d twitter_db
