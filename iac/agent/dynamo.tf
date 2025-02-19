# DynamoDB table for WebSocket connections
resource "aws_dynamodb_table" "connections" {
  name         = "${local.name}-connections"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
}