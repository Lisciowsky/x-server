terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.37.0"  # Specify an appropriate version here
    }
  }
}

provider "aws" {
  region  = "eu-central-1"
  profile = "private"
}

module "ecr" {
  source = "./configuration/ecr"
  # Add any required variables for the ECR module here
}

module "iam" {
  source = "./configuration/iam"
  # Add any required variables for the IAM module here
}

module "database" {
  source = "./configuration/database"
  
  vpc_id = module.networking.vpc_id
  db_subnet_group_name = module.networking.db_subnet_group_name # Assuming you have this output
  db_security_group_ids = [module.security.rds_sg_id]
  database_username = "username" # Replace with actual username or variable
  database_password = "password" # Replace with actual password or variable
}

module "networking" {
  source = "./networking"
  # Add any required variables for the Networking module here
}

module "security" {
  source = "./configuration/security"
  # Add any required variables for the Security module here
  vpc_id = module.networking.vpc_id
}

module "apigateway" {
  source                        = "./configuration/apigateway"
  aws_lambda_function_invoke_arn = module.lambda.lambda_function_function_arn
  region                        = "eu-central-1" # Ensure this matches your actual AWS region
}


module "lambda" {
  source = "./configuration/lambda"
  
  ecr_repository_url    = module.ecr.ecr_repository_url
  lambda_execution_role_arn = module.iam.lambda_execution_role_arn
  database_username     = module.database.db_instance_username
  database_password     = module.database.db_instance_password
  database_address      = module.database.db_instance_address
  database_name         = "twitter_db"  # Assuming you have this defined elsewhere
  lambda_subnet_id      = [module.networking.lambda_subnet_id]  # Ensure this is a list
  lambda_security_group_id = [module.security.lambda_sg_id]  # Ensure this is a list
  jwt_secret            = "846368bb86f674f8d5d706667ddbb003"  # Or source this from a secure location
  access_token_duration_minutes = "15"
  refresh_token_duration_minutes = "60"
  environment           = "PRODUCTION"
}

module "ecs" {
  source = "./configuration/ecs"

  vpc_id = module.networking.vpc_id
  database_name = var.database_name
  database_password = var.database_password
  database_username = var.database_username
  db_instance_address = module.database.db_instance_address
  ecr_repository_url = module.ecr.ecr_repository_url
  lambda_subnet_id = module.networking.lambda_subnet_id
  rds_subnet_id = module.networking.rds_subnet_id
  ecs_tasks_execution_role_arn = module.iam.ecs_tasks_execution_role
  rds_sg_id = module.security.rds_sg_id
}
