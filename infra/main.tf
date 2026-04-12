terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~> 2.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "stgraewetfstate"
    container_name       = "tfstate"
    key                  = "graewe-website.tfstate"
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

provider "azapi" {}

# ──────────────────────────────────────────────────
# Resource Group
# ──────────────────────────────────────────────────

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
  tags     = local.tags
}

# ──────────────────────────────────────────────────
# Azure Static Web App
# ──────────────────────────────────────────────────

resource "azurerm_static_web_app" "website" {
  name                = "swa-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  sku_tier            = var.swa_sku_tier
  sku_size            = var.swa_sku_size
  tags                = local.tags
}

# ──────────────────────────────────────────────────
# Custom Domain
# ──────────────────────────────────────────────────

resource "azurerm_static_web_app_custom_domain" "www" {
  count             = var.custom_domain != "" ? 1 : 0
  static_web_app_id = azurerm_static_web_app.website.id
  domain_name       = var.custom_domain
  validation_type   = "cname-delegation"
}

resource "azurerm_static_web_app_custom_domain" "apex" {
  count             = var.apex_domain != "" ? 1 : 0
  static_web_app_id = azurerm_static_web_app.website.id
  domain_name       = var.apex_domain
  validation_type   = "dns-txt-token"
}
