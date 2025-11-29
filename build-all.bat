@echo off
echo 正在构建MT5系统所有前端项目...
echo.

echo 构建admin-vue (后台管理系统)...
cd admin-vue
yarn build
if %errorlevel% neq 0 (
    echo admin-vue 构建失败！
    pause
    exit /b 1
)
cd ..

echo 构建h5-vue (H5端)...
cd h5-vue
yarn build
if %errorlevel% neq 0 (
    echo h5-vue 构建失败！
    pause
    exit /b 1
)
cd ..

echo 构建wap-vue (手机App端)...
cd wap-vue
yarn build
if %errorlevel% neq 0 (
    echo wap-vue 构建失败！
    pause
    exit /b 1
)
cd ..

echo 构建web-vue (PC端)...
cd web-vue
yarn build
if %errorlevel% neq 0 (
    echo web-vue 构建失败！
    pause
    exit /b 1
)
cd ..

echo.
echo 所有项目构建完成！
echo.
echo 构建文件位置：
echo - admin-vue: admin-vue/dist/
echo - h5-vue: h5-vue/dist/
echo - wap-vue: wap-vue/dist/
echo - web-vue: web-vue/dist/
echo.
echo 请将构建后的文件部署到相应的服务器目录
echo.
pause

