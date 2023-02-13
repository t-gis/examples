import * as Map3d from "map3d";

const tdtUrl = "http://10.223.178.107/api/t-gis/tdtd/";

const token = "8c451574e69800c7fee48a6d4ecfbdb7";
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

// 底图
const vec_w = new Map3d.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains,
    tilingScheme: new Map3d.WebMercatorTilingScheme(),
    maximumLevel: 18
});

// 注记
const cva_w = new Map3d.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains,
    tilingScheme: new Map3d.WebMercatorTilingScheme(),
    maximumLevel: 18
});
viewer.imageryLayers.addImageryProvider(vec_w);
viewer.imageryLayers.addImageryProvider(cva_w);