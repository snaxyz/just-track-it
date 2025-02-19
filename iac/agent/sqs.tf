# SQS Queue
resource "aws_sqs_queue" "agent" {
  name                       = local.name
  message_retention_seconds  = 1209600 # 14 days
  visibility_timeout_seconds = 30

  # No retries - messages go straight to DLQ
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.agent_dlq.arn
    maxReceiveCount     = 1
  })
}

# Dead Letter Queue
resource "aws_sqs_queue" "agent_dlq" {
  name                       = "${local.name}-dlq"
  message_retention_seconds  = 1209600 # 14 days
  visibility_timeout_seconds = 30
}

# Lambda trigger
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.agent.arn
  function_name    = aws_lambda_function.agent.arn
  batch_size       = 1

  # Immediately send to DLQ on failure
  maximum_retry_attempts = 0
}