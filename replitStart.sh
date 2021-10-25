echo Installing nodejs 16
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
echo Installed nodejs 16
npm rebuild
npm i
npm run start
