import axios from 'axios'


export const instance = axios.create({
  baseURL: 'https://wallhaven.cc/api/v1',
  timeout: 10000,
  withCredentials: true
})

export type Params = {
  q?: string // <keyword> or <id:tagid>
  apikey?: string
  categories?: string
  purity?: string
  sorting?: 'relevance' | 'random' | 'date_added' | 'views' | 'favorites' | 'toplist' | 'hot'
  order?: 'asc' | 'desc',
  ai_art_filter?: string // 0不过滤ai,1过滤ai
}

export function search(params: Params) {
  return instance.get('/search', {
    params,
  })
}

