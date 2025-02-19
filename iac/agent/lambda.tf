# Lambda function
resource "aws_lambda_function" "agent" {
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  function_name    = local.name
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      ENVIRONMENT                   = var.env
      OPENAI_API_KEY                = var.openai_api_key
      SOCKET_SECRET                 = var.socket_secret
      DYNAMO_CONNECTIONS_TABLE_NAME = aws_dynamodb_table.connections.name
      DATABASE_URL                  = var.database_url
      APIGW_ENDPOINT                = "${replace(aws_apigatewayv2_api.websocket.api_endpoint, "wss://", "https://")}/${var.env}"
    }
  }
}

# Lambda source code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../apps/agent/dist"
  output_path = "${path.module}/files/lambda.zip"
}

