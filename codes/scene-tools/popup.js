import * as Map2d from "map2d";

const url = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/Tile/{z}/{y}/{x}"

// 创建 argis 图层
const arcgis = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url
    })
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
});

// 创建弹窗位置
const position = new Map2d.Position(114.0295, 22.609875);

// 设置镜头位置
viewer.camera.flyTo({
    destination: position
})

// 创建弹窗
const popup = viewer.addPopup({
    position: position,
    offset: [0, 0],
    html: `
        <div id='test' style='background: white;'>
            <header style='padding: 10px 20px; background: rgba(0,0,0,0.2)'>
                header
            </header>
            <main style='padding: 20px;'>
                <div>...contentcontentcontent</div>
                <div>...contentcontentcontent</div>
                <div>...contentcontentcontent</div>
            </main>
        </div>
    `
});

// 设置位置
// popup.position = new Map2d.Position(114.3295, 22.639875);

// 设置偏移
// popup.offset = [15, 15];

// 销毁弹窗
// popup.destroy()