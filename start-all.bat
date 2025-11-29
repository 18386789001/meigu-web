@echo off
echo 正在启动MT5系统所有前端项目...
echo.

echo 启动admin-vue (后台管理系统)...
start "Admin Vue" cmd /k "cd admin-vue && yarn dev"

echo 启动h5-vue (H5端)...
start "H5 Vue" cmd /k "cd h5-vue && yarn dev"

echo 启动wap-vue (手机App端)...
start "Wap Vue" cmd /k "cd wap-vue && yarn dev"

echo 启动web-vue (PC端)...
start "Web Vue" cmd /k "cd web-vue && yarn dev"

echo.
echo 所有项目启动完成！
echo.
echo 访问地址：
echo - Admin Vue: http://localhost:8080
echo - H5 Vue: http://localhost:3333
echo - Wap Vue: http://localhost:5173
echo - Web Vue: http://localhost:5174
echo.
pause

