output "ecr_repository_url" {
  value = module.ecr.ecr_repository_url
}

output "postgres_db_url" {
  value = module.database.db_instance_address
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

output "cloudfront_distribution_domain" {
  value = module.s3_cloudfront.cloudfront_distribution_domain
}

output "storage_bucket_name" {
  value = module.s3_cloudfront.user_storage_bucket_name
}

# output "api_gateway_lambda_url" {
#   value = module.apigateway.api_gateway_invoke_url
# }