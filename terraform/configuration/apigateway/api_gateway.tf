resource "aws_api_gateway_rest_api" "MyAPI" {
  name        = "${terraform.workspace}-MyAPI"
  description = "API Gateway for redirecting to FastAPI"
}

resource "aws_api_gateway_resource" "MyAPIResource" {
  rest_api_id = aws_api_gateway_rest_api.MyAPI.id
  parent_id   = aws_api_gateway_rest_api.MyAPI.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "MyAPIMethod" {
  rest_api_id   = aws_api_gateway_rest_api.MyAPI.id
  resource_id   = aws_api_gateway_resource.MyAPIResource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "LambdaIntegration" {
  rest_api_id = aws_api_gateway_rest_api.MyAPI.id
  resource_id = aws_api_gateway_resource.MyAPIResource.id
  http_method = aws_api_gateway_method.MyAPIMethod.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${var.aws_lambda_function_invoke_arn}/invocations"
}

resource "aws_api_gateway_deployment" "MyAPIDeployment" {
  depends_on = [
    aws_api_gateway_integration.LambdaIntegration,
  ]

  rest_api_id = aws_api_gateway_rest_api.MyAPI.id
  stage_name  = "${terraform.workspace}"
}
