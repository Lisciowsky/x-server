output "lambda_execution_role_arn" {
  value = aws_iam_role.lambda_execution_role.arn
}

output "ecs_tasks_execution_role" {
  value = aws_iam_role.ecs_tasks_execution_role.arn
}
output "ecs_tasks_role" {
  value = aws_iam_role.ecs_tasks_role.arn
}
output "ecs_task_policy_attachment" {
  value = aws_iam_role.ecs_tasks_execution_role.arn
}