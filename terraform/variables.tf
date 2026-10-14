# ==============================================================================
# GoDevOps Terraform - Input Variables
# ==============================================================================

variable "aws_region" {
  description = "Target AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the GoDevOps Virtual Private Cloud"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for multi-AZ high availability"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (Internet-facing ALBs/Ingress)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (EKS Worker Nodes & Database)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "cluster_name" {
  description = "Name of the AWS Elastic Kubernetes Service (EKS) cluster"
  type        = string
  default     = "godevops-cluster"
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS worker nodes (Free Tier eligible)"
  type        = list(string)
  default     = ["t3.micro"]
}

variable "desired_nodes" {
  description = "Initial desired worker nodes count (2 x t3.micro for free tier capacity)"
  type        = number
  default     = 2
}

variable "min_nodes" {
  description = "Minimum worker nodes count for autoscaling"
  type        = number
  default     = 1
}

variable "max_nodes" {
  description = "Maximum worker nodes count for autoscaling"
  type        = number
  default     = 2
}
