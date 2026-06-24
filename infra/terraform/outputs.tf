output "gateway_public_ip" {
  value = azurerm_public_ip.pIP.ip_address
}
