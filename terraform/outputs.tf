# In root outputs.tf
output "ecr_repository_url" {
  value = module.ecr.ecr_repository_url
}

output "lambda_function_url" {
  value = module.lambda.lambda_function_url
}

output "postgres_db_url" {
  value = module.database.db_instance_address
}

output "postgres_proxy_db_endpoint" {
  value = module.proxy.postgres_proxy_endpoint
}
