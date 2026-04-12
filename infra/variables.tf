variable "subscription_id" {
  type        = string
  description = "Azure subscription ID"
}

variable "project_name" {
  type        = string
  default     = "graewe-website"
  description = "Project name used in resource naming"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "Environment (prod, staging)"
  validation {
    condition     = contains(["prod", "staging"], var.environment)
    error_message = "Environment must be 'prod' or 'staging'."
  }
}

variable "location" {
  type        = string
  default     = "westeurope"
  description = "Azure region — westeurope is closest to Neuenburg am Rhein"
}

variable "swa_sku_tier" {
  type        = string
  default     = "Standard"
  description = "Static Web App SKU tier (Free or Standard)"
}

variable "swa_sku_size" {
  type        = string
  default     = "Standard"
  description = "Static Web App SKU size"
}

variable "custom_domain" {
  type        = string
  default     = ""
  description = "Custom domain for the site (e.g. www.graewe.com). Leave empty to skip."
}

variable "apex_domain" {
  type        = string
  default     = ""
  description = "Apex domain (e.g. graewe.com). Leave empty to skip."
}
