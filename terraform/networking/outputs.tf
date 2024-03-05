output "vpc_id" {
  value = aws_vpc.main.id
}

output "lambda_subnet_id" {
  value = aws_subnet.lambda_subnet.id
}

output "rds_subnet_id" {
  value = aws_subnet.rds_subnet.id
}

output "db_subnet_group_name" {
  value = aws_db_subnet_group.main.name
}
