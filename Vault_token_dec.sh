#!/bin/bash

# Input: Encrypted token and namespace passed as EXTRA_VARs
ENCRYPTED_TOKEN=$1
VAULT_NAMESPACE=$2
PRIVATE_KEY=$3

# Define a temporary file for the private key
TEMP_KEY_FILE=$(mktemp)

# Ensure the temporary file is removed on script exit
trap "rm -f $TEMP_KEY_FILE" EXIT

# Write the private key to a temporary file
echo "$PRIVATE_KEY" > "$TEMP_KEY_FILE"
chmod 600 "$TEMP_KEY_FILE"

# Validate inputs
if [ -z "$ENCRYPTED_TOKEN" ]; then
    echo "Error: Encrypted token not provided."
    exit 1
fi

if [ -z "$VAULT_NAMESPACE" ]; then
    echo "Error: Vault namespace not provided."
    exit 1
fi


# Decrypt the token using OpenSSL
DECRYPTED_TOKEN=$(echo "$ENCRYPTED_TOKEN" | openssl base64 -d | openssl rsautl -decrypt -inkey "$TEMP_KEY_FILE" 2>/dev/null)

# Check if decryption was successful
if [ $? -ne 0 ] || [ -z "$DECRYPTED_TOKEN" ]; then
    echo "Error: Token decryption failed."
    exit 1
fi

echo "Token successfully decrypted."

# Vault connection details
VAULT_URL="https://vault-new.aws.mobius.nat.bt.com"
#SECRET_PATH="secret/my_key"

# Fetch secrets from Vault using the decrypted token and namespace
SECRETS=$(curl -s \
    --header "X-Vault-Token: $DECRYPTED_TOKEN" \
    --header "X-Vault-Namespace: $VAULT_NAMESPACE" \
    "$VAULT_URL/v1/secret/data/credentials")

# Check if the secret fetch was successful
if [ $? -ne 0 ] || [ -z "$SECRETS" ]; then
    echo "Error: Failed to fetch secrets from Vault."
    exit 1
fi

echo "Secrets successfully fetched from Vault."

# Extract specific values from the Vault response
USERNAME=$(echo "$SECRETS" | jq -r '.data.username')
PASSWORD=$(echo "$SECRETS" | jq -r '.data.password')

# Pass variables to AWX by printing them in JSON format
cat <<EOF
{
  "vault_username": "$USERNAME",
  "vault_password": "$PASSWORD"
}
EOF