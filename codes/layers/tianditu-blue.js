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
const map = new Map2d.Viewer("map");

map.imageryLayers.addImageryProvider(img_w);
map.imageryLayers.addImageryProvider(cia_w);