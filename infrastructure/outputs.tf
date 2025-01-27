output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "web_service_url" {
  description = "URL of the web application"
  value       = "https://${aws_lb.main.dns_name}"
}

output "ecr_repository_urls" {
  description = "URLs of the ECR repositories"
  value = {
    web   = aws_ecr_repository.web.repository_url
    agent = aws_ecr_repository.agent.repository_url
  }
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_services" {
  description = "Names of the ECS services"
  value = {
    web   = aws_ecs_service.web.name
    agent = aws_ecs_service.agent.name
  }
}