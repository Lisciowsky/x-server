## Instal terraform
sudo apt-get update
sudo apt-get install -y gnupg software-properties-common curl
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt-get update
sudo apt-get install terraform
terraform -version

<br></br>

## install aws-nuke
wget -c https://github.com/rebuy-de/aws-nuke/releases/download/v2.25.0/aws-nuke-v2.25.0-linux-amd64.tar.gz -O - | tar -xz -C $HOME/bin

... then you can nuke using binary executable: "aws-nuke-v2.25.0-linux-amd64"

<br></br>

## Infra cost
curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh

<br></br>
## Coverage
pip install coverage
...then:
 - make coverage
 - make html

<br></br>
## Terraform

![alt text](https://github.com/Lisciowsky/x-server/blob/main/terraform/diagram.png?raw=true)

## PgBouncer as PostgresDBProxy
There is issue with using fastaspi asnyc engine or any other asnyc engine
with aws rds proxy, that's why I will try to integrate pgbouncer running as a task on ecs.
https://github.com/MagicStack/asyncpg/issues/952

UPDATE: moved to subfolder, pgbouncer add more complexity + didn't see much of a improvement. Moved all the related pgbouncer files to /research/pgbouncer subfolder.


