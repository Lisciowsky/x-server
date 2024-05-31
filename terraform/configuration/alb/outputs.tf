output "aws_lb_target_group_fastapi_tg_arn" {
  value = aws_lb_target_group.fastapi_tg.arn
}

output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = aws_lb.my_alb.dns_name
}
output "alb_arn" {
  value = aws_lb.my_alb.arn
}

output "alb_zone_id" {
  value = aws_lb.my_alb.zone_id
}