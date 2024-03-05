output "lambda_function_name" {
  value = aws_lambda_function.my_lambda.function_name
}

output "lambda_function_url" {
  value = aws_lambda_function_url.my_lambda_url.function_url
}
