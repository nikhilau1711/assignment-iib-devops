variable "aws_region" {
  default = "ap-south-1"
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "instance_type" {
  default = "m6a.4xlarge" # 16 vCPU, 32 GB RAM
}

variable "public_key_path" {
  type = string
}

