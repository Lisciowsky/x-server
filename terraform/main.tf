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

module "secret" {
  source = "./configuration/secrets"
  database_password = var.database_password
  database_username = var.database_username
}

module "route53" {
  source = "./configuration/route53"
  alb_alb_dns_name = module.alb.alb_dns_name
  alb_alb_zone_id = module.alb.alb_zone_id
  s3_cloudfront_cloudfront_distribution_domain = module.s3_cloudfront.cloudfront_distribution_domain
  appex_domain_name = var.appex_domain_name
  domain_name = var.domain_name
}

module "certificates" {
  source = "./certificates"
  aws_route53_zone_main_zone_id = module.route53.aws_route53_zone_main_zone_id
}
module "database" {
  source = "./configuration/database"
  
  vpc_id = module.networking.vpc_id
  db_subnet_group_name = module.networking.db_subnet_group_name # Assuming you have this output
  db_security_group_ids = [module.security.rds_sg_id]
  database_username = var.database_username # Replace with actual username or variable
  database_password = var.database_password # Replace with actual password or variable

  aws_security_group_rds_sg_id = module.security.rds_sg_id
}

module "networking" {
  source = "./networking"
  aws_region = var.aws_region
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
  database_name         = var.database_name  # Assuming you have this defined elsewhere
  subnet_a_id =   module.networking.subnet_a_id
  lambda_security_group_id = module.security.lambda_sg_id  # Ensure this is a list
  jwt_secret            = "846368bb86f674f8d5d706667ddbb003"  # Or source this from a secure location
  access_token_duration_minutes = "15"
  refresh_token_duration_minutes = "60"
  environment           = "PRODUCTION"
}

module "alb" {
  source = "./configuration/alb"
  vpc_id = module.networking.vpc_id
  aws_security_group_alb_sg_id = module.security.alb_sg_id
  subnet_a_id = module.networking.subnet_a_id
  subnet_b_id =  module.networking.subnet_b_id
  aws_acm_certificate_my_cert_arn = module.certificates.aws_acm_certificate_my_cert_arn
}

module "ecs" {
  source = "./configuration/ecs"
  aws_region = var.aws_region

  vpc_id = module.networking.vpc_id
  ecr_repository_url = module.ecr.ecr_repository_url
  subnet_a_id = module.networking.subnet_a_id
  subnet_b_id = module.networking.subnet_b_id
  ecs_tasks_execution_role_arn = module.iam.ecs_tasks_execution_role
  rds_sg_id = module.security.rds_sg_id
  aws_lb_target_group_fastapi_tg_arn = module.alb.aws_lb_target_group_fastapi_tg_arn
  ecs_tasks_execution_role = module.iam.ecs_tasks_execution_role

  # fastapi webserver requirements
  database_name = var.database_name
  database_password = var.database_password
  database_username = var.database_username
  db_instance_address = module.database.db_instance_address
  jwt_secret = "846368bb86f674f8d5d706667ddbb003"
  access_token_duration_minutes = "15"
  refresh_token_duration_minutes = "60"
  environment           = "PRODUCTION"
}


module "s3_cloudfront" {
  source = "./configuration/s3_cloudfront"
  aws_acm_certificate_my_cert_arn = module.certificates.aws_acm_certificate_my_cert_cloudfront_arn
  aws_route53_zone_name = module.route53.aws_route53_zone_name
}

module "waf" {
  source = "./configuration/waf"
  alb_arn = module.alb.alb_arn
}

