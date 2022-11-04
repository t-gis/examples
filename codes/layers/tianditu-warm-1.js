import * as Map2d from "map2d";

const uri = "http://10.223.178.107/api/t-gis/tdtd";

const vec_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk="
});

const cva_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk="
});

// 创建地图
const map = new Map2d.Viewer("map");

map.imageryLayers.addImageryProvider(vec_w);
map.imageryLayers.addImageryProvider(cva_w);