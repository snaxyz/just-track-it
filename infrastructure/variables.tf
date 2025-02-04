variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  default     = "just-track-it"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b"]
}

variable "web_container_image" {
  description = "Web app container image"
  default     = "339972433915.dkr.ecr.us-west-2.amazonaws.com/web"
}

variable "agent_container_image" {
  description = "Agent service container image"
  default     = "339972433915.dkr.ecr.us-west-2.amazonaws.com/agent"
}

variable "ecs_execution_role_arn" {
  description = "Common ECS execution role"
  default     = "arn:aws:iam::339972433915:role/SnaLabs-Common-Github-Execution-Role"
}