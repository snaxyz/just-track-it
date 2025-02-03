output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.cluster_id
}

output "ecs_services" {
  description = "The names of the ECS services"
  value = {
    agent = module.agent.service_name
  }
}
