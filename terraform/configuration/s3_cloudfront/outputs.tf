output "website_bucket_name" {
  value = aws_s3_bucket.website_bucket.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.website_distribution.id
}

output "cloudfront_distribution_domain" {
  value = aws_cloudfront_distribution.website_distribution.domain_name
}

output "user_storage_bucket_arn" {
  value = aws_s3_bucket.user_storage.arn
}
output "user_storage_bucket_name" {
  value = aws_s3_bucket.user_storage.bucket
}
