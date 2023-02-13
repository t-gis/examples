import * as Map3d from "map3d";

// 创建地球
const viewer = new Map3d.Viewer("map");

const token = "8c451574e69800c7fee48a6d4ecfbdb7";
const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

// 底图
const img_w = new Map3d.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains,
    tilingScheme: new Map3d.WebMercatorTilingScheme(),
    maximumLevel: 18
});

// 注记
const cia_w = new Map3d.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains,
    tilingScheme: new Map3d.WebMercatorTilingScheme(),
    maximumLevel: 18
});
viewer.imageryLayers.addImageryProvider(img_w);
viewer.imageryLayers.addImageryProvider(cia_w);