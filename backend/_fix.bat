@echo off
copy /Y package.json.new package.json
del scripts\_patch-pkg.js
echo Done
