terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.37.0"  # Specify an appropriate version here
    }
  }
}

provider "aws" {
  region  = "eu-central-1"
  profile = "private"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "lambda_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-central-1a"
  tags = {
    Name = "lambda-subnet"
  }
}

resource "aws_subnet" "rds_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-central-1b"
  tags = {
    Name = "rds-subnet"
  }
}

resource "aws_security_group" "lambda_sg" {
  name   = "lambda_sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds_sg" {
  name   = "rds_sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "my_db_subnet_group"
  subnet_ids = [aws_subnet.lambda_subnet.id, aws_subnet.rds_subnet.id]

  tags = {
    Name = "My DB Subnet Group"
  }
}

variable "database_username" {
  description = "db username"
  type        = string
  default     = "username" # Replace this with your actual database name, or remove the default to require it to be passed explicitly
}
variable "database_password" {
  description = "db password"
  type        = string
  default     = "password" # Replace this with your actual database name, or remove the default to require it to be passed explicitly
}
variable "database_name" {
  description = "The name of the database"
  type        = string
  default     = "twitter_db" # Replace this with your actual database name, or remove the default to require it to be passed explicitly
}

resource "aws_db_instance" "postgres_instance" {
  engine               = "postgres"
  engine_version       = "16.2"
  instance_class       = "db.t3.micro"
  identifier           = "my-postgres-instance"
  allocated_storage    = 20 # Minimum storage for PostgreSQL on RDS
  max_allocated_storage = 100 # Enables autoscaling of storage up to 100 GiB
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  username             = "${var.database_username}"
  password             = "${var.database_password}"
  skip_final_snapshot  = true
}

resource "aws_ecr_repository" "my_ecr_repo" {
  name                 = "my-fastapi-app-repo" # Name your repository
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "My FastAPI App"
  }
}

resource "aws_ecr_lifecycle_policy" "my_ecr_repo_policy" {
  repository = aws_ecr_repository.my_ecr_repo.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description = "Expire untagged images"
        selection = {
          tagStatus = "untagged"
          countType = "imageCountMoreThan"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

output "ecr_repository_url" {
  value = aws_ecr_repository.my_ecr_repo.repository_url
}


resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
    }]
  })
}


resource "aws_lambda_function" "my_lambda" {
  function_name = "MyLambdaFunction"

  # Specify the Docker image URI
  image_uri = "${aws_ecr_repository.my_ecr_repo.repository_url}:latest" # Adjust the tag as necessary

  # The role ARN remains the same
  role = aws_iam_role.lambda_execution_role.arn

  package_type = "Image"

  environment {
    variables = {
      DATABASE_URL = "postgresql+asyncpg://${aws_db_instance.postgres_instance.username}:${aws_db_instance.postgres_instance.password}@${aws_db_instance.postgres_instance.address}/${var.database_name}"
      JWT_SECRET   = "846368bb86f674f8d5d706667ddbb003"
      ACCESS_TOKEN_DURATION_MINUTES = "15"
      REFRESH_TOKEN_DURATION_MINUTES = "60"
      ENVIRONMENT = "PRODUCTION"
    }
  }

  vpc_config {
    subnet_ids         = [aws_subnet.lambda_subnet.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}
resource "aws_iam_policy" "lambda_vpc_access" {
  name        = "lambda_vpc_access"
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
  name        = "lambda_logging"
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

# Create a Function URL for the Lambda function
resource "aws_lambda_function_url" "my_lambda_url" {
  function_name = aws_lambda_function.my_lambda.function_name
  authorization_type = "NONE" # Use "AWS_IAM" for IAM-based authentication or "NONE" for public access
}

# Output the Function URL
output "lambda_function_url" {
  value = aws_lambda_function_url.my_lambda_url.function_url
}

# # Define an API Gateway REST API resource
# resource "aws_api_gateway_rest_api" "MyAPI" {
#   name        = "MyAPI" # Name of the API
#   description = "API Gateway for Lambda" # Description of the API
# }

# # Create a proxy resource that acts as a catch-all for any path
# resource "aws_api_gateway_resource" "ProxyResource" {
#   rest_api_id = aws_api_gateway_rest_api.MyAPI.id # Associate with the defined API
#   parent_id   = aws_api_gateway_rest_api.MyAPI.root_resource_id # Set the root as parent
#   path_part   = "{proxy+}" # Special path variable that captures all paths
# }

# # Define a method for the proxy resource that accepts any HTTP method
# resource "aws_api_gateway_method" "ProxyMethod" {
#   rest_api_id   = aws_api_gateway_rest_api.MyAPI.id # Associate with the defined API
#   resource_id   = aws_api_gateway_resource.ProxyResource.id # Associate with the proxy resource
#   http_method   = "ANY" # Accept any HTTP method
#   authorization = "NONE" # No authorization required
# }

# # Integrate the proxy method with the Lambda function
# resource "aws_api_gateway_integration" "LambdaIntegration" {
#   rest_api_id             = aws_api_gateway_rest_api.MyAPI.id # Associate with the defined API
#   resource_id             = aws_api_gateway_resource.ProxyResource.id # Associate with the proxy resource
#   http_method             = aws_api_gateway_method.ProxyMethod.http_method # Use the method defined above
#   integration_http_method = "POST" # Lambda uses POST method for invocation
#   type                    = "AWS_PROXY" # Proxy integration type
#   uri                     = aws_lambda_function.my_lambda.invoke_arn # ARN of the Lambda function to invoke
# }

# # Deploy the API to make it accessible
# resource "aws_api_gateway_deployment" "MyAPIDeployment" {
#   depends_on = [
#     aws_api_gateway_integration.LambdaIntegration # Ensure integration is set up before deployment
#   ]

#   rest_api_id = aws_api_gateway_rest_api.MyAPI.id # Associate with the defined API
#   stage_name  = "v1" # Name of the deployment stage
# }

# # Grant API Gateway permission to invoke the Lambda function
# resource "aws_lambda_permission" "AllowAPIGatewayInvoke" {
#   statement_id  = "AllowAPIGatewayInvoke" # Unique identifier for the statement
#   action        = "lambda:InvokeFunction" # Action that allows API Gateway to invoke the Lambda
#   function_name = aws_lambda_function.my_lambda.function_name # Name of the Lambda function
#   principal     = "apigateway.amazonaws.com" # The principal that is allowed to invoke the function
#   source_arn    = "${aws_api_gateway_rest_api.MyAPI.execution_arn}/*/*/*" # ARN of the API Gateway to limit the source of the invocation
# }

# # Output the invocation URL of the API
# output "api_invoke_url" {
#   value = "${aws_api_gateway_deployment.MyAPIDeployment.invoke_url}v1/" # Construct the URL for invoking the API
# }
