#!/bin/bash

# Find all .js, .jsx, .ts, .tsx files in app/ and components/
find ./app ./components -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | while read file; do
  echo "Fixing $file"
  # Replace unescaped single quotes in text nodes with &apos;
  sed -i "s/>\([^<]*\)'/\>\1&apos;/g" "$file"
  sed -i "s/'\([^<]*\)</&apos;\1</g" "$file"
  # Replace unescaped double quotes in text nodes with &quot;
  sed -i 's/>\([^<]*\)"/>\1&quot;/g' "$file"
  sed -i 's/"\([^<]*\)</&quot;\1</g' "$file"
done

echo "Done! Please review the changes and test your app."