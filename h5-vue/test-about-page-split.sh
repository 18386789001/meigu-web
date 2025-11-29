#!/bin/bash

echo "Starting H5-Vue About page split verification..."

# Navigate to the project directory
cd template/h5-vue

# Step 1: Verify directory structure
echo "1. Verifying directory structure..."
if [ -d "src/views/about" ]; then
  echo "✓ src/views/about directory exists."
else
  echo "✗ src/views/about directory does NOT exist."
  exit 1
fi

if [ -d "src/views/about/sections" ]; then
  echo "✓ src/views/about/sections directory exists."
else
  echo "✗ src/views/about/sections directory does NOT exist."
  exit 1
fi

# Step 2: Verify main About.vue file
echo "2. Verifying main About.vue file..."
if [ -f "src/views/about/About.vue" ]; then
  echo "✓ src/views/about/About.vue file exists."
else
  echo "✗ src/views/about/About.vue file does NOT exist."
  exit 1
fi

# Step 3: Verify all section files
echo "3. Verifying all section files..."
sections=("Section1.vue" "Section2.vue" "Section3.vue" "Section4.vue" "Section5.vue" "Section6.vue" "Section7.vue" "Section8.vue" "Section9.vue")

for section in "${sections[@]}"; do
  if [ -f "src/views/about/sections/$section" ]; then
    echo "✓ src/views/about/sections/$section exists."
  else
    echo "✗ src/views/about/sections/$section does NOT exist."
    exit 1
  fi
done

# Step 4: Verify router configuration
echo "4. Verifying router configuration..."
if grep -q "AboutSection1" src/router/index.js; then
  echo "✓ Router configuration includes AboutSection1."
else
  echo "✗ Router configuration does NOT include AboutSection1."
  exit 1
fi

if grep -q "AboutSection9" src/router/index.js; then
  echo "✓ Router configuration includes AboutSection9."
else
  echo "✗ Router configuration does NOT include AboutSection9."
  exit 1
fi

# Step 5: Verify i18n translations
echo "5. Verifying i18n translations..."
if grep -q "backToIndex" src/i18n/zh-CN.js; then
  echo "✓ Chinese translation for backToIndex exists."
else
  echo "✗ Chinese translation for backToIndex does NOT exist."
  exit 1
fi

if grep -q "backToIndex" src/i18n/en-US.js; then
  echo "✓ English translation for backToIndex exists."
else
  echo "✗ English translation for backToIndex does NOT exist."
  exit 1
fi

if grep -q "backToIndex" src/i18n/ja-JP.js; then
  echo "✓ Japanese translation for backToIndex exists."
else
  echo "✗ Japanese translation for backToIndex does NOT exist."
  exit 1
fi

# Step 6: Check for old About.vue file
echo "6. Checking for old About.vue file..."
if [ -f "src/views/About.vue" ]; then
  echo "✗ Old src/views/About.vue file still exists. Please remove it."
  exit 1
else
  echo "✓ Old src/views/About.vue file has been removed."
fi

echo ""
echo "=== Test Summary ==="
echo "About page split verification completed successfully!"
echo ""
echo "New structure:"
echo "- src/views/about/About.vue (Main page with TOC)"
echo "- src/views/about/sections/Section1.vue (Platform Overview)"
echo "- src/views/about/sections/Section2.vue (Global Compliance)"
echo "- src/views/about/sections/Section3.vue (Market Layout & User Scale)"
echo "- src/views/about/sections/Section4.vue (Products & Services)"
echo "- src/views/about/sections/Section5.vue (Core Technical Capabilities)"
echo "- src/views/about/sections/Section6.vue (Core Team Background)"
echo "- src/views/about/sections/Section7.vue (Strategic Partners)"
echo "- src/views/about/sections/Section8.vue (Future Development Plans)"
echo "- src/views/about/sections/Section9.vue (Disclaimer)"
echo ""
echo "Benefits:"
echo "- Improved performance during language switching"
echo "- Better code organization and maintainability"
echo "- Lazy loading of individual sections"
echo "- Reduced bundle size per page"
echo ""
echo "Manual verification recommended:"
echo "1. Run 'npm run dev' and test navigation between sections"
echo "2. Test language switching on each section"
echo "3. Verify all content displays correctly in all languages"
