resource "aws_db_instance" "postgres_instance" {
  engine               = "postgres"
  engine_version       = "16.2"
  instance_class       = "db.t3.micro"
  identifier           = "my-postgres-instance"
  allocated_storage    = 20
  max_allocated_storage = 100
  db_subnet_group_name = var.db_subnet_group_name
  vpc_security_group_ids = var.db_security_group_ids
  username             = var.database_username
  password             = var.database_password
  skip_final_snapshot  = true
}