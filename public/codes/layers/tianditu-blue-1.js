import * as Map2d from "map2d";

const uri = "http://10.223.178.107/api/t-gis/tdtd";

const img_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=img_w&x={x}&y={y}&l={z}&tk="
});

const cia_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk="
});

// 创建地图
const viewer = new Map2d.Viewer("map");

viewer.imageryLayers.addImageryProvider(img_w);
viewer.imageryLayers.addImageryProvider(cia_w);

// 跳转到深圳
viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});