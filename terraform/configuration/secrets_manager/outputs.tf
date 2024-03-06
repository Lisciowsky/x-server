output "postgres_credentials_arn" {
  value = aws_secretsmanager_secret.postgres_credentials.arn
}