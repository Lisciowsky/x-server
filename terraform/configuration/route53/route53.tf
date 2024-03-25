resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "alb_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.appex_domain_name
  type    = "A"

  alias {
    name                   = var.alb_alb_dns_name
    zone_id                = var.alb_alb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "cloudfront_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.s3_cloudfront_cloudfront_distribution_domain # Replace this with your CloudFront distribution domain name
    zone_id                = "Z2FDTNDATAQYW2" # This is the zone ID for CloudFront distributions
    evaluate_target_health = false # Typically set to false for CloudFront distributions
  }
}
