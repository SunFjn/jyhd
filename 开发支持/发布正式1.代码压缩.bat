@echo off
chcp 65001
echo CD: %cd%\..\bin\js
cd %cd%\..\bin\js

if not exist main.js.map (
	echo 1.不存在-main.js.map 文件，跳过删除命令！
) else (
	echo 1.删除代码映射文件-main.js.map
	del /f main.js.map
)

if not exist main.js (
	echo 2.不存在-main.js 文件，压缩失败！
	pause
) else (
	echo 2.压缩-main.js代码！
	cmd /K uglifyjs main.js -m -o main.js
)

