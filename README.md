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

```
terraform-project/
├── main.tf            # Main Terraform configuration file
├── variables.tf       # Variable declarations
├── outputs.tf         # Output declarations
├── networking/        # Networking resources
│   ├── vpc.tf         # AWS VPC configuration
│   ├── subnets.tf     # Subnet configurations
│   └── db_subnet_group.tf # DB Subnet Group configuration
├── security/          # Security group configurations
│   ├── lambda_sg.tf   # Lambda security group
│   └── rds_sg.tf      # RDS security group
├── database/          # Database resources
│   └── rds_instance.tf # RDS instance configuration
├── ecr/               # ECR repository and policies
│   ├── repository.tf  # ECR repository configuration
│   └── lifecycle_policy.tf # ECR lifecycle policy
├── iam/               # IAM roles and policies
│   ├── roles.tf       # IAM roles
│   └── policies.tf    # IAM policies and attachments
└── lambda/            # Lambda function and related resources
    ├── function.tf    # Lambda function configuration
    └── function_url.tf # Lambda function URL
```