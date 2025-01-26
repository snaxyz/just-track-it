terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Network Configuration
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  environment        = var.environment
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"

  cluster_name = "${var.project_name}-${var.environment}"
  environment  = var.environment
}

# Web App (NextJS)
module "web" {
  source = "./modules/web"

  app_name          = "web"
  environment       = var.environment
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.private_subnet_ids
  ecs_cluster_id   = module.ecs.cluster_id
  ecs_cluster_name = module.ecs.cluster_name
  container_image  = var.web_container_image
  container_port   = 3000
  cpu             = 256
  memory          = 512
}

# Agent Service (NestJS)
module "agent" {
  source = "./modules/agent"

  app_name          = "agent"
  environment       = var.environment
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.private_subnet_ids
  ecs_cluster_id   = module.ecs.cluster_id
  ecs_cluster_name = module.ecs.cluster_name
  container_image  = var.agent_container_image
  container_port   = 8080
  cpu             = 256
  memory          = 512
}