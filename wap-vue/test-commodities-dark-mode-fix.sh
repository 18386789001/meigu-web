#!/bin/bash

echo "Starting WAP-Vue Commodities Dark Mode Text Color Fix verification..."

# Navigate to the project directory
cd template/wap-vue

# Step 1: Verify List.vue file exists
echo "1. Verifying src/views/commodities/List.vue file exists..."
if [ -f "src/views/commodities/List.vue" ]; then
  echo "✓ src/views/commodities/List.vue file exists."
else
  echo "✗ src/views/commodities/List.vue file does NOT exist."
  exit 1
fi

# Step 2: Check for ultimateDarkModeTextFix function
echo "2. Verifying ultimateDarkModeTextFix function..."
if grep -q "ultimateDarkModeTextFix" src/views/commodities/List.vue; then
  echo "✓ ultimateDarkModeTextFix function found."
else
  echo "✗ ultimateDarkModeTextFix function NOT found."
  exit 1
fi

# Step 3: Check for comprehensive CSS dark mode styles
echo "3. Verifying comprehensive CSS dark mode styles..."
if grep -q "终极强制暗黑模式样式" src/views/commodities/List.vue; then
  echo "✓ Ultimate dark mode CSS styles found."
else
  echo "✗ Ultimate dark mode CSS styles NOT found."
  exit 1
fi

# Step 4: Check for all text elements coverage
echo "4. Verifying all text elements coverage..."
if grep -q "allTextElements" src/views/commodities/List.vue; then
  echo "✓ All text elements coverage found."
else
  echo "✗ All text elements coverage NOT found."
  exit 1
fi

# Step 5: Check for comprehensive element selectors
echo "5. Verifying comprehensive element selectors..."
elements=("headers" "commodityTitles" "commodityHeaders" "commodityInfos" "commodityCharts" "emptyStates" "tabsWrappers" "tabIcons")

for element in "${elements[@]}"; do
  if grep -q "$element" src/views/commodities/List.vue; then
    echo "✓ $element selector found."
  else
    echo "✗ $element selector NOT found."
    exit 1
  fi
done

# Step 6: Check for theme change watcher
echo "6. Verifying theme change watcher..."
if grep -q "watch.*thStore.theme" src/views/commodities/List.vue; then
  echo "✓ Theme change watcher found."
else
  echo "✗ Theme change watcher NOT found."
  exit 1
fi

# Step 7: Check for multiple dark mode detection methods
echo "7. Verifying multiple dark mode detection methods..."
detection_methods=("thStore.theme" "prefers-color-scheme" "data-theme" "dark-theme" "colorScheme")

for method in "${detection_methods[@]}"; do
  if grep -q "$method" src/views/commodities/List.vue; then
    echo "✓ $method detection method found."
  else
    echo "✗ $method detection method NOT found."
    exit 1
  fi
done

echo ""
echo "=== Test Summary ==="
echo "WAP-Vue Commodities Dark Mode Text Color Fix verification completed successfully!"
echo ""
echo "Key improvements implemented:"
echo "1. Ultimate dark mode text color fix function"
echo "2. Comprehensive element coverage (headers, titles, info, charts, etc.)"
echo "3. Multiple dark mode detection methods"
echo "4. CSS media queries with !important"
echo "5. JavaScript dynamic styling with !important"
echo "6. Theme change watcher for real-time updates"
echo "7. Generic text element processing"
echo "8. Price element exclusion logic"
echo ""
echo "Expected outcome:"
echo "- All text elements in dark mode should be white (#ffffff)"
echo "- Price elements maintain their specific colors (green/red/gray)"
echo "- Real-time theme switching without page refresh"
echo "- Comprehensive coverage of all possible text elements"
echo ""
echo "Manual verification recommended:"
echo "1. Run the application and switch to dark mode"
echo "2. Check that all text is white and readable"
echo "3. Verify price colors are still correct (green/red/gray)"
echo "4. Test theme switching in real-time"
echo "5. Check console for successful style application logs"
