import fs from 'fs-extra'
import { search, type Params } from "./api"
import { r } from "./utils"
import historyJosn from '../download/history.json'
import download from 'download'


const apikey = 'yGKH5Hrq3MZAHWiS9VZttLWDUUNxErYU'
/**
 * 如果搜索关键字,直接输入
 * 如果是tagId,输入id:tagId
 */
const keyword = 'id:2777'

/**
 * categories
 * |general|anime|people|
 * |   1   |  0  |   1  |
 * 
 * purity
 * |sfw|sketchy|nsfw|
 * | 1 |   0   |  1 |
 */
const params: Params = {
  apikey,
  q: keyword,
  categories: '111',
  purity: '111',
  sorting: 'favorites',
  order: 'desc',
  ai_art_filter: '0'
}

const history = historyJosn as { [k in string]: string }

async function downloadImg(url: string, dirPath: string) {
  const imgName = url.split('/').pop() ?? ''

  try {
    if (history[imgName]) {
      console.log(`${imgName} 重复下载,已跳过`);
      return
    }

    await download(url, dirPath).then(res => {
      console.log(`${imgName} download ok`);
    })
    updateHistory(imgName)
  } catch (e) {
    console.log(`下载失败${imgName}`, e);
  }
}

function updateHistory(imgName: string) {
  if (!history[imgName]) {
    history[imgName] = 'true'
  }
  fs.writeJSONSync(r('download/history.json'), history, { spaces: 2 })
}

async function createDir() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dirName = `${year}_${month}_${day}--${hours}_${minutes}_${seconds}`
  const dirPath = r(`download/${dirName}`)
  await fs.ensureDir(dirPath)
  return dirPath
}


; (async () => {
  const res = await search(params)
  const data = res.data.data

  const dirPath = await createDir()

  for (let item of data) {
    await downloadImg(item.path, dirPath)
  }
})()


