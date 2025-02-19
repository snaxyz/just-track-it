locals {
  env_vars = { for line in compact(split("\n", file("../.env"))) :
    split("=", line)[0] => split("=", line)[1] if length(split("=", line)) == 2
  }
}