run_awslocal_command() {
  awslocal $@ > /dev/null 2>&1
}

function create_dynamo_table {
  local config_file=$1
  local table_name=$(jq -r '.table_name' $config_file)
  local attribute_definitions=$(jq -c '.attribute_definitions' $config_file)
  local key_schema=$(jq -c '.key_schema' $config_file)
  local local_secondary_indexes=$(jq -c '.local_secondary_indexes' $config_file)

  echo Creating table $table_name
  echo Attribute definitions: $attribute_definitions
  echo Key schema: $key_schema
  echo LSIs: $local_secondary_indexes

  run_awslocal_command dynamodb describe-table --region us-west-2 --table-name $table_name
  if [ 0 -eq $? ]; then
    echo Table $table_name already created.
  else
    table_output=$(awslocal dynamodb create-table \
      --region us-west-2 \
      --table-name $table_name \
      --attribute-definitions $attribute_definitions \
      --key-schema $key_schema \
      --local-secondary-indexes $local_secondary_indexes \
      --billing-mode PAY_PER_REQUEST)
    table_arn=$(echo $table_output | jq -r '.TableDescription.TableArn')

    sleep 5

    echo $table_arn
  fi
}

function create_lambda {
  local function_name=$1
  local handler=$2
  local s3_key=$3
  local runtime=$4
  local lambda_env=$5

  run_awslocal_command lambda get-function --region us-west-2 --function-name $function_name
  if [ 0 -eq $? ]; then
    lambda_arn=$(awslocal lambda get-function --region us-west-2 --function-name $function_name | jq -r '.Configuration.FunctionArn')

    # update lambda environment parameters (eg. for aws access key changes)
    update_output=$(awslocal lambda update-function-configuration --region us-west-2 --function-name $function_name --environment $lambda_env --timeout 900)

    # invoke the lambda to trigger creating a cloudwatch group
    awslocal lambda invoke --function-name $function_name --region us-west-2 --cli-binary-format raw-in-base64-out --payload '{"action": "test"}' \ output.log

    echo $lambda_arn
  else
    lambda_output=$(awslocal lambda create-function \
      --region us-west-2 \
      --function-name $function_name \
      --runtime $runtime \
      --role arn:aws:iam::000000000000:role/$function_name \
      --handler $handler \
      --code S3Bucket="hot-reload",S3Key=$s3_key \
      --environment $lambda_env \
      --timeout 900)
    lambda_arn=$(echo $lambda_output | jq -r '.FunctionArn')

    sleep 15

    # invoke the lambda to trigger creating a cloudwatch group
    awslocal lambda invoke --function-name $function_name --region us-west-2 --cli-binary-format raw-in-base64-out --payload '{"action": "test"}' \ output.log

    echo $lambda_arn
  fi
}

function create_bucket {
  local bucket_name=$1
  run_awslocal_command s3api create-bucket --bucket $bucket_name --region us-east-1
}

function create_sqs {
  local queue_name=$1
  local attributes=$2

  echo Creating SQS Queue $queue_name

  run_awslocal_command sqs get-queue-url --queue-name $queue_name --region us-west-2
  if [ 0 -eq $? ]; then
    queue_url=$(awslocal sqs get-queue-url --queue-name $queue_name --region us-west-2 | jq -r '.QueueUrl')
    echo Queue $queue_name already exists: $queue_url
  else
    queue_url=$(awslocal sqs create-queue --queue-name $queue_name --attributes "$attributes" --region us-west-2 | jq -r '.QueueUrl')
    echo Queue created: $queue_url
  fi

  echo $queue_url
}

function create_sqs_lambda_trigger {
  local function_name=$1
  local queue_url=$2

  echo Setting up SQS trigger for Lambda function $function_name with SQS Queue $queue_url

  # Get Lambda function ARN
  lambda_arn=$(awslocal lambda get-function --region us-west-2 --function-name $function_name | jq -r '.Configuration.FunctionArn')

  # Get SQS queue ARN
  queue_arn=$(awslocal sqs get-queue-attributes --queue-url $queue_url --attribute-names QueueArn --region us-west-2 | jq -r '.Attributes.QueueArn')

  # Create event source mapping
  existing_mappings=$(awslocal lambda list-event-source-mappings \
    --function-name $function_name \
    --event-source-arn $queue_arn \
    --region us-west-2 | jq '.EventSourceMappings | length')

  if [ "$existing_mappings" -gt 0 ]; then
    echo "SQS trigger already exists for Lambda $function_name and Queue $queue_url"
  else
    awslocal lambda create-event-source-mapping \
      --region us-west-2 \
      --function-name $function_name \
      --event-source-arn $queue_arn \
      --batch-size 1 \
      --enabled

    echo "SQS trigger created for Lambda $function_name"
  fi
}

function purge_sqs_queue {
  local queue_name=$1

  echo Purging SQS Queue $queue_name

  # Get the Queue URL
  queue_url=$(awslocal sqs get-queue-url --queue-name $queue_name --region us-west-2 | jq -r '.QueueUrl')
  if [ $? -eq 0 ]; then
    # Purge the Queue
    awslocal sqs purge-queue --queue-url $queue_url --region us-west-2
    if [ $? -eq 0 ]; then
      echo "Queue $queue_name purged successfully."
    else
      echo "Failed to purge Queue $queue_name."
    fi
  else
    echo "Queue $queue_name does not exist or could not retrieve the URL."
  fi
}
