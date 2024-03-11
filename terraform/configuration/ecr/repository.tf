resource "aws_ecr_repository" "my_ecr_repo" {
  name                 = "${terraform.workspace}-fastapi-app-repo"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "${terraform.workspace} FastAPI App"
  }
}