echo Kickstarting replit
echo Please make sure to fill config.js before running this script
npm i
echo Do you want me to deploy slash commands for you? y/n

read slashanswer

if [ "$slashanswer" == "y" ]; then
  echo Deploying slash commands
  npm run deploy
fi

node index.js



