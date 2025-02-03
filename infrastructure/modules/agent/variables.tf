variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "environment" {
  description = "The environment (e.g., dev, staging, prod)"
  type        = string
}

variable "ecs_cluster_id" {
  description = "The ID of the ECS cluster"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs to deploy ECS tasks"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for the ECS service"
  type        = list(string)
}

variable "assign_public_ip" {
  description = "Indicates whether to assign a public IP to the ECS task"
  type        = bool
  default     = false
}

variable "container_port" {
  description = "The port on which the container listens"
  type        = number
}

variable "cpu" {
  description = "CPU units allocated to the task"
  type        = number
}

variable "memory" {
  description = "Memory (in MiB) allocated to the task"
  type        = number
}

variable "desired_count" {
  description = "Number of desired ECS tasks"
  type        = number
  default     = 1
}

variable "execution_role_arn" {
  description = "The ARN of the IAM role for ECS task execution"
  type        = string
}

variable "container_image" {
  description = "The agent container image to use for the task definition"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the resources"
  type        = map(string)
  default     = {}
}

variable "aws_region" {
  description = "The AWS region"
  type        = string
}