#!/usr/bin/env bash
set -euo pipefail

# Creates the Azure resources needed to store Terraform state remotely.
# Run this once before your first `terraform init`.
#
# Prerequisites: az CLI logged in (`az login`)
#
# Usage:  ./bootstrap.sh <subscription-id>

SUBSCRIPTION_ID="${1:?Usage: ./bootstrap.sh <subscription-id>}"
RG_NAME="rg-terraform-state"
STORAGE_ACCOUNT="stgraewetfstate"
CONTAINER="tfstate"
LOCATION="westeurope"

az account set --subscription "$SUBSCRIPTION_ID"

echo "Creating resource group $RG_NAME..."
az group create --name "$RG_NAME" --location "$LOCATION" --output none

echo "Creating storage account $STORAGE_ACCOUNT..."
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RG_NAME" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --output none

echo "Creating blob container $CONTAINER..."
az storage container create \
  --name "$CONTAINER" \
  --account-name "$STORAGE_ACCOUNT" \
  --auth-mode login \
  --output none

echo ""
echo "Terraform backend is ready."
echo "Run: cd infra && terraform init"
