output "service_name" {
  value = aws_ecs_service.agent.name
}

output "api_gateway_url" {
  description = "The URL of the API Gateway for the agent service"
  value       = aws_apigatewayv2_api.agent_api.api_endpoint
}