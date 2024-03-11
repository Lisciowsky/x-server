resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${terraform.workspace}-internet-gateway"
  }
}
