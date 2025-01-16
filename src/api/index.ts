import axios from 'axios'
import fs, { read } from 'fs-extra'
import { r } from '../utils';
import { parse } from 'cookie'

export function readCookie() {
  try {
    const isExists = fs.existsSync(r('cookie.txt'))
    if (isExists) {
      const res = fs.readFileSync(r('cookie.txt'), 'utf-8')
      return res
    } else {
      return ''
    }
  } catch (e) {
    console.error('读取cookie失败', e)
    return ''
  }
}

export function writeCookie(data: string) {
  try {
    fs.writeFileSync(r('cookie.txt'), data, 'utf-8')
  } catch (e) {
    console.error('写入cookie失败')
  }
}

export const instance = axios.create({
  headers: {
    origin: 'https://wallhaven.cc',
    referer: 'https://wallhaven.cc',
    'User-Agent': 'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari / 537.36'
  },
  timeout: 10000,
  withCredentials: true
})

instance.interceptors.request.use((config) => {
  const cookie = readCookie()

  if (cookie !== '') {
    config.headers['cookie'] = cookie
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

instance.interceptors.response.use((res) => {
  const setCookie = (res.headers['set-cookie'] ?? []).join(';')

  const cookies = parse(setCookie)
  writeCookie(`XSRF-TOKEN=${cookies['XSRF-TOKEN']};wallhaven_session=${cookies['wallhaven_session']}`)

  return res;
}, (err) => {
  return Promise.reject(err);
});

export function login(data: { username: string, password: string, _token: string }) {
  return instance.post('https://wallhaven.cc/auth/login', data)
}

export function getPage(url: string) {
  return instance.get(url)
}