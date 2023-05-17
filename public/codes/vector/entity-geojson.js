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

// 添加 Tooltip
const addTooltip = (options) => {
    return viewer.addPopup({
        position: options.position,
        offset: [0, -20],
        origin: "bottom-center",
        html: `
            <div style='background-color: rgba(255,255,255,0.9); border-radius: 4px; position: relative;'>
                <div style="color: #000; padding: 8px 16px; white-space: nowrap;">${options.text}</div>
                <div style="position: absolute; left: 50%; transform: translateX(-50%); border: 6px solid; border-color: white transparent transparent transparent;"></div>
            </div>
        `
    });
}

let tooltip = null;

dataSource.entities.values.forEach(entity => {
    entity.polygon.on("mouseover", e => {
        const { centroid, name } = e.properties;
        if (!tooltip) {
            tooltip = addTooltip({
                position: Map2d.Position.fromArray(centroid),
                text: name
            });
        }
    })
    entity.polygon.on("mouseout", e => {
        if (tooltip) {
            tooltip.destroy();
            tooltip = null;
        }
    })
})