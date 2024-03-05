resource "aws_db_subnet_group" "main" {
  name       = "my_db_subnet_group"
  subnet_ids = [aws_subnet.lambda_subnet.id, aws_subnet.rds_subnet.id]

  tags = {
    Name = "My DB Subnet Group"
  }
}