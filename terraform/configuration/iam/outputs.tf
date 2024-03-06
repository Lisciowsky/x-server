output "lambda_execution_role_arn" {
  value = aws_iam_role.lambda_execution_role.arn
}

output "rds_proxy_role_arn" {
  value = aws_iam_role.rds_proxy_role.arn
}
