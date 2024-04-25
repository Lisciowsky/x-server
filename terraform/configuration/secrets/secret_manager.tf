resource "aws_secretsmanager_secret" "mediaconvert_job_settings" {
  name = "${terraform.workspace}_mediaconvert_job_settings"
}

resource "aws_secretsmanager_secret_version" "mediaconvert_job_settings" {
  secret_id     = aws_secretsmanager_secret.mediaconvert_job_settings.id
  secret_string = jsonencode({

  })
}
