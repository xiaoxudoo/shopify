const mysql = require("mysql");
const _ = require("lodash");
const { readFile, saveFile, appendFile } = require("../utils/file.js");

const getCategoryFileName = function(keyArr) {
  const path = `${keyArr[0]}-${keyArr[1]}-${keyArr[2].replace("/", "-")}`;
  return `./data/google-shopify/${path}.txt`;
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

(async function() {
  try {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "xiaoxudoo@126",
      database: "google_shopify"
    });

    connection.connect();

    const queryPromise = function(query) {
      return new Promise((resolve, reject) => {
        connection.query(query, function(error, results, fields) {
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

    
    

    connection.end();
    const end = new Date().getTime();
    console.log("end ", new Date().toLocaleString());
    console.log("spend time: ", end - start);
  } catch (err) {
    console.log(err);
  }
})();
