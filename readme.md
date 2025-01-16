## wallhaven 壁纸下载

#### 依赖安装
```
pnpm i
```

#### config.json
> 在此配置你的`apikey`与关键字与起始页
```js
{
  "apikey": "yGKH5Hrq3MZAHWiS9VZttLWDUUNxErYU",
  "keyword": "id:2777",
  "pageStart": 1,
  "pageEnd": 1
}
```

#### 脚本启动
> 如果下载失败,请查看你是否已经科学上网,因为wallhaven在墙外
> 如果要下载nsfw的图片,需要注册账号并在[这个页面](https://wallhaven.cc/settings/account)查看你的`apikey`
```
pnpm run start
```

#### 下载历史更新
> 这会根据download文件夹下的下载图片重新更新,如果你将图片移动到了其他地方,并且不想重新下载,请不要运行此命令
```
pnpm run updateHistory
```

### [官网api](https://wallhaven.cc/help/api)

### 参数说明
> api参数与正常访问时的参数格式一致

```js
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
  categories: '111', // 默认全选
  purity: '111', // 默认全选
  sorting: 'favorites', // 默认以收藏排序
  order: 'desc', // 默认降序
  ai_art_filter: '0' // 默认不过滤ai
}
```
