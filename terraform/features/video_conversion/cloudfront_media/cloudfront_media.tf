# CloudFront Distribution for streaming video content with Signed URLs
resource "aws_cloudfront_origin_access_identity" "video_oai" {
  comment = "OAI for ${terraform.workspace} Video Distribution"
}

resource "aws_cloudfront_public_key" "media_public_key" {
  name        = "${terraform.workspace}-example-public-key"
  encoded_key = <<-EOT
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxflEhLgqoJWlMeD/xPOA
0dbhgoRC4d52EtiB/f7aipK8B+CP87zM1Kvn2LxwTn4pE6xMTgRzI6bEHxANcWME
GdKCQf/ehKiKiekbyzhY2/yC4gsUs3eIdYC6Fl9P4K+S3QWWaU9Vk3oFWxV9ZLGJ
+2CyUZQVZD/pLi5um2RfKY80fmm1BQd+OF6nq8BY1ijSQe4rSJuVVK9EXuMUsWqg
2p4IZA/fWejpW4SQTX4kzpb7QRy9h/SJ9vZy/4JjHL6EEcE4WUdMyal2HvPF1e7l
TvEJhEbGvlViqk+8mfFvZLRg7Aa6pnuYH/LyGyC6G5E6uC50ubLNwrJAuol+AxKX
VQIDAQAB
-----END PUBLIC KEY-----
EOT
  comment     = "An example public key"
}

resource "aws_cloudfront_key_group" "media_key_group" {
  name    = "${terraform.workspace}-example-key-group"
  items   = [aws_cloudfront_public_key.media_public_key.id]
  comment = "media_key_group key group"
}


resource "aws_cloudfront_distribution" "video_distribution" {
  enabled         = true
  is_ipv6_enabled = true

  origin {
    domain_name = var.aws_s3_video_bucket_regional_domain_name
    origin_id   = "S3-${var.aws_s3_video_bucket_origin_id}"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.video_oai.id}"
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3-${var.aws_s3_video_bucket_origin_id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    trusted_key_groups     = [aws_cloudfront_key_group.media_key_group.id]
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    min_ttl                   = 0
    default_ttl               = 86400
    max_ttl                   = 31536000
    compress                  = true
    smooth_streaming          = true
    field_level_encryption_id = ""
  }

  viewer_certificate {
    acm_certificate_arn      = var.aws_acm_certificate_my_cert_arn
    ssl_support_method       = "sni-only"
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