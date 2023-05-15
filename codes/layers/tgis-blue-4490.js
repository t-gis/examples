import * as Map2d from "map2d";

// 创建地图
const viewer = new Map2d.Viewer("map");

// 创建规资局 4490 蓝色图层
const imageryProvider = new Map2d.WebMapTileServiceImageryProvider({
    url: "http://10.223.178.107/api/t-gis/gw/OGC/Map/SZ_VEC_B4490/",
    tilingScheme: new Map2d.CustomTilingScheme({
        projection: new Map2d.CustomProjection({ code: "EPSG:4490" })
    }),
    layer: encodeURI("Blue_shenzhen"),
    tileMatrixSetID: encodeURI("EPSG:4490"),
    tileMatrixLabels: new Array(21).fill(0).map((item, index) => `EPSG:4490:${index}`),
    style: "default",
    format: "image/png",
    minimumLevel: 10
});

// 加载规资局 4490 蓝色图层
viewer.imageryLayers.addImageryProvider(imageryProvider);

// 跳转到深圳
viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});