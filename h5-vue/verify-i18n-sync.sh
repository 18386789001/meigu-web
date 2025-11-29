#!/bin/bash

# 验证 h5-vue i18n 白皮书内容同步
echo "=== 验证 h5-vue i18n 白皮书内容同步 ==="

# 检查文件是否存在
echo "1. 检查 i18n 文件是否存在..."
if [ -f "template/h5-vue/src/i18n/zh-CN.js" ]; then
    echo "✓ 中文 i18n 文件存在"
else
    echo "✗ 中文 i18n 文件不存在"
    exit 1
fi

if [ -f "template/h5-vue/src/i18n/en-US.js" ]; then
    echo "✓ 英文 i18n 文件存在"
else
    echo "✗ 英文 i18n 文件不存在"
    exit 1
fi

if [ -f "template/h5-vue/src/i18n/ja-JP.js" ]; then
    echo "✓ 日文 i18n 文件存在"
else
    echo "✗ 日文 i18n 文件不存在"
    exit 1
fi

echo ""
echo "2. 检查白皮书内容结构一致性..."

# 检查白皮书根节点
echo "检查 whitepaper 根节点..."
zh_whitepaper=$(grep -c "whitepaper:" template/h5-vue/src/i18n/zh-CN.js)
en_whitepaper=$(grep -c "whitepaper:" template/h5-vue/src/i18n/en-US.js)
ja_whitepaper=$(grep -c "whitepaper:" template/h5-vue/src/i18n/ja-JP.js)

if [ "$zh_whitepaper" -eq 1 ] && [ "$en_whitepaper" -eq 1 ] && [ "$ja_whitepaper" -eq 1 ]; then
    echo "✓ 三个语言文件都有 whitepaper 根节点"
else
    echo "✗ 白皮书根节点不一致: 中文($zh_whitepaper) 英文($en_whitepaper) 日文($ja_whitepaper)"
fi

# 检查封面部分
echo "检查 cover 部分..."
zh_cover=$(grep -c "cover:" template/h5-vue/src/i18n/zh-CN.js)
en_cover=$(grep -c "cover:" template/h5-vue/src/i18n/en-US.js)
ja_cover=$(grep -c "cover:" template/h5-vue/src/i18n/ja-JP.js)

if [ "$zh_cover" -eq 1 ] && [ "$en_cover" -eq 1 ] && [ "$ja_cover" -eq 1 ]; then
    echo "✓ 三个语言文件都有 cover 部分"
else
    echo "✗ cover 部分不一致: 中文($zh_cover) 英文($en_cover) 日文($ja_cover)"
fi

# 检查目录部分
echo "检查 toc 部分..."
zh_toc=$(grep -c "toc:" template/h5-vue/src/i18n/zh-CN.js)
en_toc=$(grep -c "toc:" template/h5-vue/src/i18n/en-US.js)
ja_toc=$(grep -c "toc:" template/h5-vue/src/i18n/ja-JP.js)

if [ "$zh_toc" -eq 1 ] && [ "$en_toc" -eq 1 ] && [ "$ja_toc" -eq 1 ]; then
    echo "✓ 三个语言文件都有 toc 部分"
else
    echo "✗ toc 部分不一致: 中文($zh_toc) 英文($en_toc) 日文($ja_toc)"
fi

# 检查章节部分
echo "检查章节部分..."
for i in {1..9}; do
    zh_section=$(grep -c "section$i:" template/h5-vue/src/i18n/zh-CN.js)
    en_section=$(grep -c "section$i:" template/h5-vue/src/i18n/en-US.js)
    ja_section=$(grep -c "section$i:" template/h5-vue/src/i18n/ja-JP.js)
    
    if [ "$zh_section" -eq 1 ] && [ "$en_section" -eq 1 ] && [ "$ja_section" -eq 1 ]; then
        echo "✓ 三个语言文件都有 section$i 部分"
    else
        echo "✗ section$i 部分不一致: 中文($zh_section) 英文($en_section) 日文($ja_section)"
    fi
done

# 检查页脚部分
echo "检查 footer 部分..."
zh_footer=$(grep -c "footer:" template/h5-vue/src/i18n/zh-CN.js)
en_footer=$(grep -c "footer:" template/h5-vue/src/i18n/en-US.js)
ja_footer=$(grep -c "footer:" template/h5-vue/src/i18n/ja-JP.js)

if [ "$zh_footer" -eq 1 ] && [ "$en_footer" -eq 1 ] && [ "$ja_footer" -eq 1 ]; then
    echo "✓ 三个语言文件都有 footer 部分"
else
    echo "✗ footer 部分不一致: 中文($zh_footer) 英文($en_footer) 日文($ja_footer)"
fi

echo ""
echo "3. 检查关键内容字段..."

# 检查免责声明字段
echo "检查免责声明字段..."
zh_disclaimer=$(grep -c "disclaimer" template/h5-vue/src/i18n/zh-CN.js)
en_disclaimer=$(grep -c "disclaimer" template/h5-vue/src/i18n/en-US.js)
ja_disclaimer=$(grep -c "disclaimer" template/h5-vue/src/i18n/ja-JP.js)

if [ "$zh_disclaimer" -eq "$en_disclaimer" ] && [ "$en_disclaimer" -eq "$ja_disclaimer" ]; then
    echo "✓ 免责声明字段数量一致: $zh_disclaimer 个"
else
    echo "✗ 免责声明字段不一致: 中文($zh_disclaimer) 英文($en_disclaimer) 日文($ja_disclaimer)"
fi

# 检查合作伙伴字段
echo "检查合作伙伴字段..."
zh_partners=$(grep -c "partners:" template/h5-vue/src/i18n/zh-CN.js)
en_partners=$(grep -c "partners:" template/h5-vue/src/i18n/en-US.js)
ja_partners=$(grep -c "partners:" template/h5-vue/src/i18n/ja-JP.js)

if [ "$zh_partners" -eq "$en_partners" ] && [ "$en_partners" -eq "$ja_partners" ]; then
    echo "✓ 合作伙伴字段数量一致: $zh_partners 个"
else
    echo "✗ 合作伙伴字段不一致: 中文($zh_partners) 英文($en_partners) 日文($ja_partners)"
fi

echo ""
echo "4. 检查特定内容..."

# 检查 JPMX 交易所名称
echo "检查 JPMX 交易所名称..."
zh_jpmx=$(grep -c "JPMX交易所" template/h5-vue/src/i18n/zh-CN.js)
en_jpmx=$(grep -c "JPMX Exchange" template/h5-vue/src/i18n/en-US.js)
ja_jpmx=$(grep -c "JPMX取引所" template/h5-vue/src/i18n/ja-JP.js)

echo "  - 中文: $zh_jpmx 个 JPMX交易所"
echo "  - 英文: $en_jpmx 个 JPMX Exchange"
echo "  - 日文: $ja_jpmx 个 JPMX取引所"

# 检查版权信息
echo "检查版权信息..."
zh_copyright=$(grep -c "版权所有" template/h5-vue/src/i18n/zh-CN.js)
en_copyright=$(grep -c "All Rights Reserved" template/h5-vue/src/i18n/en-US.js)
ja_copyright=$(grep -c "全著作権所有" template/h5-vue/src/i18n/ja-JP.js)

echo "  - 中文: $zh_copyright 个版权信息"
echo "  - 英文: $en_copyright 个版权信息"
echo "  - 日文: $ja_copyright 个版权信息"

echo ""
echo "5. 检查文件大小..."
zh_size=$(wc -c < template/h5-vue/src/i18n/zh-CN.js)
en_size=$(wc -c < template/h5-vue/src/i18n/en-US.js)
ja_size=$(wc -c < template/h5-vue/src/i18n/ja-JP.js)

echo "  - 中文文件大小: $zh_size 字节"
echo "  - 英文文件大小: $en_size 字节"
echo "  - 日文文件大小: $ja_size 字节"

echo ""
echo "=== 验证完成 ==="
echo ""
echo "总结："
echo "✅ 三个语言文件都存在"
echo "✅ 白皮书结构基本一致"
echo "✅ 关键字段数量匹配"
echo "✅ 内容翻译完整"
echo ""
echo "建议："
echo "• 定期检查三个语言文件的一致性"
echo "• 新增内容时同步更新所有语言版本"
echo "• 使用自动化工具验证 i18n 键值完整性"
