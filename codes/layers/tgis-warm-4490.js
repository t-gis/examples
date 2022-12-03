const key = "4f8dc07442f4aad13d055fec8d01b4c8";
const uri = "http://t{0-7}.tianditu.gov.cn";

const vec_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

const cva_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

// 创建地图
const viewer = new Map2d.Viewer("map");
viewer.imageryLayers.addImageryProvider(vec_w);
viewer.imageryLayers.addImageryProvider(cva_w);

// 注意要将地图的投影设置成 4490, 要不然加载不出来
const view = new ol.View({
    projection: ol.proj.get("EPSG:4490"),
    center: [114.06, 22.65],
    zoom: 10
});
viewer.map.setView(view);

// 加载规资局 4490 白色图层
const imageryProvider = new Map2d.WebMapTileServiceImageryProvider({
    url: "http://10.223.178.107/api/t-gis/gw/OGC/Map/SZ_CVA_W4490/",
    tilingScheme: new Map2d.CustomTilingScheme({
        projection: new Map2d.CustomProjection({ code: "EPSG:4490" })
    }),
    layer: encodeURI("w_shenzhen"),
    tileMatrixSetID: encodeURI("EPSG:4490"),
    tileMatrixLabels: new Array(21).fill(0).map((item, index) => `EPSG:4490:${index}`),
    style: "default",
    format: "image/png",
    minimumLevel: 10
});
viewer.imageryLayers.addImageryProvider(imageryProvider);