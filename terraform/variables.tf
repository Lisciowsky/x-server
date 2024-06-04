# GLOBAL
variable "aws_region" {
  type        = string
  description = "aws region"
  default     = "eu-central-1"
}
variable "domain_name" {
  description = "The name of the domain"
  type        = string
  default     = "szumi-dev.com"
}
variable "appex_domain_name" {
  description = "The name of the appex domain"
  type        = string
  default     = "api.szumi-dev.com"
}


# POSTGRES DB INSTANCE
variable "database_username" {
  description = "db username"
  type        = string
  default     = "username"
}
variable "database_password" {
  description = "db password"
  type        = string
  default     = "password"
}
variable "database_name" {
  description = "The name of the database"
  type        = string
  default     = "twitter_db"
}

