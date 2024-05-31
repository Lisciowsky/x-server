resource "aws_lambda_function" "media_convert_trigger" {
  function_name = "${terraform.workspace}_media_convert_trigger"

  image_uri    = "${var.ecr_repository_url}:converter-latest"
  role         = aws_iam_role.lambda_exec.arn
  package_type = "Image"

  timeout     = 60
  memory_size = 128


  environment {
    variables = {
      MEDIA_CONVERT_ROLE_ARN = var.mediaconvert_execution_role_arn
      OUTPUT_BUCKET          = var.aws_s3_bucket_video_bucket_id
    }
  }
}
