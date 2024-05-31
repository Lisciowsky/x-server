resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = var.aws_s3_bucket_video_bucket_id

  lambda_function {
    lambda_function_arn = aws_lambda_function.media_convert_trigger.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.media_convert_trigger.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = var.aws_s3_bucket_video_bucket_arn
}
 