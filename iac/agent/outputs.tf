output "websocket_url" {
  description = "WebSocket API URL"
  value       = aws_apigatewayv2_stage.websocket.invoke_url
}

output "websocket_endpoint" {
  description = "WebSocket API Endpoint for Lambda"
  value       = "${aws_apigatewayv2_api.websocket.api_endpoint}/${var.env}"
}

output "sqs_queue_url" {
  description = "SQS queue URL"
  value       = aws_sqs_queue.agent.url
}