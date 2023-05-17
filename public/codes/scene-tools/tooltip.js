// 创建 argis 图层
const arcgis = new Map2d.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/Tile/{z}/{y}/{x}"
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
});

// 创建弹窗位置
const position = new Map2d.Position(114.0295, 22.609875);

// 添加信息弹窗
const addPopup = (position) => {
    return viewer.addPopup({
        position: position,
        offset: [0, -20],
        origin: "bottom-center",
        html: `
            <div style='background: #fff; border-radius: 4px; position: relative;'>
                <div style="color: #000; padding: 8px 16px; white-space: nowrap;">Tooltip</div>
                <div style="position: absolute; left: 50%; transform: translateX(-50%); border: 6px solid; border-color: white transparent transparent transparent;"></div>
            </div>
        `
    });
}

// 添加固定点
const pointEntity = viewer.entities.add({
    position,
    point: {
        pixelSize: 10,
        color: "#fff"
    }
});
let popup = null;

// 绑定 mousemove 事件
pointEntity.point.on("mousemove", (e) => {
    if (!popup) {
        popup = addPopup(position);
    }
})

// 绑定 mouseout
pointEntity.point.on("mouseout", (e) => {
    if (popup) {
        popup.destroy();
        popup = null;
    }
})