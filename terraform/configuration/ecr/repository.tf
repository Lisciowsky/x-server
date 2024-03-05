resource "aws_ecr_repository" "my_ecr_repo" {
  name                 = "my-fastapi-app-repo"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "My FastAPI App"
  }
}