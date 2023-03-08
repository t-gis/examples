import * as Map2d from "map2d";

const key = "4f8dc07442f4aad13d055fec8d01b4c8";
const uri = "http://t{0-7}.tianditu.gov.cn";

const img_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

const cia_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

// 创建地图
const viewer = new Map2d.Viewer("map");

viewer.imageryLayers.addImageryProvider(img_w);
viewer.imageryLayers.addImageryProvider(cia_w);

// 跳转到深圳
viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});