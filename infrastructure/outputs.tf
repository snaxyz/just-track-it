output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.web.alb_dns_name
}

output "web_service_url" {
  description = "The URL of the web service"
  value       = "https://${module.web.alb_dns_name}"
}

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