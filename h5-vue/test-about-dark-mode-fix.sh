#!/bin/bash

echo "Starting H5-Vue About Pages Dark Mode Text Color Fix verification..."

# Navigate to the project directory
cd template/h5-vue

# Step 1: Verify About.vue file exists
echo "1. Verifying src/views/about/About.vue file exists..."
if [ -f "src/views/about/About.vue" ]; then
  echo "✓ src/views/about/About.vue file exists."
else
  echo "✗ src/views/about/About.vue file does NOT exist."
  exit 1
fi

# Step 2: Check for dark mode CSS in About.vue
echo "2. Verifying dark mode CSS in About.vue..."
if grep -q "暗黑模式适配" src/views/about/About.vue; then
  echo "✓ Dark mode CSS found in About.vue."
else
  echo "✗ Dark mode CSS NOT found in About.vue."
  exit 1
fi

# Step 3: Verify all 9 section files exist
echo "3. Verifying all 9 section files exist..."
sections=("Section1" "Section2" "Section3" "Section4" "Section5" "Section6" "Section7" "Section8" "Section9")

for section in "${sections[@]}"; do
  if [ -f "src/views/about/sections/${section}.vue" ]; then
    echo "✓ src/views/about/sections/${section}.vue file exists."
  else
    echo "✗ src/views/about/sections/${section}.vue file does NOT exist."
    exit 1
  fi
done

# Step 4: Check for dark mode CSS in all section files
echo "4. Verifying dark mode CSS in all section files..."
for section in "${sections[@]}"; do
  if grep -q "暗黑模式适配" "src/views/about/sections/${section}.vue"; then
    echo "✓ Dark mode CSS found in ${section}.vue."
  else
    echo "✗ Dark mode CSS NOT found in ${section}.vue."
    exit 1
  fi
done

# Step 5: Check for comprehensive dark mode styles
echo "5. Verifying comprehensive dark mode styles..."
dark_mode_elements=("background-color: #000000" "color: #ffffff" "border-bottom: 1px solid #444444" "color: #66b3ff" "color: #cccccc")

for element in "${dark_mode_elements[@]}"; do
  if grep -q "$element" src/views/about/About.vue; then
    echo "✓ $element found in About.vue."
  else
    echo "✗ $element NOT found in About.vue."
    exit 1
  fi
done

# Step 6: Check for theme-based dark mode styles
echo "6. Verifying theme-based dark mode styles..."
theme_selectors=(".dark-theme" "[data-theme=\"dark\"]" "@media (prefers-color-scheme: dark)")

for selector in "${theme_selectors[@]}"; do
  if grep -q "$selector" src/views/about/About.vue; then
    echo "✓ $selector found in About.vue."
  else
    echo "✗ $selector NOT found in About.vue."
    exit 1
  fi
done

# Step 7: Check for card dark mode styles
echo "7. Verifying card dark mode styles..."
card_styles=(".card" ".card-header" ".card-body" "background-color: #1a1a1a" "background-color: #2a2a2a")

for style in "${card_styles[@]}"; do
  if grep -q "$style" src/views/about/sections/Section2.vue; then
    echo "✓ $style found in Section2.vue."
  else
    echo "✗ $style NOT found in Section2.vue."
    exit 1
  fi
done

echo ""
echo "=== Test Summary ==="
echo "H5-Vue About Pages Dark Mode Text Color Fix verification completed successfully!"
echo ""
echo "Files updated:"
echo "1. src/views/about/About.vue (主页面)"
echo "2. src/views/about/sections/Section1.vue (平台简介)"
echo "3. src/views/about/sections/Section2.vue (监管信息)"
echo "4. src/views/about/sections/Section3.vue (交易规则)"
echo "5. src/views/about/sections/Section4.vue (交易时间)"
echo "6. src/views/about/sections/Section5.vue (交易费用)"
echo "7. src/views/about/sections/Section6.vue (交易限制)"
echo "8. src/views/about/sections/Section7.vue (合作伙伴)"
echo "9. src/views/about/sections/Section8.vue (联系我们)"
echo "10. src/views/about/sections/Section9.vue (免责声明)"
echo ""
echo "Key improvements implemented:"
echo "1. Dark mode background color (#000000)"
echo "2. White text color (#ffffff)"
echo "3. Blue accent color (#66b3ff) for titles and links"
echo "4. Light gray color (#cccccc) for muted text"
echo "5. Dark card backgrounds (#1a1a1a, #2a2a2a)"
echo "6. Dark borders (#444444)"
echo "7. Multiple dark mode detection methods"
echo "8. Responsive design maintained"
echo ""
echo "Expected outcome:"
echo "- All text elements in dark mode should be white and readable"
echo "- Titles and links should be blue (#66b3ff)"
echo "- Cards should have dark backgrounds"
echo "- Borders should be visible in dark mode"
echo "- Responsive design should work on mobile devices"
echo ""
echo "Manual verification recommended:"
echo "1. Run the application and switch to dark mode"
echo "2. Navigate to /about and all section pages"
echo "3. Check that all text is white and readable"
echo "4. Verify titles and links are blue"
echo "5. Check that cards have dark backgrounds"
echo "6. Test responsive design on mobile devices"
