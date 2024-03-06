resource "aws_lambda_permission" "allow_apigateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  
  # Optional: Restrict to a specific source ARN for tighter security. 
  # source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${module.apigateway.api_id}/*/*/*"
}
