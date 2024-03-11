resource "aws_db_subnet_group" "main" {
  name       = "${terraform.workspace}_db_subnet_group"
  subnet_ids = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]

  tags = {
    Name = "My DB Subnet Group"
  }
}