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
    polygon: {
        width: 2,
        material: "rgba(44, 44, 44, 0.5)",
        outline: true,
        outlineWidth: 4,
        outlineColor: "rgba(11, 11, 11, 1)",
        positions: [
            new Map2d.Position(114.06, 22.54),
            new Map2d.Position(114.07, 22.51),
            new Map2d.Position(114.05, 22.52),
        ]
    }
});
viewer.entities.add(entity);
viewer.flyTo(entity);

// 绑定 click 事件
entity.polygon.on("click", (e) => {
    console.log("handle entity click:", e);
});

// 绑定 mouseover 事件
entity.polygon.on("mouseover", (e) => {
    console.log("handle entity mouseover:", e);
});

// 绑定 mouseout 事件
entity.polygon.on("mouseout", (e) => {
    console.log("handle entity mouseout:", e);
});

// 窗口元素事件交互
Sandcastle.addToggleButton("是否显示", true, function (
    checked
) {
    entity.polygon.show = checked;
});