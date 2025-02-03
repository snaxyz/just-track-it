output "service_name" {
  description = "The ECS service name"
  value       = aws_ecs_service.agent.name
}

output "service_arn" {
  description = "The ARN of the ECS service"
  value       = aws_ecs_service.agent.arn
}

output "task_definition_arn" {
  description = "The ARN of the dummy task definition"
  value       = aws_ecs_task_definition.dummy.arn
}

output "execution_role_arn" {
  description = "The ARN of the IAM role for ECS task execution"
  value       = aws_iam_role.execution_role.arn
}