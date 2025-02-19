terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "snalabs-cicd"
    key     = "just-track-it.tfstate"
    region  = "us-west-2"
    encrypt = true
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = "just-track-it"
      Environment = var.env
      ManagedBy   = "terraform"
    }
  }
}
