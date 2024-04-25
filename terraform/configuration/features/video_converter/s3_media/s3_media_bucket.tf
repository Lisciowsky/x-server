resource "aws_s3_bucket" "video_bucket" {
  bucket_prefix = "${terraform.workspace}-video-content-"
  acl           = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  tags = {
    Name        = "${terraform.workspace} Video Content Bucket"
    Environment = "${terraform.workspace}"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_s3_bucket_policy" "video_bucket_policy" {
  bucket = aws_s3_bucket.video_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${var.aws_cloudfront_origin_access_identity_video_oai_id}"
        },
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.video_bucket.arn}/*"
      }
    ]
  })
}
