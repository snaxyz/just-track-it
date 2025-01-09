#!/bin/bash

ABSOLUTE_PATH=$(pwd)

source $ABSOLUTE_PATH/apps/web/.env.local
source $ABSOLUTE_PATH/scripts/aws-utils.sh

SQS_AGENT_QUEUE_NAME="orchid-agent-queue"
SQS_EMBEDDING_QUEUE_NAME="orchid-embedding-queue"
SQS_EVENT_QUEUE_NAME="orchid-event-queue"

purge_all_queues() {
  echo "Starting to purge queues..."

  purge_sqs_queue $SQS_AGENT_QUEUE_NAME
  purge_sqs_queue $SQS_EMBEDDING_QUEUE_NAME
  purge_sqs_queue $SQS_EVENT_QUEUE_NAME

  echo "Finished purging all queues."
}

# Execute the function
purge_all_queues