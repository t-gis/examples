import * as Map3d from "map3d";

// 创建 osm 图层
const osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: osm,
});

// 创建测量处理器
const measureHandler = new Map2d.MeasureHandler(viewer);

// 角度测量
measureHandler.start({ type: Map2d.MeasureType.ANGLE });

// 绑定测量监听
measureHandler.on("end", (e) => {
    console.log("end e:", e.target.getCoordinates());
})

Sandcastle.addToolbarMenu([
    {
        text: "角度测量",
        onselect: function () {
            measureHandler.start({ type: Map2d.MeasureType.ANGLE });
        },
    },
    {
        text: "点测量",
        onselect: function () {
            measureHandler.start({ type: Map2d.MeasureType.POINT });
        },
    },
    {
        text: "长度测量",
        onselect: function () {
            measureHandler.start({ type: Map2d.MeasureType.LENGTH });
        },
    },
    {
        text: "面积测量",
        onselect: function () {
            measureHandler.start({ type: Map2d.MeasureType.AREA });
        },
    },
])
