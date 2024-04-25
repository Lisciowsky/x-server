data "aws_caller_identity" "current" {}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow",
      },
    ],
  })
}

resource "aws_iam_role_policy" "lambda_exec_policy" {
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "iam:PassRole",
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/mediaconvert-execution-role",
        Effect = "Allow",
        Condition = {
          StringEquals = {
            "iam:PassedToService": "mediaconvert.amazonaws.com"
          }
        }
      },
    ],
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  role   = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*",
        Effect = "Allow"
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ],
        Resource = [
          "${var.aws_s3_bucket_video_bucket_arn}/*",
        ],
        Effect = "Allow"
      },
      {
        Action = [
          "mediaconvert:*"
        ],
        Resource = "*",
        Effect = "Allow"
      }
    ],
  })
}
