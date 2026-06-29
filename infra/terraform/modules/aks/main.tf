resource "azurerm_kubernetes_cluster" "k8s" {
  name                = "k8sCEFET"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "akscefet"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = var.vm_size
  }

  identity {
    type = "SystemAssigned"
  }

  web_app_routing {
    dns_zone_ids = []
  }

  tags = {
    Environment = "Production"
  }
}

resource "local_file" "kube_config" {
  content  = azurerm_kubernetes_cluster.k8s.kube_config_raw
  filename = "${path.module}/azurek8s.yaml"
}
