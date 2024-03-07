resource "aws_db_proxy" "postgres_proxy" {
  name                   = "my-postgres-proxy"
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = false
  role_arn               = var.aws_iam_role_rds_proxy_role_arn
  vpc_security_group_ids = [var.aws_security_group_rds_sg_id]
  vpc_subnet_ids         = [var.aws_subnet_lambda_subnet_id, var.aws_subnet_rds_subnet_id]

  auth {
    auth_scheme = "SECRETS"
    description = "RDS Proxy authentication"
    iam_auth    = "DISABLED"
    secret_arn  = var.aws_secretsmanager_secret_postgres_credentials_arn
  }
}