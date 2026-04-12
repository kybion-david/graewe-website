output "static_web_app_url" {
  value       = azurerm_static_web_app.website.default_host_name
  description = "Default hostname of the Static Web App"
}

output "static_web_app_id" {
  value       = azurerm_static_web_app.website.id
  description = "Resource ID of the Static Web App"
}

output "deployment_token" {
  value       = azurerm_static_web_app.website.api_key
  sensitive   = true
  description = "API key for deploying to the Static Web App (add as AZURE_STATIC_WEB_APPS_API_TOKEN in GitHub secrets)"
}
