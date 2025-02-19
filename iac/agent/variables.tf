variable "prefix" {
  description = "Resource name prefix"
  type        = string
}

variable "env" {
  description = "Environment name"
  type        = string
}

variable "openai_api_key" {
  description = "OpenAI API Key"
  type        = string
  sensitive   = true
}

variable "socket_secret" {
  description = "WebSocket authentication secret"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "PostgreSQL connection string"
  type        = string
  sensitive   = true
}