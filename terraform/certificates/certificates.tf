resource "aws_acm_certificate" "szumi_dev_cert" {
  domain_name = var.appex_domain_name

  validation_method = "DNS"


  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.domain_name} Certificate for api apex subdomain"
  }
}

resource "aws_acm_certificate_validation" "szumi_dev_cert_validation" {
  certificate_arn         = aws_acm_certificate.szumi_dev_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.szumi_dev_cert_validation : record.fqdn]

  depends_on = [aws_route53_record.szumi_dev_cert_validation]
}

resource "aws_route53_record" "szumi_dev_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.szumi_dev_cert.domain_validation_options : dvo.domain_name => {
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
