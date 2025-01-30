output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_services" {
  description = "The names of the ECS services"
  value = {
    web   = module.web.service_name
    agent = module.agent.service_name
  }
}

output "agent_api_gateway_url" {
  description = "The URL of the API Gateway for the agent service"
  value       = module.agent.api_gateway_url
}