resource "aws_lambda_function" "my_lambda" {
  function_name = "MyLambdaFunction"

  image_uri     = "${var.ecr_repository_url}:latest"
  role          = var.lambda_execution_role_arn
  package_type  = "Image"

  environment {
    variables = {
      DATABASE_URL = "postgresql+asyncpg://${var.database_username}:${var.database_password}@${var.postgres_proxy_endpoint}/${var.database_name}"
      JWT_SECRET                    = var.jwt_secret
      ACCESS_TOKEN_DURATION_MINUTES = var.access_token_duration_minutes
      REFRESH_TOKEN_DURATION_MINUTES= var.refresh_token_duration_minutes
      ENVIRONMENT                   = var.environment
    }
  }

  vpc_config {
    subnet_ids         = var.lambda_subnet_id
    security_group_ids = var.lambda_security_group_id
  }
}

resource "aws_lambda_function_url" "my_lambda_url" {
  function_name     = aws_lambda_function.my_lambda.function_name
  authorization_type= "NONE"
}
