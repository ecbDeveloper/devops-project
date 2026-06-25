output "gateway_public_ip" {
  value = module.compute.public_ip
}

output "database_host" {
  value = module.database.server_fqdn
}
