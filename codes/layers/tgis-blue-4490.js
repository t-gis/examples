import * as Map3d from "map3d";

// 放大到深圳边界视图
Map3d.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle(
    1.983072268381204,
    0.3873200001523347,
    2.0013747592286615,
    0.39987761942571864
);
Map3d.Camera.DEFAULT_VIEW_FACTOR = 0;

const url = `http://10.223.178.107/api/t-gis/gw/OGC/Map/SZ_VEC_B4490/rest/Blue_shenzhen/EPSG:4326/EPSG:4326:{z}/{y}/{x}?format=image/png`;

// 创建地球
const viewer = new Map3d.Viewer("map", {
    imageryProvider: new Map3d.UrlTemplateImageryProvider({
        url,
        tilingScheme: new Map3d.GeographicTilingScheme(),
        minimumLevel: 0,
        customTags: {
            sz: function (imageryProvider, x, y, level) {
                return level - 9;
            }
        }
    })
});