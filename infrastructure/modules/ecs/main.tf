resource "aws_ecs_cluster" "main" {
  name = var.cluster_name

  tags = {
    Environment = var.environment
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight           = 1
  }
}

# EC2 Launch Template
resource "aws_launch_template" "ecs" {
  name_prefix   = "ecs-template"
  image_id      = "ami-0c7217cdde317cfec"  # Amazon ECS-optimized AMI
  instance_type = "t4g.micro"  # Cheapest ARM-based instance

  network_interfaces {
    associate_public_ip_address = true
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              echo ECS_CLUSTER=${var.cluster_name} >> /etc/ecs/ecs.config
              EOF
  )

  tags = {
    Environment = var.environment
  }
}