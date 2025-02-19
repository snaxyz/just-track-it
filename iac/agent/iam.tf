# Lambda execution role
resource "aws_iam_role" "lambda_role" {
  name = "${local.name}-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Lambda basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  count      = var.enable_logging ? 1 : 0
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# SQS policy
resource "aws_iam_role_policy_attachment" "lambda_sqs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

# DynamoDB policy
resource "aws_iam_role_policy" "dynamodb" {
  name = "${local.name}-dynamodb"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.connections.arn
        ]
      }
    ]
  })
}

# API Gateway management policy
resource "aws_iam_role_policy" "apigateway" {
  name = "${local.name}-apigateway"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "execute-api:ManageConnections",
          "execute-api:Invoke"
        ]
        Resource = [
          "${aws_apigatewayv2_api.websocket.execution_arn}/${var.env}",
          "${aws_apigatewayv2_api.websocket.execution_arn}/${var.env}/*",
          "${aws_apigatewayv2_api.websocket.execution_arn}/${var.env}/$connect",
          "${aws_apigatewayv2_api.websocket.execution_arn}/${var.env}/$disconnect",
          "${aws_apigatewayv2_api.websocket.execution_arn}/${var.env}/$default",
          "${aws_apigatewayv2_api.websocket.execution_arn}/${var.env}/POST/$connections/*",
        ]
      }
    ]
  })
}

# API Gateway logging role
resource "aws_iam_role" "apigateway_cloudwatch" {
  name = "${local.name}-apigateway-logs"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "apigateway_cloudwatch" {
  count = var.enable_logging ? 1 : 0
  name  = "${local.name}-apigateway-logs"
  role  = aws_iam_role.apigateway_cloudwatch.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.websocket[0].arn}:*"
      }
    ]
  })
}