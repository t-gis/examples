/** 返回数据格式 */
export interface RequestResponse<T> {
  /** 代码：0-成功 */
  code: number;
  /** 数据 */
  data: T;
  /** 信息 */
  message: string;
}

/** 页面列表请求基本参数 */
export type PageListRequsetBaseParams = {
  /** 当前页面 */
  current: number;
  /** 每页大小 */
  size: number;
}

/** 默认头信息 */
function getDefaultHeaders() {
  const token = localStorage.getItem('t-gis-token') || ''
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
}

/** 处理请求数据 */
function stringifyParam(data: any) {
  if (!data || typeof data !== 'object') return ''
  const keys = Object.keys(data)
  const arr = []
  for (const key of keys) {
    arr.push(`${key}=${data[key]}`)
  }
  return arr.join('&')
}

/** 网络请求 */
const tgisAxios = {
  get: <T = any>(url: string, config?: Pick<RequestInit, 'headers'>): Promise<RequestResponse<T>> => {
    return new Promise((resolve, reject) => {
      const headers = config && config.headers ? config.headers : {}
      const defaultHeaders = getDefaultHeaders()
      fetch(url, { method: 'GET', headers: { ...defaultHeaders, ...headers } }).then(res => res.json()).then(resolve).catch(reject)
    })
  },
  post: <T = any, D = any>(url: string, data?: D, config?: { headers: RequestInit['headers'] }): Promise<RequestResponse<T>> => {
    return new Promise((resolve, reject) => {
      const headers = config && config.headers ? config.headers : {}
      const defaultHeaders = getDefaultHeaders()
      const init: RequestInit = { method: 'POST', headers: { ...defaultHeaders, ...headers } }
      if (data) {
        init.body = stringifyParam(data)
      }
      fetch(url, init).then(res => res.json()).then(resolve).catch(reject)
    })
  },
}

export default tgisAxios;
