resource "aws_ecs_service" "fastapi_service" {
  name            = "fastapi-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = var.aws_lb_target_group_fastapi_tg_arn
    container_name   = "fastapi-container"
    container_port   = 80
  }
  
  network_configuration {
    assign_public_ip = true
    subnets          = [var.lambda_subnet_id, var.rds_subnet_id]
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
  }

  launch_type = "FARGATE"
}
