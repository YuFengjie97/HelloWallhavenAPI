import { r } from './utils'
import fs from 'fs-extra'
import path from 'node:path'

(() => {
  const downloadPath = r('download')

  const list = fs.readdirSync(downloadPath)

  const res: { [imgName in string]: boolean } = {}

  for (let dirname of list) {
    const imgDirPath = path.join(downloadPath, dirname)
    const isDir = fs.statSync(imgDirPath).isDirectory()

    if (isDir) {
      const imgList = fs.readdirSync(imgDirPath)
      for (let imgName of imgList) {
        res[imgName] = true
      }
    }
  }

  fs.writeJSONSync(r('download/history.json'), res, { spaces: 2 })

  console.log(`下载历史更新完毕,共 ${Object.keys(res).length} 条记录`);
})()