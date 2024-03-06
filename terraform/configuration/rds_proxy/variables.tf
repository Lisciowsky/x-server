variable "db_security_group_ids" {
  type        = list(string)
}

variable "db_subnet_ids" {
  type        = list(string)
}

variable "rds_proxy_role_arn" {
  type        = string
}

variable "postgres_credentials_arn" {
  type        = string
}