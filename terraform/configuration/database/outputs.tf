output "db_instance_address" {
  value = aws_db_instance.postgres_instance.address
}

output "db_instance_username" {
  value = aws_db_instance.postgres_instance.username
}

output "db_instance_password" {
  value = aws_db_instance.postgres_instance.password
}

output "postgres_proxy_endpoint" {
  value = aws_db_proxy.postgres_proxy.endpoint
}