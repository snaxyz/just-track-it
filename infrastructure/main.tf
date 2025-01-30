terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "snalabs-cicd"
    key    = "just-track-it.tfstate"
    region = "us-west-2"
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

# Agent Service (NestJS)
module "agent" {
  source = "./modules/agent"

  app_name        = "agent"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.public_subnet_ids
  ecs_cluster_id  = module.ecs.cluster_id
  container_image = var.agent_container_image
  container_port  = 8080
  cpu             = 256
  memory          = 512
}