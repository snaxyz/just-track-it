output "websocket_url" {
  description = "WebSocket API URL"
  value       = module.agent.websocket_url
}

output "sqs_queue_url" {
  description = "SQS queue URL"
  value       = module.agent.sqs_queue_url
}
