# ==============================================================================
# GoDevOps Terraform - Main Provider Configuration
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Production S3 Backend with DynamoDB State Locking
  backend "s3" {
    bucket         = "godevops-tf-state-479537131188"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "godevops-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "GoDevOps"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
