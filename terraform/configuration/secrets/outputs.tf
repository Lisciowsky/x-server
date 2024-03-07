output "aws_secretsmanager_secret_postgres_credentials_arn" {
  value = aws_secretsmanager_secret_version.postgres_credentials.arn
}
