
output "cloudfront_video_distribution_domain" {
  value = aws_cloudfront_distribution.video_distribution.domain_name
}

output "aws_cloudfront_origin_access_identity_video_oai_id" {
    value = aws_cloudfront_origin_access_identity.video_oai.id
}