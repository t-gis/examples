import * as Map2d from "map2d";

// 创建 arcgis 图层
const arcgis = new Map2d.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/Tile/{z}/{y}/{x}"
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
    mapZoom: 7
});

// 添加 geojson 数据
const dataSource = await viewer.dataSources.add(Map2d.GeoJsonDataSource.load("./assets/data/guangdong.json", {
    stroke: "red",
    fill: "yellow",
    strokeWidth: 2,
}));

// 改变 geojson 的样式
// dataSource.entities.values.forEach(entity => {
//     entity.polygon.material = "green";
//     entity.polygon.outlineColor = "yellow";
//     entity.polygon.outlineWidth = "5";
// })