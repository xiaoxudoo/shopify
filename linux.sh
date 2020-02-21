git clone https://github.com/xiaoxudoo/shopify.git
mkdir data
mkdir google-shopify
touch result.txt
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
vim /etc/profile
source /etc/profile
nvm install 12.14.1
nvm use 12.14.1
node -v
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
cd node_modules/puppeteer/.local-chromium/linux-722234/chrome-linux/
ldd chrome | grep not
git config --global user.email "xiaoxudoo@126.com"
git config --global user.name "xiaoxudoo" 
# ps aux | grep node
node src/google-shopify.js > google-shopify.log &
