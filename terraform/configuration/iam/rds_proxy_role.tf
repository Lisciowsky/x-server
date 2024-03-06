resource "aws_iam_role" "rds_proxy_role" {
  name = "rds_proxy_role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "rds.amazonaws.com"
      },
    }]
  })
}
