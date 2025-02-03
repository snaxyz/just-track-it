resource "aws_ecr_repository" "agent" {
  name = "just-track-it-agent"
}

resource "aws_ecr_repository" "web" {
  name = "just-track-it-web"
}