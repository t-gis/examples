import * as Map2d from "map2d";

const uri = "http://10.223.178.107/api/t-gis/tdtd";

const img_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=img_w&x={x}&y={y}&l={z}&tk="
});

const cia_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk="
});

// 创建地图
const map = new Map2d.Viewer("map");

map.imageryLayers.addImageryProvider(img_w);
map.imageryLayers.addImageryProvider(cia_w);