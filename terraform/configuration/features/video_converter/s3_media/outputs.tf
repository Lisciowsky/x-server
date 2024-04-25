output "aws_s3_video_bucket_regional_domain_name" {
  value = aws_s3_bucket.video_bucket.bucket_regional_domain_name
}
output "aws_s3_video_bucket_id" {
  value = aws_s3_bucket.video_bucket.id
}

output "aws_s3_video_bucket_name" {
  value = aws_s3_bucket.video_bucket.bucket
}

output "aws_s3_video_bucket_arn" {
  value = aws_s3_bucket.video_bucket.arn
}
