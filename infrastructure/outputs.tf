output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.cluster_id
}

output "ecs_agent_service" {
  description = "The names of the ECS services"
  value = {
    agent = module.agent.service_name
  }
}

output "agent_ecr_repository_url" {
  description = "The URL of the ECR repository for the agent"
  value       = module.pre_deploy.agent_ecr_repository_url
}

output "web_ecr_repository_url" {
  description = "The URL of the ECR repository for the web"
  value       = module.pre_deploy.web_ecr_repository_url
}
