import * as Map2d from "map2d";

// 创建 argis 图层
const arcgis = new Map2d.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/Tile/{z}/{y}/{x}"
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
});

viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});