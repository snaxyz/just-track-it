# API Gateway v2 WebSocket API
resource "aws_apigatewayv2_api" "websocket" {
  name                       = local.name
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "websocket" {
  name              = "/aws/apigateway/${local.name}"
  retention_in_days = 14
}

# WebSocket stage with logging
resource "aws_apigatewayv2_stage" "websocket" {
  api_id = aws_apigatewayv2_api.websocket.id
  name   = var.env

  default_route_settings {
    detailed_metrics_enabled = true
    logging_level            = "INFO"
    data_trace_enabled       = true
    throttling_burst_limit   = 100
    throttling_rate_limit    = 50
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.websocket.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      ip               = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      routeKey         = "$context.routeKey"
      status           = "$context.status"
      connectionId     = "$context.connectionId"
      errorMessage     = "$context.error.message"
      integrationError = "$context.integration.error"
    })
  }
}

# WebSocket routes
resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Connect route response
resource "aws_apigatewayv2_route_response" "connect" {
  api_id             = aws_apigatewayv2_api.websocket.id
  route_id           = aws_apigatewayv2_route.connect.id
  route_response_key = "$default"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "sendmessage" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "sendmessage"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Lambda integration
resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.websocket.id
  integration_type = "AWS_PROXY"

  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.agent.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.agent.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket.execution_arn}/*/*"
}