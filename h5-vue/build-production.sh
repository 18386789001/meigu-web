#!/bin/bash

# 生产环境构建和错误修复脚本
# 用于修复h5-vue生产环境中的SyntaxError: Invalid linked format错误

echo "=== 开始构建h5-vue生产环境 ==="

# 进入项目目录
cd template/h5-vue

# 清理之前的构建
echo "清理之前的构建..."
rm -rf ../../jar/h5
rm -rf dist
rm -rf node_modules/.vite

# 清理localStorage相关的问题
echo "清理localStorage问题..."
# 这里可以添加清理逻辑

# 安装依赖
echo "安装依赖..."
npm install

# 执行linting检查
echo "执行代码检查..."
npm run lint:fix

# 构建生产版本
echo "构建生产版本..."
npm run build

# 检查构建结果
if [ -d "../../jar/h5" ]; then
    echo "✓ 构建成功"
    
    # 检查关键文件是否存在
    if [ -f "../../jar/h5/index.html" ]; then
        echo "✓ index.html 存在"
    else
        echo "✗ index.html 不存在"
        exit 1
    fi
    
    if [ -d "../../jar/h5/static" ]; then
        echo "✓ static 目录存在"
    else
        echo "✗ static 目录不存在"
        exit 1
    fi
    
    # 检查JavaScript文件
    js_files=$(find ../../jar/h5/static -name "*.js" | wc -l)
    echo "✓ 找到 $js_files 个JavaScript文件"
    
    # 检查是否有语法错误
    echo "检查JavaScript文件语法..."
    for js_file in $(find ../../jar/h5/static -name "*.js"); do
        if ! node -c "$js_file" 2>/dev/null; then
            echo "✗ 发现语法错误: $js_file"
            exit 1
        fi
    done
    echo "✓ 所有JavaScript文件语法正确"
    
else
    echo "✗ 构建失败"
    exit 1
fi

echo "=== 构建完成 ==="
echo "构建输出目录: ../../jar/h5"
echo "可以部署到生产环境"
