import * as Map2d from "map2d";

// 创建 arcgis 图层
const arcgis = new Map2d.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/Tile/{z}/{y}/{x}"
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
});

// 创建绘制处理器
const drawHandler = new Map2d.DrawHandler(viewer);

// 角度绘制
drawHandler.start({ type: Map2d.DrawType.ANGLE });

// 绑定绘制监听
drawHandler.on("end", (e) => {
    console.log("end e:", e.target.getCoordinates());
})

Sandcastle.addToolbarMenu([
    {
        text: "角度绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.ANGLE });
        },
    },
    {
        text: "点绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.POINT });
        },
    },
    {
        text: "线绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.POLYLINE });
        },
    },
    {
        text: "面绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.POLYGON });
        },
    },
    {
        text: "矩形绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.RECTANGLE });
        },
    },
    {
        text: "正方形绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.SQUARE });
        },
    },
    {
        text: "圆绘制",
        onselect: function () {
            drawHandler.start({ type: Map2d.DrawType.CIRCLE });
        },
    },
])
