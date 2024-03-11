resource "aws_secretsmanager_secret" "postgres_credentials" {
  name = "${terraform.workspace}_postgres_credentials_v2"
}

resource "aws_secretsmanager_secret_version" "postgres_credentials" {
  secret_id     = aws_secretsmanager_secret.postgres_credentials.id
  secret_string = jsonencode({
    username = var.database_username
    password = var.database_password
  })
}