## 爬取shopify商家数据

### 运算
```bash
mkdir data
mkdir data/google-shopify
echo '[]' > result.txt
cp aliexpress-catergories.json.origin aliexpress-catergories.json
node src/google-shopify.js > google-shopify.log &
```

### 分析
```bash
npm run analysis
```