resource "aws_ecr_lifecycle_policy" "my_ecr_repo_policy" {
  repository = aws_ecr_repository.my_ecr_repo.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description = "Expire untagged images",
        selection = {
          tagStatus = "untagged",
          countType = "imageCountMoreThan",
          countNumber = 1
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}