import { search, type Params } from "./api"

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

;(async() => {
  const res = await search(params)
  console.log(res.data.data);
})()


