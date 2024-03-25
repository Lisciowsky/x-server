resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "${terraform.workspace} OAI for Website"
}

resource "aws_cloudfront_distribution" "website_distribution" {

  aliases = [ var.aws_route53_zone_name ]
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "${terraform.workspace}-website-origin"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.oai.id}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index"

  # Removed the aliases parameter

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${terraform.workspace}-website-origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    # viewer_protocol_policy = "redirect-to-https"
    viewer_protocol_policy = "redirect-to-https"  # This line is changed

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.aws_acm_certificate_my_cert_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2018"
  }

  tags = {
    Name = "${terraform.workspace} Website Distribution"
  }
}