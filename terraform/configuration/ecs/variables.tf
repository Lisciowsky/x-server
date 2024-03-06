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

