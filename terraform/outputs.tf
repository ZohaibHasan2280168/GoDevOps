# ==============================================================================
# GoDevOps Terraform - Outputs
# ==============================================================================

output "vpc_id" {
  description = "The ID of the provisioned VPC"
  value       = aws_vpc.main.id
}

output "public_subnets" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnets" {
  description = "List of private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "eks_cluster_name" {
  description = "The name of the EKS cluster"
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  description = "The Kubernetes API server endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "ecr_backend_repository_url" {
  description = "URL of the backend ECR Docker repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_repository_url" {
  description = "URL of the frontend ECR Docker repository"
  value       = aws_ecr_repository.frontend.repository_url
}
