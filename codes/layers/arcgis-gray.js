import * as Map2d from "map2d";

const url = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/Tile/{z}/{y}/{x}"

// 创建 argis 图层
const arcgis = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url
    })
});

// 创建地图
const map = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
});