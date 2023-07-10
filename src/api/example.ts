import request from './request'
import type { PageListRequsetBaseParams } from './request'

/** 获取开发示例列表 */
export async function getExampleList(params: PageListRequsetBaseParams) {
  return request.post('/api/example/getList', params)
}
