resource "aws_db_proxy" "postgres_proxy" {
  name                   = "postgres-proxy"
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = false
  role_arn               = var.rds_proxy_role_arn
  vpc_security_group_ids = var.db_security_group_ids
  vpc_subnet_ids         = var.db_subnet_ids

  auth {
    auth_scheme = "SECRETS"
    iam_auth    = "DISABLED"
    secret_arn  = var.postgres_credentials_arn
  }

  tags = {
    Name = "postgres-proxy"
  }
}
