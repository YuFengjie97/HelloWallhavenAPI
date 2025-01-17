import fs, { stat } from 'fs-extra'
import { search, type Params } from "./api"
import { r } from "./utils"
import historyJosn from '../download/history.json'
import download from 'download'
import config from './config.json'
import axios from 'axios'
import ProgressBar from 'progress'

const {
  apikey,
  q,
  categories,
  purity,
  sorting,
  order,
  ai_art_filter,
  pageStart,
  pageEnd
} = config as Params & {
  pageStart: number
  pageEnd: number
}


const history = historyJosn as { [k in string]: boolean }

/**
 * 
 * download img by npm pack download
 */
// async function downloadImg(url: string, dirPath: string) {
//   const imgName = url.split('/').pop() ?? ''

//   try {
//     if (history[imgName]) {
//       console.log(`${imgName} 重复下载,已跳过`);
//       return
//     }

//     await download(url, dirPath).then(res => {
//       console.log(`${imgName} download ok`);
//     })
//     updateHistory(imgName)

//   } catch (e) {
//     console.log(`下载失败${imgName}`, e);
//   }
// }

async function downloadImg(url: string, imgName: string, dirPath: string) {
  const res = await axios.get(url, {
    responseType: 'stream',
  })

  const totalLength = parseInt(res.headers['content-length'], 10)
  const lengthMB = `${(totalLength / 1024 / 1024).toFixed(2)}MB`

  const write = fs.createWriteStream(`${dirPath}/${imgName}`)

  
  const bar = new ProgressBar(`${lengthMB} [:bar] :speed :percent :etas`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: totalLength
  });

  let downloaded = 0
  const startTime = Date.now()
  res.data.on('data', (chunk: Buffer) => {

    // progress 自定义token,展示速率
    downloaded += chunk.length
    const elapsedTime = (Date.now() - startTime) / 1000
    let speed = downloaded / elapsedTime
    const speedFormat = speed < 1024
      ? `${speed.toFixed(2)} B/s`
      : speed < 1024 * 1024
        ? `${(speed / 1024).toFixed(2)} KB/s`
        : `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;

    bar.tick(chunk.length, {
      speed: speedFormat
    })
  })

  res.data.pipe(write)

  await new Promise((resolve, reject) => {
    write.on('finish', () => {
      console.log(`${imgName} 下载 ok`);
      resolve(true)
    })
    write.on('error', (e) => {
      console.log(`${imgName} 下载 error`);
      reject(e)
    })
  })
}

function updateHistory(imgName: string, status: boolean = true) {
  if (!history[imgName]) {
    history[imgName] = status
  }
  fs.writeJSONSync(r('download/history.json'), history, { spaces: 2 })
}

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  })
}

async function createDir(dirName: string) {
  const dirPath = r(`download/${dirName}`)
  await fs.ensureDir(dirPath)
  return dirPath
}


; (async () => {

  const dirPath = await createDir(q?.replace(':', "_") || sorting)

  for (let page = pageStart; page <= pageEnd; page += 1) {
    console.log(`------page--${page}--------`);

    const params: Params = {
      apikey,
      q,
      categories,
      purity,
      sorting,
      order,
      ai_art_filter,
      page
    }
    const res = await search(params)
    const list = res.data.data
    for (let item of list) {
      const imgName = item.path.split('/').pop() ?? ''
      if (imgName === '') {
        console.log(`${imgName} 获取失败`);
        continue
      }

      if (history[imgName]) {
        console.log(`${imgName} 重复下载,已跳过`);
        continue
      }

      await downloadImg(item.path, imgName, dirPath).then(res => {
        updateHistory(imgName, true)
        sleep(1000)
      }).catch(e => {
        updateHistory(imgName, false)
      })
    }
  }
})()


