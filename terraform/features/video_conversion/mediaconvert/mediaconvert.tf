resource "aws_media_convert_queue" "video_queue" {
  name   = "${terraform.workspace}-video-queue"
  status = "ACTIVE"
  tags = {
    Name = "MediaConvert Queue for ${terraform.workspace}"
  }
}

resource "null_resource" "mediaconvert_job_template" {
  triggers = {
    template_hash = filesha256("${path.module}/template.json")
  }

  provisioner "local-exec" {
    command = "aws mediaconvert create-job-template --region eu-central-1 --cli-input-json file://${path.module}/template.json"
  }
}

resource "null_resource" "mediaconvert_presets" {
  triggers = {
    template_hash = filesha256("${path.module}/presets.json")
  }

  provisioner "local-exec" {
    command = "aws mediaconvert create-preset --cli-input-json file://${path.module}/presets.json --region eu-central-1"
  }
}


resource "aws_iam_role" "mediaconvert_execution_role" {
  name = "mediaconvert-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "mediaconvert.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "mediaconvert_permissions" {
  role = aws_iam_role.mediaconvert_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ],
        Resource = [
          "arn:aws:s3:::${var.video_bucket_name}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "cloudwatch:PutMetricData"
        ],
        Resource = "*"
      }
    ]
  })
}