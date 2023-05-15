import * as Map2d from "map2d";

// 创建地图
const viewer = new Map2d.Viewer("map");

// 天地图参数
const uri = "http://10.223.178.107/api/t-gis/tdtd";

// 天地图底图
const img_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=img_w&x={x}&y={y}&l={z}&tk="
});
viewer.imageryLayers.addImageryProvider(img_w);

// 天地图注记
const cia_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk="
});
viewer.imageryLayers.addImageryProvider(cia_w);

// 跳转到深圳
viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});