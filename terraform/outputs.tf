# In root outputs.tf
output "ecr_repository_url" {
  value = module.ecr.ecr_repository_url
}


output "postgres_db_url" {
  value = module.database.db_instance_address
}

output "api_gateway_lambda_url" {
  value = module.apigateway.api_gateway_invoke_url
}

output "lambda_subnet_id" {
  value = module.networking.lambda_subnet_id
}

output "ecs_cluster_name" {
  value = module.ecs.ecs_cluster_name
}
output "ecs_service_name" {
  value = module.ecs.ecs_service_name
}

output "alb_dns_name" {
  value       = module.alb.alb_dns_name
}

output "proxy_endpoint" {
  value       = module.database.postgres_proxy_endpoint
}
