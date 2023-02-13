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

// 创建 entity
const entity = new Map3d.Entity({
    polygon: {
        width: 2,
        material: Map3d.Color.RED,
        hierarchy: Map3d.Cartesian3.fromDegreesArray([114.06, 22.54, 114.07, 22.51, 114.05, 22.52])
    }
});
viewer.entities.add(entity);
viewer.flyTo(entity);

// 窗口元素事件交互
Sandcastle.addToggleButton("是否显示", true, function (
    checked
) {
    entity.polyline.show = checked;
});