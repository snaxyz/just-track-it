output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "service_name" {
  value = aws_ecs_service.web.name
}