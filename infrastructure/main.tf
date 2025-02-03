module "ecs" {
  source       = "./modules/ecs"
  cluster_name = local.app_name
  environment  = var.environment
  tags         = locals.tags
}

module "vpc" {
  source             = "./modules/vpc"
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  environment        = var.environment
  tags               = locals.tags
}

module "pre_deploy" {
  source = "./modules/pre-deploy"
}

module "agent" {
  source             = "./modules/agent"
  app_name           = "${local.app_name}-agent"
  environment        = var.environment
  subnet_ids         = module.vpc.public_subnet_ids
  ecs_cluster_id     = module.ecs.cluster_id
  container_image    = var.agent_container_image
  container_port     = 8080
  cpu                = 256
  memory             = 512
  aws_region         = var.aws_region
  tags               = locals.tags
  execution_role_arn = var.ecs_execution_role_arn
  security_group_ids = [module.vpc.ecs_service_security_group_id]
}