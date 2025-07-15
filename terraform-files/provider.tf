terraform {
  required_version = ">= 1.0"
  backend "s3" {
    bucket = "my-terraform-state-bucket"
    key    = "drone-telemetry/infrastructure.tfstate"
    region = "ap-south-1"
  }
}

provider "aws" {
  region = var.aws_region
}
