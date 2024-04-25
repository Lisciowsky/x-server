# CloudFront Origin Access Identity to access S3 bucket securely
resource "aws_cloudfront_origin_access_identity" "video_oai" {
  comment = "OAI for ${terraform.workspace} Video Distribution"
}

# CloudFront Distribution for streaming video content
resource "aws_cloudfront_distribution" "video_distribution" {
  enabled = true
  is_ipv6_enabled = true

  origin {
    domain_name = var.aws_s3_video_bucket_regional_domain_name
    origin_id   = "S3-${var.aws_s3_video_bucket_origin_id}"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.video_oai.id}"
    }
  }

  default_cache_behavior {
    target_origin_id = "S3-${var.aws_s3_video_bucket_origin_id}"
    viewer_protocol_policy  = "redirect-to-https"
    allowed_methods         = ["GET", "HEAD", "OPTIONS"]
    cached_methods          = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true

    smooth_streaming       = true  # Enable for Smooth Streaming for media files
    field_level_encryption_id = ""
  }

  viewer_certificate {
    acm_certificate_arn = var.aws_acm_certificate_my_cert_arn
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = "${terraform.workspace}"
  }
}
