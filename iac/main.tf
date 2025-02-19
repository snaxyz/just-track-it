locals {
  prefix = "just-track-it-${var.env}"
}

# Resources will use local.prefix for naming

module "agent" {
  source = "./agent"

  prefix         = local.prefix
  env            = var.env
  openai_api_key = data.external.env.result["OPENAI_API_KEY"]
  socket_secret  = data.external.env.result["SOCKET_SECRET"]
  database_url   = data.external.env.result["DATABASE_URL"]
}
