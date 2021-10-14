echo Downloading NodeJS 14
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
npm i
echo running bot.
node index.js
