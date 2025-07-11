#!/bin/bash

# 1. Dodavanje svih izmena
echo "🟡 Dodajem izmene..."
git add .

# 2. Unos commit poruke
echo "✏️  Unesi commit poruku: "
read commit_msg

# 3. Commit
if [ -z "$commit_msg" ]; then
  echo "❌ Commit poruka ne može biti prazna!"
  exit 1
fi
echo "🟢 Commitujem: '$commit_msg'"
git commit -m "$commit_msg"

# 4. Push
echo "🚀 Pushujem na origin/main..."
git push origin main

# 5. Gotovo
echo "✅ Gotovo! Izmene su na GitHub-u." 