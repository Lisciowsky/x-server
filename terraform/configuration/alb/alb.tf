resource "aws_lb" "my_alb" {
  name               = "my-fastapi-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.aws_security_group_alb_sg_id]
  subnets            = [var.lambda_subnet_id, var.rds_subnet_id]
}

resource "aws_lb_target_group" "fastapi_tg" {
  name     = "fastapi-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id  # Assuming you have a VPC ID variable defined
  target_type = "ip" # Ensure this is set to 'ip'

  health_check {
    enabled             = true
    path                = "/healthcheck"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.my_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fastapi_tg.arn
  }
}
