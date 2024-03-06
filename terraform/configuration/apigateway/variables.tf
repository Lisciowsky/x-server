variable "aws_lambda_function_invoke_arn" {
  type = string
}

variable "region" {
  description = "AWS region for API Gateway"
  type        = string
  default     = "eu-central-1" # Adjust this default value as necessary
}
