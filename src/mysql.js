const mysql = require("mysql");
const _ = require("lodash");
const { readFile } = require("../utils/file.js");
const IS_WW_SHIP = false;
const LANG = 'pt';
const langArr = ['en', 'nl', 'de', 'pt']
const QUERY = 'site:myshopify.com '
const getCategoryFileName = function(keyArr, lang = "en") {
  const path = `${keyArr[0]}-${keyArr[1]}-${keyArr[2].replace("/", "-")}`;
  return {
    path,
    keyword: keyArr[2],
    fName: `./data/collect/collect.${lang}/google-shopify/${path}.txt`
  };
};

const readCategory = async function() {
  const categories = await readFile("./aliexpress-catergories.json");
  // console.log(categories);
  const cateArr = [];

  categories.forEach((category, index) => {
    category.children.forEach((subCate, subIdx) => {
      subCate.children.forEach(thirdCate => {
        const keyArr = [category.text, subCate.text, thirdCate.text];
        cateArr.push(keyArr);
      });
    });
  });
  return cateArr;
};

const getConnectPool = function () {
  const pool = mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "xiaoxudoo@126",
    database: "google_shopify"
  });

  return pool
};

(async function() {
  try {
    const pool = getConnectPool()

    const queryPromise = function(query, options = {}) {
      return new Promise((resolve, reject) => {
        pool.query(query, options, function(error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve({ results, fields });
        });
      });
    };

    console.log("start ", new Date().toLocaleString());
    const start = new Date().getTime();

    const cateArr = await readCategory();
    for await (let lang of langArr) {
      for await (const cates of cateArr) {
        const { path, keyword, fName } = getCategoryFileName(cates, lang);
        console.log(fName)
        const domainList = await readFile(fName);
        // 每一条数据都插入mysql
        const options = {
          domain: '',
          category: path,
          keyword: QUERY + keyword,
          is_ww_ship: IS_WW_SHIP,
          hl: lang
        }
        for await (let domain of domainList) {
          options.domain = domain
          // console.log(options)
          await queryPromise('INSERT INTO shopify_domain SET ?', options)
        }
      }
    }

    const end = new Date().getTime();
    console.log("end ", new Date().toLocaleString());
    console.log("spend time: ", end - start);
  } catch (err) {
    console.log(err);
  }
})();
