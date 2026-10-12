# ==============================================================================
# GoDevOps Terraform - Elastic Container Registry (ECR)
# ==============================================================================

# 1. Backend Container Image Repository
resource "aws_ecr_repository" "backend" {
  name                 = "godevops-backend"
  image_tag_mutability = "MUTABLE"

  # DevSecOps: Automated CVE scan on every docker push
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "godevops-backend"
  }
}

# 2. Frontend Container Image Repository
resource "aws_ecr_repository" "frontend" {
  name                 = "godevops-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "godevops-frontend"
  }
}

# 3. Lifecycle Policy: Retain last 30 images to prevent cloud storage bloat
resource "aws_ecr_lifecycle_policy" "backend_policy" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 30 versioned images"
      selection = {
        tagStatus   = "any"
        countType   = "sinceImagePushed"
        countUnit   = "days"
        countNumber = 30
      }
      action = {
        type = "expire"
      }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "frontend_policy" {
  repository = aws_ecr_repository.frontend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 30 versioned images"
      selection = {
        tagStatus   = "any"
        countType   = "sinceImagePushed"
        countUnit   = "days"
        countNumber = 30
      }
      action = {
        type = "expire"
      }
    }]
  })
}
