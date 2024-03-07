# POSTGRES DB INSTANCE
variable "vpc_id" {}
variable "db_subnet_group_name" {}
variable "db_security_group_ids" {
  description = "List of security group IDs for the DB instance"
  type        = list(string)
}
variable "database_username" {}
variable "database_password" {}

# POSTGRES PROXY
variable "aws_security_group_rds_sg_id" {
  type = string
}
variable "aws_subnet_lambda_subnet_id" {
  type = string
}
variable "aws_subnet_rds_subnet_id" {
  type = string
}
variable "aws_iam_role_rds_proxy_role_arn" {
  type = string
}
variable "aws_secretsmanager_secret_postgres_credentials_arn" {
  type = string
}