import * as Map3d from "map3d";
// 注意 ！！！
// 注意 ！！！
// 注意 ！！！
// 使用 mvt 图层时，需要引入 supermap 插件

/**
 * 1、在 Cesium.js 之前引入 ./Cesium/ThirdParty/supermap/Supermap.iife.js
 * 2、如果在 iframe 下开发，紧接着需加入 window.top.Supermap = window.Supermap;
 */

// 放大到深圳边界视图
Map3d.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle(
    1.983072268381204,
    0.3873200001523347,
    2.0013747592286615,
    0.39987761942571864
);
Map3d.Camera.DEFAULT_VIEW_FACTOR = 0;

// 创建地球
const viewer = new Map3d.Viewer("map");

// 拾取 mvt 图层属性时要开启深度检测
viewer.scene.globe.depthTestAgainstTerrain = true;

// 加载 mvt 图层
const url = "http://121.37.97.131:8090/iserver/services/map-TGIS/restjsr/v1/vectortile/maps/LINK_MARS";
viewer.scene.addVectorTilesMap({
    url: url,
    canvasWidth: 512,
    name: 'testMVT',
    viewer: viewer
});

// 拾取 mvt 图层属性
viewer.selectedEntityChanged.addEventListener(function (entity) {
    if (entity) {
        const props = entity.properties.getValue(Cesium.JulianDate.now())
        console.log("props:", props);
    }
});