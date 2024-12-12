#!/bin/bash

# Setze Umgebungsvariablen
export PRISMA_QUERY_ENGINE_BINARY="debian-openssl-3.0.x"
export PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
export LD_LIBRARY_PATH="/nix/store/z0x0kc32f5c4dg5qj9yk6wjzr6vjx8v5-openssl-3.0.12/lib"

# Erstelle symbolische Links
sudo ln -sf /nix/store/z0x0kc32f5c4dg5qj9yk6wjzr6vjx8v5-openssl-3.0.12/lib/libssl.so.3 /usr/lib/libssl.so.3
sudo ln -sf /nix/store/z0x0kc32f5c4dg5qj9yk6wjzr6vjx8v5-openssl-3.0.12/lib/libcrypto.so.3 /usr/lib/libcrypto.so.3

# Aktualisiere den dynamischen Linker Cache
sudo ldconfig

# Lösche den Prisma Cache
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Installiere Prisma neu
npm install prisma@latest @prisma/client@latest

# Generiere Prisma Client
npx prisma generate 