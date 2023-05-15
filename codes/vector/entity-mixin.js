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

// 创建 entity
const entity = new Map2d.Entity({
    position: new Map2d.Position(114.06, 22.54),
    label: {
        font: '24px sans-serif',
        text: "xxxxx",
        fillColor: '#000',
        outlineColor: "red",
        outlineWidth: 0,
        showBackground: true,
        pixelOffset: [0, -50],
        backgroundOutlineWidth: 0,
        backgroundOutlineColor: "green"
    },
    point: {
        pixelSize: 10
    },
    billboard: {
        image: "./assets/icons/icon01.png",
        scale: 1,
        opacity: 1
    },
});
viewer.entities.add(entity);
viewer.flyTo(entity);

// 窗口元素事件交互
Sandcastle.addToggleButton("是否显示", true, function (
    checked
) {
    entity.show = checked;
});