import * as Map3d from "map3d";

// arcgis 底图服务链接
const url = "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer"

// 创建地球
const viewer = new Map3d.Viewer("map", {
    // 初始化图层为 arcgis 底图
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url
    })
})