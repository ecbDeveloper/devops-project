resource "random_string" "db_suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_mariadb_server" "db" {
  name                = "mariadb-server-cefet-${random_string.db_suffix.result}"
  location            = var.location
  resource_group_name = var.resource_group_name

  sku_name = "B_Gen5_1"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          = "wegiauser"
  administrator_login_password = "SecretPassword123!"
  version                      = "10.3"
  ssl_enforcement_enabled      = false
}

resource "azurerm_mariadb_database" "db" {
  name                = "wegia"
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mariadb_server.db.name
  charset             = "utf8"
  collation           = "utf8_general_ci"
}
