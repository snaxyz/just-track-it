locals {
  region   = "us-west-2"
  app_name = "just-track-it"

  tags = {
    App = local.app_name
  }
}