resource "aws_wafv2_web_acl" "example" {
  name        = "example-web-acl"
  description = "Example WAF Web ACL"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "exampleWebAcl"
    sampled_requests_enabled   = true
  }

  # Existing RateLimitRule
  rule {
    name     = "RateLimitRule"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 500
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }
  # Add more rules as needed
}

resource "aws_wafv2_web_acl_association" "example" {
  resource_arn = var.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.example.arn
}