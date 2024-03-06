resource "aws_secretsmanager_secret" "postgres_credentials" {
  name = "postgres_credentials"
}

resource "aws_secretsmanager_secret_version" "postgres_credentials_version" {
  secret_id     = aws_secretsmanager_secret.postgres_credentials.id
  secret_string = "{\"username\":\"${var.database_username}\", \"password\":\"${var.database_password}\"}"
}
