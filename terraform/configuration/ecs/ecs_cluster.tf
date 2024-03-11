resource "aws_ecs_cluster" "my_cluster" {
  name = "${terraform.workspace}-ecs-cluster"
}
