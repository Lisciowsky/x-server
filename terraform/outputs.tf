output "postgres_db_url" {
  value = module.database.db_instance_address
}

output "storage_bucket_name" {
  value = module.s3_cloudfront.user_storage_bucket_name
}

output "media_convert_bucket_name" {
  value = module.s3_media.aws_s3_video_bucket_name
}
output "media_cloudfront_domain" {
  value = module.cloudfront_media.cloudfront_video_distribution_domain
}

output "media_private_key_cdn_secret_name" {
  value = module.secret.media_cdn_private_key_secret_name
}

output "media_public_key_cdn_secret_name" {
  value = module.secret.media_private_key_cdn_secret_name
}

output "ecr_repository_url" {
  value = module.ecr.ecr_repository_url
}
output "cloudfront_distribution_id" {
  value = module.s3_cloudfront.cloudfront_distribution_id
}

output "ecs_cluster_name" {
  value = module.ecs.ecs_cluster_name
}
output "ecs_service_name" {
  value = module.ecs.ecs_service_name
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}
