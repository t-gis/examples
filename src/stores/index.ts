import { getExampleList } from '@/api/example'

const mq = new Map<string, any>()
const map = new Map<string, any[]>()

export const TYPE_EXAMPLE_LIST = 'examplelist'

type SbType = typeof TYPE_EXAMPLE_LIST

function sb() {
	return {
		on(type: SbType, handler: Function) {
			const handlers = map.get(type)
			if (handlers) {
				handlers.push(handler)
			} else {
				map.set(type, [handler])
			}
      if (handler && mq.get(type)) {
				requestIdleCallback(() => {
					handler(mq.get(type))
				})
      }
		},
		off(type: SbType, handler?: Function) {
			const handlers = map.get(type)
			if (handlers) {
				if (handler) {
					const index = handlers.indexOf(handler)
					index >= 0 && handlers.splice(index, 1)
				} else {
					map.set(type, [])
				}
			}
		},
		emit(type: SbType, evt: any) {
			const handlers = map.get(type);
      mq.set(type, evt)
      handlers && handlers.slice().forEach((handler: any) => handler(evt))
		}
	}
}

const store = sb()

function init() {
	const params = { current: 0, size: 10000, parentKey: '二维开发示例' }
	getExampleList(params).then(res => {
		if (!res || res.code !== 0 || !res.data || !Array.isArray(res.data.content)) throw new Error('failed')
		store.emit(TYPE_EXAMPLE_LIST, res.data.content)
	}).catch(() => {
		store.emit(TYPE_EXAMPLE_LIST, [])
	})
}

requestIdleCallback(init)

export default store
