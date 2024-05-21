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
	// let data:any[]=[
	// 	{
	// 		"id": "6515437f5a980c6002dde2e6",
	// 		"name": "创建地图",
	// 		"category": "基础部分",
	// 		"content": "import * as Map2d from \"map2d\";\n\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n\n// 天地图参数\nconst key = \"4f8dc07442f4aad13d055fec8d01b4c8\";\nconst uri = \"http://t{0-7}.tianditu.gov.cn\";\n\n// 天地图底图\nconst vec_w = new Map2d.UrlTemplateImageryProvider({\n    url: uri + \"/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=\" + key\n});\nviewer.imageryLayers.addImageryProvider(vec_w);\n\n// 天地图注记\nconst cva_w = new Map2d.UrlTemplateImageryProvider({\n    url: uri + \"/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=\" + key\n});\nviewer.imageryLayers.addImageryProvider(cva_w);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});",
	// 		"imageId": "6515437d5a980c6002dde2e5",
	// 		"createTime": null,
	// 		"descInfo": "快速开始-基础部分",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "6584f8886b3add16dd64504e",
	// 		"name": "指定范围坐标取线2.0",
	// 		"category": "地图操作",
	// 		"content": "import * as Map2d from \"map2d\";\r\n\r\n// 创建地图\r\nconst viewer = new Map2d.Viewer(\"map\");\r\n\r\n// 天地图参数\r\nconst key = \"4f8dc07442f4aad13d055fec8d01b4c8\";\r\nconst uri = \"http://t{0-7}.tianditu.gov.cn\";\r\n\r\n// 天地图底图\r\nconst vec_w = new Map2d.UrlTemplateImageryProvider({\r\n    url: uri + \"/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=\" + key\r\n});\r\nviewer.imageryLayers.addImageryProvider(vec_w);\r\n\r\n// 天地图注记\r\nconst cva_w = new Map2d.UrlTemplateImageryProvider({\r\n    url: uri + \"/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=\" + key\r\n});\r\nviewer.imageryLayers.addImageryProvider(cva_w);\r\n\r\n// 跳转到深圳\r\nviewer.camera.flyTo({\r\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\r\n});\r\n\r\n\r\n    const map=viewer.map;\r\n   //查询点位信息\r\n    var x = 113.959371;\r\n    var y = 22.583571;\r\n    //查询范围信息\r\n    let metersPerUnit = viewer.map.getView().getProjection().getMetersPerUnit()\r\n    let circleRadius = 5 * 1000 / metersPerUnit\r\n    // 查询数据信息：格式：(数据源：数据集）\r\n    var data = \"t-gis-base:中路段_J_4490\";\r\n    //数据服务url\r\n    var dataurl = \"http://10.223.178.107/iserverMapDistance/iserver/services/data-TGIS/rest/data\";\r\n\r\n\r\n    var buffer = new ol.geom.Circle([x, y], circleRadius);\r\n    var polygon = new ol.geom.Polygon.fromCircle(buffer);\r\n\r\n    var bufferSource = new ol.source.Vector({\r\n        features: [new ol.Feature(buffer)]\r\n    });\r\n    var circleLayer = new ol.layer.Vector({\r\n        source: bufferSource,\r\n        style: new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color: 'rgba(0, 183, 239)',\r\n                width: 3\r\n            }),\r\n            fill: new ol.style.Fill({\r\n                color: 'rgba(0, 255, 255, 0.1)'\r\n            })\r\n        })\r\n    });\r\n\r\n    //将缓冲区添加到图层中\r\n    map.addLayer(circleLayer);\r\n\r\n    var geometryParam = new Map2d.SDK.supermap.GetFeaturesByGeometryParameters({\r\n        datasetNames: [data],\r\n        geometry: polygon,\r\n        toIndex: 0,\r\n        maxFeatures:-1,\r\n    });\r\n\r\n\r\n    new ol.supermap.FeatureService(dataurl).getFeaturesByGeometry(geometryParam, function (serviceResult) {\r\n        var features = (new ol.format.GeoJSON()).readFeatures(serviceResult.result.features);\r\n        //道路风格\r\n        var CTstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(0, 128, 0)', //畅通\r\n                width: 2\r\n            })\r\n        })\r\n        var QDstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(0, 255, 1)', //轻度拥堵\r\n                width: 2\r\n            })\r\n        })\r\n        var ZDstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(255, 255, 1)', //中度拥堵\r\n                width: 2\r\n            })\r\n        })\r\n        var YZstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(255, 127, 0)', //严重拥堵\r\n                width: 2\r\n            })\r\n        })\r\n        var JDstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(254, 0, 0)', //极度拥堵\r\n                width: 2 \r\n            })\r\n        })\r\n\r\n        for (var i = 0; i < features.length; i++){\r\n            var stauts = features[i].values_.CONINDEX;\r\n            if( -1<=stauts && stauts<2 ){\r\n                features[i].setStyle(CTstyle)\r\n            }\r\n            if( 2<=stauts  && stauts<4 ){\r\n                features[i].setStyle(QDstyle) \r\n            }\r\n            if( 4<=stauts  && stauts<6 ){\r\n                features[i].setStyle(ZDstyle)\r\n            }\r\n            if( 6<=stauts  && stauts<8 ){\r\n                features[i].setStyle(YZstyle)\r\n            }\r\n            if( 8<=stauts ){\r\n                features[i].setStyle(JDstyle)\r\n            }\r\n        }\r\n\r\n        vectorSource.addFeatures(features);\r\n        // 添加监听\r\n        map.on('click', pointermoveLinstener);\r\n    });\r\n\r\n    //将查询结果添加到图层中\r\n    vectorSource = new ol.source.Vector({\r\n        wrapX: false\r\n    });\r\n    resultLayer = new ol.layer.Vector({\r\n        source: vectorSource,\r\n    });\r\n    map.addLayer(resultLayer);\r\n\r\n//监听触发事件\r\nfunction pointermoveLinstener(e) {\r\n    map.forEachFeatureAtPixel(e.pixel, function (feature) {\r\n        if (feature.getProperties().NAME) {\r\n            console.log(feature);\r\n        }\r\n    });\r\n    \r\n}\r\n\r\n\r\n",
	// 		"imageId": "65850edc6b3add16dd64513d",
	// 		"createTime": null,
	// 		"descInfo": "",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "66304f73e94fea453f3c099d",
	// 		"name": "丰图白天栅格地图加载",
	// 		"category": "地图操作",
	// 		"content": "\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n// 加载栅格地图\nconst imageryProvider =new Map2d.WebMapTileServiceImageryProvider({\nurl: \"http://10.223.178.107/api/t-gis/fengtu/dtxr/MapTileService/wmts\",\nlayer:\"wmts_4326_440000\",\nstyle: 'default',\nformat: 'image/png',\ntileMatrixSetID: 'c',\ntileMatrixLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],\nmaximumLevel: 20\n})\n\n// 加载栅格地图\nviewer.imageryLayers.addImageryProvider(imageryProvider);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});",
	// 		"imageId": "6627521d054a5b74c11b0744",
	// 		"createTime": null,
	// 		"descInfo": "丰图栅格地图",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "6448ee654064a643fbd2d90c",
	// 		"name": "websocket交通监测",
	// 		"category": "地图操作",
	// 		"content": "import * as Map2d from \"map2d\";\n\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n\n// 天地图参数\nconst uri = \"http://10.223.178.107/api/t-gis/tdtd\";\n\n// 天地图底图\nconst vec_w = new Map2d.UrlTemplateImageryProvider({\n    url: uri + \"/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=\"\n});\nviewer.imageryLayers.addImageryProvider(vec_w);\n\n// 天地图注记\nconst cva_w = new Map2d.UrlTemplateImageryProvider({\n    url: uri + \"/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=\"\n});\nviewer.imageryLayers.addImageryProvider(cva_w);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});\n\n\nconst dataSource=new Map2d.CustomDataSource(\"cluster\");\nconst socket=new WebSocket('ws://10.223.178.107/wbsocket/topicTwo/')\n\nconst dataSourcePromise=viewer.dataSources.add(dataSource)\nsocket.onmessage=function(e){\n    let jsonData=JSON.parse(e.data)\n    for(let i=0;i<jsonData.length;i++){\n        const coordinates=[jsonData[i].x,jsonData[i].y];\n            const entity=new Map2d.Entity({\n                position:coordinates,\n                point:{\n                    pixelSize:5,\n                    color:'red'\n                }\n            });\n            dataSource.entities.add(entity);\n    }\n    //不开启聚合\n    dataSourcePromise.then(dataSource=>{\n        dataSource.clustering.enabled=false;\n    })\n    function graphicUpdate(){\n        //关闭websocket连接\n        socket.close();\n        //开启聚合\n        dataSource.clustering.enabled=false;\n        //聚合范围默认是20\n        dataSource.clustering.pixelRange  = 80;\n    }\n    //20秒后执行\n    setTimeout(graphicUpdate, 10000);\n}\n\nviewer.on(\"click\",()=>{\n    socket.close();\n    //清除点位\n    dataSource.clustering.layer.dispose()\n})\n\nSandcastle.addToggleButton(\"是否显示\", true, function (\n    checked\n) {\n    dataSource.clustering.show = checked;\n});",
	// 		"imageId": "655dbdc2e173d506607bf88f",
	// 		"createTime": null,
	// 		"descInfo": "交通监测加聚合与点样式效果",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "656da2d386cf362512b68011",
	// 		"name": "交通监测2.0",
	// 		"category": "地图操作",
	// 		"content": "import * as Map2d from \"map2d\";\n\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n\n// 天地图参数\nconst uri = \"http://10.223.178.107/api/t-gis/tdtd\";\n\n// 天地图底图\nconst vec_w = new Map2d.UrlTemplateImageryProvider({\n    url: uri + \"/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=\"\n});\nviewer.imageryLayers.addImageryProvider(vec_w);\n\n// 天地图注记\nconst cva_w = new Map2d.UrlTemplateImageryProvider({\n    url: uri + \"/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=\"\n});\nviewer.imageryLayers.addImageryProvider(cva_w);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});\nfunction monitorPolymerization(){\n\nconst dataSource=new Map2d.CustomDataSource(\"cluster\");\nconst socket=new WebSocket('ws://10.223.178.107/wbsocket/topicTwo/')\n\nconst dataSourcePromise=viewer.dataSources.add(dataSource)\n    socket.onmessage=function(e){\n        let jsonData=JSON.parse(e.data)\n        var shenzhenExtent = {\n            minX: 113.7565,\n            minY: 22.3964,\n            maxX: 114.6517,\n            maxY: 22.8345\n        };\n\n        var pointsInShenzhen = jsonData.filter(function(point) {\n            var lon = point.x;\n            var lat = point.y;\n\n            if (lon >= shenzhenExtent.minX && lon <= shenzhenExtent.maxX && lat >= shenzhenExtent.minY && lat <= shenzhenExtent.maxY) {\n                return true;\n            } else {\n                return false;\n            }\n        });\n        for(let i=0;i<pointsInShenzhen.length;i++){\n            if(pointsInShenzhen[i].vehicleTypeName===\"省际客车\"){\n                const coordinates=[pointsInShenzhen[i].x,pointsInShenzhen[i].y];\n                const entity=new Map2d.Entity({\n                    position:coordinates,\n                    point:{\n                        pixelSize:5,\n                        color:'red'\n                    }\n                });\n                dataSource.entities.add(entity);\n            }\n            if(pointsInShenzhen[i].vehicleTypeName===\"旅游客车\"){\n                const coordinates=[pointsInShenzhen[i].x,pointsInShenzhen[i].y];\n                const entity=new Map2d.Entity({\n                    position:coordinates,\n                    point:{\n                        pixelSize:5,\n                        color:'green'\n                    }\n                });\n                dataSource.entities.add(entity);\n            }\n        }\n        //不开启聚合\n        dataSourcePromise.then(dataSource=>{\n            dataSource.clustering.enabled=true;\n            dataSource.clustering.pixelRange  = 80;\n        })\n        //关闭websocket连接\n        socket.close();\n        function graphicUpdate(){\n            dataSource.show = false\n            dataSource.clustering.layer.dispose()\n            monitorPolymerization()\n        }\n        //一分钟后执行更新\n        setTimeout(graphicUpdate, 60000);\n    }\n}\nmonitorPolymerization()\n\n\n\n// viewer.on(\"click\",()=>{\n//     socket.close();\n//     //清除点位\n//     dataSource.clustering.layer.dispose()\n// })\n\nSandcastle.addToggleButton(\"是否显示\", true, function (\n    checked\n) {\n    dataSource.clustering.show = checked;\n});",
	// 		"imageId": "656da2d286cf362512b68010",
	// 		"createTime": null,
	// 		"descInfo": "",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "6584e8876b3add16dd644ba3",
	// 		"name": "指定范围位置取线",
	// 		"category": "地图操作",
	// 		"content": "/**\r\n * \r\n * //双击创建\r\n * 坐标给定了位置，根据自己的情况设置坐标\r\n * \r\n * \r\n * \r\n */\r\n\r\n\r\n\r\n\r\nimport * as Map2d from \"map2d\";\r\n\r\n// 创建地图\r\nconst viewer = new Map2d.Viewer(\"map\");\r\n\r\n// 天地图参数\r\nconst uri = \"http://10.223.178.107/api/t-gis/tdtd\";\r\n\r\n// 天地图底图\r\nconst vec_w = new Map2d.UrlTemplateImageryProvider({\r\n    url: uri + \"/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=\"\r\n});\r\nviewer.imageryLayers.addImageryProvider(vec_w);\r\n\r\n// 天地图注记\r\nconst cva_w = new Map2d.UrlTemplateImageryProvider({\r\n    url: uri + \"/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=\"\r\n});\r\nviewer.imageryLayers.addImageryProvider(cva_w);\r\n\r\n// 跳转到深圳\r\nviewer.camera.flyTo({\r\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\r\n});\r\n\r\n\r\n\r\nconst map=viewer.map;\r\nlet circleSource = new ol.source.Vector()\r\nlet vector = new ol.layer.Vector({\r\n  source: circleSource,\r\n  style: new ol.style.Style({\r\n    fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),\r\n    stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 0.8)', width: 2 })\r\n  })\r\n})\r\n\r\nviewer.map.addLayer(vector)\r\nvar x = 113.959371;\r\nvar y = 22.583571;\r\n\r\nviewer.map.on('dblclick', function (event) {\r\n    let center = [x,y];\r\n    let metersPerUnit = viewer.map.getView().getProjection().getMetersPerUnit()\r\n    let circleRadius = 5 * 1000 / metersPerUnit\r\n    let circle = new ol.geom.Circle(center, circleRadius)\r\n    let circleFeature = new ol.Feature(circle)\r\n    circleSource.addFeature(circleFeature)\r\n    addRandomCircle(circle,circleRadius)\r\n})\r\nfunction addRandomCircle(circle,circleRadius){\r\n    var dataurl = \"http://10.223.178.107/iserverMapDistance/iserver/services/data-TGIS/rest/data\";\r\n    var data = \"t-gis-base:中路段_J_4490\";//实时路况\r\n    var point = new ol.geom.Point([x, y]);\r\n\r\n\r\n    var bufferParam = new Map2d.SDK.supermap.GetFeaturesByBufferParameters({\r\n        datasetNames: [data],\r\n        bufferDistance: circleRadius,\r\n        geometry: point,\r\n        toIndex: 0,\r\n        maxFeatures:-1,\r\n    });\r\n\r\n\r\n    new ol.supermap.FeatureService(dataurl).getFeaturesByBuffer(bufferParam, function (serviceResult) {\r\n        var features = (new ol.format.GeoJSON()).readFeatures(serviceResult.result.features);\r\n         //道路风格\r\n        var YJstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(220, 20, 60)', //拥挤\r\n                width: 3\r\n            })\r\n        })\r\n        var CTstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(50, 205, 50)', //畅通\r\n                width: 3 \r\n            })\r\n        })\r\n        var FMstyle = new ol.style.Style({\r\n            stroke: new ol.style.Stroke({\r\n                color:'rgba(255, 165, 0)', //繁忙\r\n                width: 3 \r\n            })\r\n        })\r\n\r\n        for (var i = 0; i < features.length; i++){\r\n            var stauts = features[i].values_.CONINDEX;\r\n            if( -1<=stauts && stauts<1 ){\r\n                features[i].setStyle(YJstyle)\r\n            }\r\n            if( 1<=stauts  && stauts<2 ){\r\n                features[i].setStyle(CTstyle) \r\n            }\r\n            if( 2<=stauts){\r\n                features[i].setStyle(FMstyle)\r\n            }\r\n        }\r\n\r\n        vectorSource.addFeatures(features);\r\n        console.log(vectorSource.getFeatures())\r\n        map.on('click', pointermoveLinstener);\r\n    });\r\n     vectorSource = new ol.source.Vector({\r\n        wrapX: false\r\n    });\r\n    resultLayer = new ol.layer.Vector({\r\n        source: vectorSource,\r\n    });\r\n    map.addLayer(resultLayer);\r\n}\r\n\r\nfunction pointermoveLinstener(e) {\r\n    map.forEachFeatureAtPixel(e.pixel, function (feature) {\r\n        if (feature.getProperties().NAME) {\r\n            console.log(feature);\r\n        }\r\n    });\r\n    \r\n}",
	// 		"imageId": "6584e8866b3add16dd644ba2",
	// 		"createTime": null,
	// 		"descInfo": "该方法会将范围内的整条路都拿到",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "66305081e94fea453f3c09a1",
	// 		"name": "丰图静谧蓝栅格地图",
	// 		"category": "地图操作",
	// 		"content": "\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n// 加载栅格地图\nconst imageryProvider =new Map2d.WebMapTileServiceImageryProvider({\nurl: \"http://10.223.178.107/api/t-gis/fengtu/dtxr/MapTileService/wmts\",\nlayer:\"wmts_4326_440300_quietblue_label\",\nstyle: 'default',\nformat: 'image/png',\ntileMatrixSetID: 'c',\ntileMatrixLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],\nmaximumLevel: 20\n})\n\n// 加载栅格地图\nviewer.imageryLayers.addImageryProvider(imageryProvider);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});",
	// 		"imageId": "6630507ee94fea453f3c09a0",
	// 		"createTime": null,
	// 		"descInfo": "",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "66305056e94fea453f3c099f",
	// 		"name": "丰图白天栅格地图带东莞惠州",
	// 		"category": "地图操作",
	// 		"content": "\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n// 加载栅格地图\nconst imageryProvider =new Map2d.WebMapTileServiceImageryProvider({\nurl: \"http://10.223.178.107/api/t-gis/fengtu/dtxr/MapTileService/wmts\",\nlayer:\"wmts_4326_440000\",\nstyle: 'default',\nformat: 'image/png',\ntileMatrixSetID: 'c',\ntileMatrixLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],\nmaximumLevel: 20\n})\n\n// 加载栅格地图\nviewer.imageryLayers.addImageryProvider(imageryProvider);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});",
	// 		"imageId": "6630502be94fea453f3c099e",
	// 		"createTime": null,
	// 		"descInfo": "",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "6627521e054a5b74c11b0745",
	// 		"name": "栅格地图加载",
	// 		"category": "地图操作",
	// 		"content": "\n// 创建地图\nconst viewer = new Map2d.Viewer(\"map\");\n// 加载栅格地图\nconst imageryProvider =new Map2d.WebMapTileServiceImageryProvider({\nurl: \"http://10.223.178.107/api/t-gis/fengtu/dtxr/MapTileService/wmts\",\nlayer:\"wmts_4326_440300_day\",\nstyle: 'default',\nformat: 'image/png',\ntileMatrixSetID: 'c',\ntileMatrixLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],\nmaximumLevel: 20\n})\n\n// 加载栅格地图\nviewer.imageryLayers.addImageryProvider(imageryProvider);\n\n// 跳转到深圳\nviewer.camera.flyTo({\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\n});",
	// 		"imageId": "6627521d054a5b74c11b0744",
	// 		"createTime": null,
	// 		"descInfo": "丰图栅格地图",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	},
	// 	{
	// 		"id": "658295c54c8e7d19e0d92936",
	// 		"name": "绘制圆范围分类",
	// 		"category": "地图操作",
	// 		"content": "\r\n// ????????\r\nconst viewer = new Map2d.Viewer(\"map\");\r\n\r\n// ??????????\r\nconst uri = \"http://10.223.178.107/api/t-gis/tdtd\";\r\n\r\n// ??????????\r\nconst vec_w = new Map2d.UrlTemplateImageryProvider({\r\n    url: uri + \"/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=\"\r\n});\r\nviewer.imageryLayers.addImageryProvider(vec_w);\r\n\r\n// ??????????\r\nconst cva_w = new Map2d.UrlTemplateImageryProvider({\r\n    url: uri + \"/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=\"\r\n});\r\nviewer.imageryLayers.addImageryProvider(cva_w);\r\n\r\n// ??????????\r\nviewer.camera.flyTo({\r\n    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)\r\n});\r\n\r\nlet entList=[]\r\nlet entitiesList=[]\r\nlet socket;\r\nlet wbskfive;\r\nlet timerId;\r\nlet onswitch=false;\r\nlet isClick=false\r\nlet circleSource = new ol.source.Vector()\r\nlet obj={'出租车':true,'泥头车':true,'摄像头':true}\r\n// let \r\n//圆样式\r\nlet vector = new ol.layer.Vector({\r\n  source: circleSource,\r\n  style: new ol.style.Style({\r\n    fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),\r\n    stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 0.8)', width: 2 })\r\n  })\r\n})\r\n\r\nviewer.map.addLayer(vector)\r\n\r\nfunction eliminate(){\r\n    clearTimeout(timerId);//关闭定时器\r\n    socket.close();//关闭websock连接\r\n    wbskfive.close();//关闭websock连接\r\n    circleSource.clear();//清除圆\r\n    removeEntities();\r\n    onswitch=false\r\n    entList=[]\r\n}\r\n\r\n//绘制圆\r\nviewer.map.on('click',async function (event) {\r\n     if(isClick){\r\n        isClick=false\r\n        return\r\n     }\r\n    //防止重复调用\r\n    if(onswitch){\r\n        eliminate()\r\n    }\r\n    //中心点位\r\n    let center = event.coordinate;\r\n    let metersPerUnit = viewer.map.getView().getProjection().getMetersPerUnit()\r\n    //圆半径5公里\r\n    let circleRadius = 5 * 1000 / metersPerUnit\r\n    let circle = new ol.geom.Circle(center, circleRadius)\r\n    let circleFeature = new ol.Feature(circle)\r\n    circleSource.addFeature(circleFeature)\r\n    addaddRandomCircle1(center,circleRadius,circle)\r\n    \r\n})\r\n\r\n\r\nasync function addaddRandomCircle1(center,circleRadius,circle){\r\n     onswitch=true\r\n     const eg=await topicEight()\r\n     const fi=await topicFive()\r\n     let vehicleData=xzcircle(circle,eg.concat(fi))\r\n     const ft= await addVideoData(center,circleRadius)\r\n     entList=vehicleData.concat(ft)\r\n     addEntities()\r\n     function graphicUpdate(){\r\n        removeEntities()\r\n        addaddRandomCircle1(center,circleRadius,circle)\r\n    }\r\n    //数据刷新时常\r\n    function startTimer() {\r\n        timerId = setTimeout(graphicUpdate, 15000);\r\n    }\r\n    startTimer();\r\n}\r\n\r\n// 出租车数据\r\nfunction topicEight(){\r\n    socket=new WebSocket('ws://10.223.178.107/wbsocket/topicEight/')//出租车\r\n    return new Promise((r)=>{\r\n        socket.onmessage=function(e){\r\n            let pointsInShenzhen = JSON.parse(e.data)\r\n            if(pointsInShenzhen.length>0){\r\n               socket.close();\r\n            }\r\n            r(pointsInShenzhen)   \r\n        }\r\n    })\r\n}\r\n\r\n//泥头车\r\nfunction topicFive(){\r\n    wbskfive=new WebSocket('ws://10.223.178.107/wbsocket/topicFive/')//泥头车\r\n    return new Promise((r)=>{\r\n        wbskfive.onmessage=function(e){\r\n            let circlejsonData =JSON.parse(e.data)\r\n            if(circlejsonData.length>0){\r\n               wbskfive.close();\r\n            }\r\n            r(circlejsonData)\r\n        }\r\n    })\r\n}\r\n\r\n//摄像头数据\r\nasync function addVideoData(center,circleRadius){\r\n   let dataurl = \"http://10.223.178.107/iserverMapDistance/iserver/services/data-TGIS/rest/data\";\r\n   let data = \"t-gis-base:cameraPositionInfo_P\";//摄像头（视频点位）\r\n   let point = new ol.geom.Point(center);\r\n   //过滤圆以外的数据    \r\n   let bufferParam = new Map2d.SDK.supermap.GetFeaturesByBufferParameters({\r\n        datasetNames: [data],\r\n        bufferDistance: circleRadius,\r\n        geometry: point,\r\n        toIndex: 0\r\n   });\r\n   return new Promise((r)=>{\r\n      new ol.supermap.FeatureService(dataurl).getFeaturesByBuffer(bufferParam, function (serviceResult){\r\n         let arr=[]\r\n         const ftdata = serviceResult.result.features.features\r\n         for(const i of ftdata){\r\n            const e=i.properties\r\n            const obj={\r\n                    id:e.ID,\r\n                    jd_name:e.JD_NAME,\r\n                    name:e.NAME,\r\n                    qu_name:e.QU_NAME,\r\n                    smid:e.SMID,\r\n                    smlibtileid:e.SMLIBTILEID,\r\n                    smuserid:e.SMUSERID,\r\n                    gpsTime: \"\",\r\n                    loadRating: 0,\r\n                    topic: \"\",\r\n                    vehicleNo: e.QU_NAME,\r\n                    vehicleTypeName: \"摄像头\",\r\n                    x: Number(e.SMX),\r\n                    y:Number(e.SMY) \r\n                }\r\n            arr.push(obj)\r\n         }\r\n         r(arr)\r\n         arr=[]\r\n     })\r\n   })\r\n}\r\n\r\n//限制在圆范围内 \r\nfunction xzcircle(c,d){\r\n return  d.filter(function(point) {\r\n    let lon = point.x;\r\n    let lat = point.y;\r\n    let pointInCircle = c.intersectsCoordinate([lon, lat]);\r\n    return pointInCircle;\r\n  });\r\n}\r\n\r\n\r\n// 窗口元素事件交互\r\nSandcastle.addToggleButton(\"关闭\", true, function (\r\n    checked\r\n) {\r\n    eliminate()\r\n});\r\n\r\n// 窗口元素事件交互\r\nSandcastle.addToggleButton(\"出租车\", true, function (\r\n    checked\r\n) {\r\n     addEntities('出租车',checked,true)\r\n});\r\n\r\n// 窗口元素事件交互\r\nSandcastle.addToggleButton(\"泥头车\", true, function (\r\n    checked\r\n    \r\n) {\r\n    addEntities('泥头车',checked,true)\r\n});\r\n// 摄像头窗口元素事件交互\r\nSandcastle.addToggleButton(\"摄像头\", true, function (\r\n    checked\r\n    \r\n) {\r\n    addEntities('摄像头',checked,true)\r\n});\r\n\r\nfunction addEntities(name='出租车',checked=true,i=false){\r\n    let arr2=[]\r\n    // 记录选中状态\r\n    obj[name]=checked\r\n    for(let key in obj){\r\n        if(obj[key]){\r\n          arr2.push(key)\r\n        }\r\n    }\r\n    if(i){\r\n       removeEntities()\r\n    }\r\n    //选中数据\r\n    const ent= entList.filter(item=>arr2.includes(item.vehicleTypeName))\r\n        for(let i=0;i<ent.length;i++){\r\n            const coordinates=[ent[i].x,ent[i].y];\r\n            let typeColor =ent[i].vehicleTypeName==='泥头车'?'green':ent[i].vehicleTypeName==='出租车'?'red':'blue'\r\n            const entity=new Map2d.Entity({\r\n                  position:coordinates,\r\n                  point:{\r\n                        pixelSize:5,\r\n                        color:typeColor\r\n                  },\r\n                  properties:ent[i]//赋值数据\r\n            });\r\n            //  billboard 添加的监听 绑定 click 事件\r\n            // entity.billboard.on(\"click\", (e) => {\r\n            //     console.log(\"handle entity click:\", e);\r\n            // });\r\n\r\n            entity.point.on(\"click\", (e) => {\r\n            isClick=true\r\n            console.log(\"handle entity click:\", e);\r\n            });\r\n            entitiesList.push(entity)\r\n            viewer.entities.add(entity);\r\n        }\r\n}\r\n\r\n// 移除\r\nfunction removeEntities(){\r\n    //移除所有\r\n    if(entitiesList.length===0) return\r\n    //单个移除\r\n    let i = entitiesList.length\r\n    while(i--){\r\n        const el = entitiesList[i]\r\n        viewer.entities.remove(el)\r\n    }\r\n   //移除所有\r\n    //  viewer.entities.removeAll()\r\n    \r\n}",
	// 		"imageId": "658295c34c8e7d19e0d92935",
	// 		"createTime": null,
	// 		"descInfo": "",
	// 		"status": "1",
	// 		"parentKey": "二维开发示例",
	// 		"sort": 1
	// 	}
	// ];
	// store.emit(TYPE_EXAMPLE_LIST, data)
}

requestIdleCallback(init)

export default store
