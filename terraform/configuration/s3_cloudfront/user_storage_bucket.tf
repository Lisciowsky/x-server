resource "aws_s3_bucket" "user_storage" {
  bucket_prefix = "${terraform.workspace}-user-storage-"
  acl           = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "DELETE", "HEAD"]
    allowed_origins = ["http://localhost:3000", "https://szumi-dev.com"] # Adjust this for production
    expose_headers  = []
    max_age_seconds = 3000
  }

  tags = {
    Name = "${terraform.workspace} User Storage"
  }
}
