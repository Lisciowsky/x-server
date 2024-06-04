variable "aws_region" {
  type = string
}
variable "ecr_repository_url" {
  type = string
}

variable "db_instance_address" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_a_id" {
  type = string
}

variable "subnet_b_id" {
  type = string
}

variable "rds_sg_id" {
  type = string
}

variable "ecs_tasks_execution_role_arn" {
  type = string
}
variable "ecs_tasks_task_role_arn" {
  type = string
}


variable "aws_lb_target_group_fastapi_tg_arn" {
  type = string
}
variable "ecs_tasks_execution_role" {
  type = string
}


# For application
variable "jwt_secret" {
  type = string
}

variable "access_token_duration_minutes" {
  type = string
}
variable "refresh_token_duration_minutes" {
  type = string
}
variable "environment" {
  type = string
}
variable "database_name" {
  type = string
}

variable "database_username" {
  type = string
}

variable "database_password" {
  type = string
}

# Storage S3 Bucket app env variables
variable "storage_bucket_name" {
  type = string
}

variable "region_name" {
  type = string
}

variable "media_convert_bucket_name" {
  type = string
}

# Media Cloudfront Integration
variable "media_cloudfront_domain" {
  type = string
}
variable "media_private_key_cdn_secret_name" {
  type = string
}
variable "media_cdn_public_key_secret_name" {
  type = string
}
variable "domain_name" {
  type = string
}