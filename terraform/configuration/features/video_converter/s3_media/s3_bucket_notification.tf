resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.video_bucket.id

  lambda_function {
    lambda_function_arn = var.aws_lambda_function_media_convert_trigger_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = var.aws_lambda_function_media_convert_trigger_function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.video_bucket.arn
}
