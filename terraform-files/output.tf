output "ec2_public_ip" {
  value = aws_instance.telemetry_vm.public_ip
}

output "ecr_repo_url" {
  value = aws_ecr_repository.telemetry.repository_url
}
