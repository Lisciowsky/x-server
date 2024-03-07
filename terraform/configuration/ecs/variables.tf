variable "ecr_repository_url" {
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

variable "db_instance_address" {
    type = string
}

variable "vpc_id" {
    type = string
}

variable "lambda_subnet_id" {
    type = string
}

variable "rds_subnet_id" {
    type = string
}

variable "rds_sg_id" {
    type = string
}

variable "ecs_tasks_execution_role_arn" {
    type = string
}
variable "aws_lb_target_group_fastapi_tg_arn" {
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
