resource "aws_iam_policy" "lambda_vpc_access" {
  name        = "${terraform.workspace}_lambda_vpc_access"
  description = "Grant Lambda function access to VPC"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
        ],
        Effect   = "Allow",
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access_attach" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_vpc_access.arn
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "${terraform.workspace}_lambda_logging"
  description = "Allow Lambda function to log to CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logging_attach" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_policy" "ecs_task_policy" {
  name        = "${terraform.workspace}_ecs_task_policy"
  path        = "/"
  description = "Policy for ECS tasks to access ECR and CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:CreateLogGroup",
        ],
        Resource = "*"
      },
    ]
  })
}
resource "aws_iam_policy" "ecs_s3_access" {
  name        = "${terraform.workspace}-ecs-s3-access"
  description = "Policy for ECS tasks to access S3 bucket for user storage"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ],
        Resource = [
          "${var.aws_s3_bucket_user_storage_arn}/*",
          "${var.aws_s3_bucket_user_storage_arn}"
        ],
        Effect = "Allow"
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "ecs_task_policy_attachment" {
  role       = aws_iam_role.ecs_tasks_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs_s3_access_attachment" {
  role       = aws_iam_role.ecs_tasks_role.name
  policy_arn = aws_iam_policy.ecs_s3_access.arn
}
