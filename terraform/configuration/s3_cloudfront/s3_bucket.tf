resource "aws_s3_bucket" "website_bucket" {
  bucket = "${terraform.workspace}-website-bucket-random-text-string-12"
  acl    = "private"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name = "${terraform.workspace} Website Bucket"
  }
}

# Bucket policy to allow access from CloudFront
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "s3:GetObject",
        Effect    = "Allow",
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*",
        Principal = { AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.oai.id}" },
      },
    ]
  })
}

# resource "aws_s3_object" "my_nextjs_deployment" {
#   bucket       = aws_s3_bucket.website_bucket.id
#   key          = "next_build"
#   source       = "../x-front/.next"
#   # content_type = "text/html"
# }