output "aws_acm_certificate_my_cert_arn" {
  value = aws_acm_certificate.szumi_dev_cert.arn
}

output "aws_acm_certificate_my_cert_cloudfront_arn" {
  value = aws_acm_certificate.szumi_dev_cert_us_east_1.arn
}
