import * as Map2d from "map2d";

const key = "4f8dc07442f4aad13d055fec8d01b4c8";
const uri = "http://t{0-7}.tianditu.gov.cn";

const vec_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

const cva_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    mapZoom: 7
});
viewer.imageryLayers.addImageryProvider(vec_w);
viewer.imageryLayers.addImageryProvider(cva_w);

// 添加 geojson 数据
viewer.dataSources.add(Map2d.GeoJsonDataSource.load("./assets/data/guangdong.json", {
    stroke: "red",
    fill: "yellow",
    strokeWidth: 2,
}));