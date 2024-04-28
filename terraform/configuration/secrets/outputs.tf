output "media_cdn_private_key_secret_name" {
  value       = aws_secretsmanager_secret.media_cdn_private_key.name
  description = "The name of the AWS Secrets Manager secret for the media CDN private key"
}

output "media_cdn_private_key_secret_arn" {
  value       = aws_secretsmanager_secret.media_cdn_private_key.arn
  description = "The ARN of the AWS Secrets Manager secret for the media CDN private key"
}

output "media_private_key_cdn_secret_name" {
  value = aws_secretsmanager_secret.media_cdn_private_key.name
}

output "media_cdn_public_key_secret_name" {
  value = aws_secretsmanager_secret.media_cdn_public_key_id.name
}