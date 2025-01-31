resource "aws_iam_role" "execution_role" {
  name = "${var.app_name}-${var.environment}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "execution_role_policy" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "agent" {
  name            = "${var.app_name}-${var.environment}"
  cluster         = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.dummy.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [aws_security_group.agent.id]
  }
}

resource "aws_security_group" "agent" {
  name        = "${var.app_name}-${var.environment}"
  description = "Security group for agent service"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_apigatewayv2_api" "agent_api" {
  name          = "${var.app_name}-${var.environment}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.agent_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "agent_integration" {
  api_id           = aws_apigatewayv2_api.agent_api.id
  integration_type = "HTTP_PROXY"
  integration_uri  = aws_lb_listener.agent.arn
  integration_method = "ANY"
  connection_type  = "VPC_LINK"
  connection_id    = aws_apigatewayv2_vpc_link.agent_vpc_link.id
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "agent_route" {
  api_id    = aws_apigatewayv2_api.agent_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.agent_integration.id}"
}

resource "aws_apigatewayv2_vpc_link" "agent_vpc_link" {
  name = "${var.app_name}-${var.environment}-vpc-link"

  subnet_ids = var.subnet_ids
  security_group_ids = [aws_security_group.agent.id]
}

resource "aws_lb" "agent" {
  name               = "${var.app_name}-${var.environment}-nlb"
  internal           = false
  load_balancer_type = "network"
  security_groups    = [aws_security_group.agent.id]
  subnets            = var.subnet_ids
}

resource "aws_lb_target_group" "agent" {
  name     = "${var.app_name}-${var.environment}-tg"
  port     = var.container_port
  protocol = "TCP"
  vpc_id   = var.vpc_id

  health_check {
    protocol = "TCP"
  }
}

resource "aws_lb_listener" "agent" {
  load_balancer_arn = aws_lb.agent.arn
  port              = var.container_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.agent.arn
  }
}

resource "aws_ecs_task_definition" "dummy" {
  family                   = "${var.app_name}-${var.environment}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "dummy-container"
      image     = "amazonlinux:2"  # Use a lightweight image
      essential = true
      command   = ["sleep", "3600"]  # Sleep for an hour
      portMappings = [
        {
          containerPort = var.container_port
          protocol      = "tcp"
        }
      ]
    }
  ])
}