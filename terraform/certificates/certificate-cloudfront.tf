# Additional AWS provider for us-east-1
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

resource "aws_acm_certificate" "szumi_dev_cert_us_east_1" {
  provider            = aws.us-east-1
  domain_name         = "szumi-dev.com"
  validation_method   = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "szumi-dev.com Certificate - US East 1"
  }
}


resource "aws_acm_certificate_validation" "szumi_dev_cert_validation_us_east_1" {
  provider              = aws.us-east-1
  certificate_arn       = aws_acm_certificate.szumi_dev_cert_us_east_1.arn
  validation_record_fqdns = [for record in aws_route53_record.szumi_dev_cert_validation_us_east_1 : record.fqdn]

  depends_on = [aws_route53_record.szumi_dev_cert_validation_us_east_1]
}

resource "aws_route53_record" "szumi_dev_cert_validation_us_east_1" {
  provider = aws.us-east-1

  for_each = {
    for dvo in aws_acm_certificate.szumi_dev_cert_us_east_1.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.aws_route53_zone_main_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}