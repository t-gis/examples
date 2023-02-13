import * as Map3d from "map3d";

// 创建 osm 图层
const osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// 创建地图
const map = new Map2d.Viewer("map", {
    imageryProvider: osm,
});