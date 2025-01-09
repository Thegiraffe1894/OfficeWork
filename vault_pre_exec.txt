#!/bin/bash

# Input: Encrypted token and namespace passed as EXTRA_VARs
ENCRYPTED_TOKEN=$1
VAULT_NAMESPACE=$2

# Temporary file for private key (ensure it exists and is secure)
PRIVATE_KEY_FILE="/path/to/private_key.pem"

# Validate inputs
if [ -z "$ENCRYPTED_TOKEN" ]; then
    echo "Error: Encrypted token not provided."
    exit 1
fi

if [ -z "$VAULT_NAMESPACE" ]; then
    echo "Error: Vault namespace not provided."
    exit 1
fi

if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo "Error: Private key file not found at $PRIVATE_KEY_FILE."
    exit 1
fi

# Decrypt the token using OpenSSL
DECRYPTED_TOKEN=$(echo "$ENCRYPTED_TOKEN" | openssl base64 -d | openssl rsautl -decrypt -inkey "$PRIVATE_KEY_FILE" 2>/dev/null)

# Check if decryption was successful
if [ $? -ne 0 ] || [ -z "$DECRYPTED_TOKEN" ]; then
    echo "Error: Token decryption failed."
    exit 1
fi

echo "Token successfully decrypted."

# Export the decrypted token for further use
export VAULT_TOKEN=$DECRYPTED_TOKEN

# Vault connection details
VAULT_URL="https://vault.example.com" #https://vault-new.aws.mobius.nat.bt.com
SECRET_PATH="secret/my_key"

# Fetch secrets from Vault using the decrypted token and namespace
SECRETS=$(curl -s \
    --header "X-Vault-Token: $VAULT_TOKEN" \
    --header "X-Vault-Namespace: $VAULT_NAMESPACE" \
    "$VAULT_URL/v1/$SECRET_PATH")

# Check if the secret fetch was successful
if [ $? -ne 0 ] || [ -z "$SECRETS" ]; then
    echo "Error: Failed to fetch secrets from Vault."
    exit 1
fi

echo "Secrets successfully fetched from Vault."

# Extract specific values from the Vault response (adjust jq as needed)
USERNAME=$(echo "$SECRETS" | jq -r '.data.username')
PASSWORD=$(echo "$SECRETS" | jq -r '.data.password')

# Store secrets in environment variables for the playbook
export VAULT_USERNAME=$USERNAME
export VAULT_PASSWORD=$PASSWORD

# Optionally write the secrets to a temporary file for use in the playbook
echo "username=$USERNAME" > /tmp/vault_creds
echo "password=$PASSWORD" >> /tmp/vault_creds
chmod 600 /tmp/vault_creds
