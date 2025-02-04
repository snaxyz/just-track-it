output "service_name" {
  description = "The ECS service name"
  value       = aws_ecs_service.agent.name
}

output "service_arn" {
  description = "The ARN of the ECS service"
  value       = aws_ecs_service.agent.id
}

output "task_definition_arn" {
  description = "The ARN of the ECS task definition"
  value       = aws_ecs_task_definition.agent.arn
}
