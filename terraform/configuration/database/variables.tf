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