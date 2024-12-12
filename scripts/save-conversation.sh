#!/bin/bash

# Erstelle Verzeichnis wenn es nicht existiert
mkdir -p docs/conversations/$(date +%Y-%m)

# Speichere Konversation mit Timestamp
conversation_file="docs/conversations/$(date +%Y-%m)/$(date +%Y-%m-%d_%H-%M).md"

echo "# Cursor AI Conversation - $(date +%Y-%m-%d_%H-%M)" > "$conversation_file"
echo "" >> "$conversation_file"
echo "## Context" >> "$conversation_file"
echo "$(git diff --cached)" >> "$conversation_file"
echo "" >> "$conversation_file"
echo "## Conversation" >> "$conversation_file"
# Hier würde der aktuelle Chat eingefügt werden 