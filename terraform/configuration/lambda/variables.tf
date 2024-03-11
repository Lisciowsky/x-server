variable "ecr_repository_url" {
  description = "ECR Repository URL for the Lambda function image"
  type        = string
}

variable "lambda_execution_role_arn" {
  description = "ARN of the IAM role that Lambda will assume for execution"
  type        = string
}

variable "database_username" {
  description = "Username for database access"
  type        = string
}

variable "database_password" {
  description = "Password for database access"
  type        = string
}

variable "database_address" {
  description = "Address of the database instance"
  type        = string
}

variable "database_name" {
  description = "Name of the database to connect to"
  type        = string
}

variable "subnet_a_id" {
  description = "Subnet ID where the Lambda function will be deployed"
  type        = string
}

variable "lambda_security_group_id" {
  description = "Security group ID for the Lambda function"
  type        = string
}

variable "jwt_secret" {
  description = "Secret key for JWT encoding/decoding"
  type        = string
  default     = "846368bb86f674f8d5d706667ddbb003"
}

variable "access_token_duration_minutes" {
  description = "Duration in minutes for which the access token is valid"
  type        = string
  default     = "15"
}

variable "refresh_token_duration_minutes" {
  description = "Duration in minutes for which the refresh token is valid"
  type        = string
  default     = "60"
}

variable "environment" {
  description = "Deployment environment (e.g., PRODUCTION, DEVELOPMENT)"
  type        = string
  default     = "PRODUCTION"
}
