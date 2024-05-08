resource "aws_s3_bucket" "user_storage" {
  bucket_prefix = "${terraform.workspace}-user-storage-bucket-random-string"
  acl           = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "DELETE", "HEAD"]
    allowed_origins = ["http://localhost:3000", "https://szumi-dev.com"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  tags = {
    Name = "${terraform.workspace} User Storage"
  }
}
