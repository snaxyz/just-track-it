output "agent_ecr_repository_url" {
  description = "The URL of the ECR repository for the agent"
  value       = aws_ecr_repository.agent.repository_url
}

output "web_ecr_repository_url" {
  description = "The URL of the ECR repository for the web"
  value       = aws_ecr_repository.web.repository_url
}
