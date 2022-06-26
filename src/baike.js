/**
 * 在无头浏览器自动填写表单并提交
 */
const puppeteer = require("puppeteer");
const { readFile, saveFile, processLine, appendFile } = require("../utils/file.js");
const sleep = require("../utils/sleep.js");
const _ = require('lodash')

let allLinks = []
const url_search_base =
    "https://baike.baidu.com/item/";
const nameStr = "薄志山，卜显和，蔡宗苇，车顺爱，陈春英，陈弓，陈敏东，陈胜利，陈威，陈玉，褚良银，戴家银，丁建东，丁克，段春迎，樊卫斌，范青华，方维海，付宏刚，甘志华，高明远，高学云，郭子建，郝京诚，贺鹤勇，侯剑辉，胡炳文，胡文平，黄承志，黄培强，黄维，纪红兵，贾金平，江莉龙，江颖，蒋兴宇，鞠熀先，李丹，李攻科，李广涛，李景虹，李清彪，李永旺，李正平，梁好均，梁鑫淼，林璋，林振阳，刘欢，刘买利，刘有智，刘又年，刘智攀，卢灿忠，陆安慧，陆豪杰，罗成，罗和安，马晓迅，毛秉伟，毛兰群，庞代文，彭路明，裘晓辉，曲良体，全燮，桑楠，邵元华，石伟群，苏成勇，苏循成，孙俊奇，陶军，汪海林，王丹，王海辉，王宏达，王建华，王江云，王树，王树涛，王尧宇，王野，魏飞，翁羽翔，吴乔，吴一弦，吴永宁，夏安东，夏永姚，谢毅，谢在库，邢巍，邢献然，徐南平，徐铜文，徐志康，许维，薛向欣，严秀平，杨伯伦，杨超，杨晟，杨秀荣，杨延强，杨弋，杨运桂，要茂盛，尹航，余家国，俞飚，俞书宏，庾石山，臧双全，张广照，张国林，张浩力，张洪彬，张建平，张礼知，张万斌，张先正，张长生，章俊良，赵进才，赵劲松，郑南峰，钟建江，周立祥，周午纵，周永丰，周永贵，朱利中，左景林";
const names = nameStr.split('，');
// console.log(names.length);
let agentList = []
const get_random_user_agent = function () {
    const seed = Math.floor(Math.random() * agentList.length)
    return agentList[seed]
}

const log = async function (content) {
    await saveFile(content, 'console.log')
}

const randomSleep = async function () {
    const ms = Math.floor(Math.random() * 10) // 0~10s
    await sleep(ms * 1000)
}

const baikeSearch = async function (
    page,
    name
) {
    const url = url_search_base + name;

    console.log('url', url);
    // 地址栏输入网页地址
    await page.goto(url, {
        waitUntil: "networkidle2" // 等待网络状态为空闲的时候才继续执行
    });

    let aLinks = await page.evaluate(() => {
        let as = [...document.querySelectorAll("a")];
        const fas = as.filter(a => {
            const hasShopify = /([^/]+.myshopify.com)/.test(a.href.trim())
            const isSearch = decodeURIComponent(a.href).indexOf('site:myshopify.com') > -1 || a.href.indexOf('search') > -1
            return hasShopify && !isSearch
        })
        return fas.map(a => {
            return /([^/]+.myshopify.com)/.exec(a.href.trim())[0]
        })
    });

    // Prepare the URL for the next request.
    await randomSleep()
};

(async (url, path) => {
    agentList =  await processLine("./user_agents.txt");
    let browser
    let page
    // 启动浏览器
    try {
        browser = await puppeteer.launch({
            args: [
                // '--proxy-server=121.232.194.163:9000',
                '--no-sandbox=', '--disable-setuid-sandbox'
            ],
            // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
            headless: true
        });
        // 打开页面
        page = await browser.newPage();
        // 设置浏览器视窗
        page.setViewport({
            width: 1376,
            height: 768
        });

        await page.setDefaultNavigationTimeout(0);
        for (let name of names) {
            // 更改UserAgent
            const agent = get_random_user_agent()
            console.log('\nuserAgent: ', agent)
            await page.setUserAgent(agent);
            await baikeSearch(page, name);
            if (allLinks.length > 0 && !codeFlag) {
                await saveFile(allLinks, getCategoryFileName(key));
                await appendFile(allLinks, 'result.txt');
                await modifyCategoryState(key, allLinks.length)
            }
            allLinks = []
        }
    } catch (e) {
        console.log('error 时间：', new Date())
        console.error(e)

    }
    await page.close()
    // 不关闭浏览器，看看效果
    await browser.close();
})()
