resource "aws_ecs_service" "fastapi_service" {
  name            = "${terraform.workspace}-fastapi-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = var.aws_lb_target_group_fastapi_tg_arn
    container_name   = "${terraform.workspace}-fastapi-container"
    container_port   = 8080
  }
  
  network_configuration {
    assign_public_ip = true
    subnets          = [var.subnet_a_id, var.subnet_b_id]
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
  }

  launch_type = "FARGATE"
}

