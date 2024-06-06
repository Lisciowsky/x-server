terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.37.0"
    }
  }
}

data "aws_caller_identity" "current" {}

provider "aws" {
  region  = "eu-central-1"
  profile = "private"
}

module "secret" {
  source                  = "./configuration/secrets"
  media_cdn_public_key_id = module.cloudfront_media.media_public_key_id
}


module "iam" {
  source                         = "./configuration/iam"
  aws_s3_bucket_user_storage_arn = module.s3_cloudfront.user_storage_bucket_arn
}
module "ecr" {
  source = "./configuration/ecr"
}

module "networking" {
  source     = "./networking"
  aws_region = var.aws_region
}

module "security" {
  source = "./configuration/security"
  vpc_id = module.networking.vpc_id
}

module "certificates" {
  source                        = "./certificates"
  aws_route53_zone_main_zone_id = module.route53.aws_route53_zone_main_zone_id
  domain_name                   = var.domain_name
  appex_domain_name             = var.appex_domain_name
}

module "waf" {
  source  = "./configuration/waf"
  alb_arn = module.alb.alb_arn
}

module "route53" {
  source                                       = "./configuration/route53"
  alb_alb_dns_name                             = module.alb.alb_dns_name
  alb_alb_zone_id                              = module.alb.alb_zone_id
  s3_cloudfront_cloudfront_distribution_domain = module.s3_cloudfront.cloudfront_distribution_domain
  appex_domain_name                            = var.appex_domain_name
  domain_name                                  = var.domain_name
}
module "alb" {
  source                          = "./configuration/alb"
  vpc_id                          = module.networking.vpc_id
  aws_security_group_alb_sg_id    = module.security.alb_sg_id
  subnet_a_id                     = module.networking.subnet_a_id
  subnet_b_id                     = module.networking.subnet_b_id
  aws_acm_certificate_my_cert_arn = module.certificates.aws_acm_certificate_my_cert_arn
}

module "s3_cloudfront" {
  source                          = "./configuration/s3_cloudfront"
  aws_acm_certificate_my_cert_arn = module.certificates.aws_acm_certificate_my_cert_cloudfront_arn
  aws_route53_zone_name           = module.route53.aws_route53_zone_name
  domain_name                     = var.domain_name
}

module "database" {
  source = "./configuration/database"

  vpc_id                = module.networking.vpc_id
  db_subnet_group_name  = module.networking.db_subnet_group_name
  db_security_group_ids = [module.security.rds_sg_id]
  database_username     = var.database_username
  database_password     = var.database_password

  aws_security_group_rds_sg_id = module.security.rds_sg_id
}

module "ecs" {
  source     = "./configuration/ecs"
  aws_region = var.aws_region

  vpc_id                             = module.networking.vpc_id
  ecr_repository_url                 = module.ecr.ecr_repository_url
  subnet_a_id                        = module.networking.subnet_a_id
  subnet_b_id                        = module.networking.subnet_b_id
  ecs_tasks_execution_role_arn       = module.iam.ecs_tasks_execution_role
  rds_sg_id                          = module.security.rds_sg_id
  aws_lb_target_group_fastapi_tg_arn = module.alb.aws_lb_target_group_fastapi_tg_arn
  ecs_tasks_execution_role           = module.iam.ecs_tasks_execution_role
  ecs_tasks_task_role_arn            = module.iam.ecs_tasks_role

  database_name                     = var.database_name
  database_password                 = var.database_password
  database_username                 = var.database_username
  db_instance_address               = module.database.db_instance_address
  jwt_secret                        = "846368bb86f674f8d5d706667ddbb003"
  access_token_duration_minutes     = "15"
  refresh_token_duration_minutes    = "60"
  environment                       = "PRODUCTION"
  storage_bucket_name               = module.s3_cloudfront.user_storage_bucket_name
  region_name                       = var.aws_region
  media_convert_bucket_name         = module.s3_media.aws_s3_video_bucket_name
  media_cloudfront_domain           = module.cloudfront_media.cloudfront_video_distribution_domain
  media_cdn_public_key_secret_name  = module.secret.media_cdn_public_key_secret_name
  media_private_key_cdn_secret_name = module.secret.media_cdn_private_key_secret_name
  domain_name                       = var.domain_name
}

module "media_convert" {
  source                    = "./features/video_conversion/mediaconvert"
  mediaconvert_endpoint_url = "https://usryickja.mediaconvert.eu-central-1.amazonaws.com"
  video_bucket_name         = module.s3_media.aws_s3_video_bucket_name
}

module "lambda_convert" {
  source                          = "./features/video_conversion/lambda_convert"
  aws_s3_bucket_video_bucket_arn  = module.s3_media.aws_s3_video_bucket_arn
  ecr_repository_url              = module.ecr.ecr_repository_url
  aws_s3_bucket_video_bucket_id   = module.s3_media.aws_s3_video_bucket_id
  mediaconvert_execution_role_arn = module.media_convert.mediaconvert_execution_role_arn
}

module "s3_media" {
  source                                                  = "./features/video_conversion/s3_media"
  aws_cloudfront_origin_access_identity_video_oai_id      = module.cloudfront_media.aws_cloudfront_origin_access_identity_video_oai_id
  aws_lambda_function_media_convert_trigger_function_arn  = module.lambda_convert.aws_lambda_function_media_convert_trigger_function_arn
  aws_lambda_function_media_convert_trigger_function_name = module.lambda_convert.aws_lambda_function_media_convert_trigger_function_name
  domain_name = var.domain_name
}

module "cloudfront_media" {
  source                                   = "./features/video_conversion/cloudfront_media"
  aws_acm_certificate_my_cert_arn          = module.certificates.aws_acm_certificate_my_cert_cloudfront_arn
  aws_s3_video_bucket_origin_id            = module.s3_media.aws_s3_video_bucket_id
  aws_s3_video_bucket_regional_domain_name = module.s3_media.aws_s3_video_bucket_regional_domain_name
  aws_account_id                           = data.aws_caller_identity.current.id
}

