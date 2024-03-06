resource "aws_ecs_task_definition" "my_task" {
  family                   = "my-task-family"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_tasks_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "my-container",
      image     = "${var.ecr_repository_url}:latest",
      cpu       = 256,
      memory    = 512,
      essential = true,
      portMappings = [{
        containerPort = 80,
        hostPort      = 80
      }],
      environment = [
        {
          name  = "DATABASE_URL",
          value = "postgresql+asyncpg://${var.database_username}:${var.database_password}@${var.db_instance_address}/${var.database_name}"
        },
        # Additional environment variables here
      ]
    }
  ])
}
