import * as Map2d from "map2d";

// 创建 osm 图层
const arcgis = new Map2d.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/Tile/{z}/{y}/{x}"
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
    controls: [
        new Map2d.MousePositionControl()
    ]
});

// 定位到动画视角
viewer.camera.flyTo({
    destination: new Map2d.Position(114.07806300, 22.65422553)
})


// 创建轨迹回放线
const line = new Map2d.TrackLine(viewer.camera, {
    speed: 300,
    positions: [
        new Map2d.Position(114.0938, 22.5416),
        new Map2d.Position(114.12571, 22.729296),
        new Map2d.Position(113.98021, 22.7500824),
    ],
    moveMarker: new Map2d.Entity({
        billboard: {
            image: "./assets/icons/icon01.png",
            pixelOffset: [0.5, 1]
        },
    }),
    startMarker: new Map2d.Entity({
        billboard: {
            image: "./assets/icons/icon01.png",
            pixelOffset: [0.5, 1]
        }
    }),
    endMarker: new Map2d.Entity({
        billboard: {
            image: "./assets/icons/icon02.png",
            pixelOffset: [0.5, 1]
        }
    }),
    autoSetView: false,
    autoFollowView: false
});

Sandcastle.addToggleButton("是否播放", false, function (
    checked
) {
    if(checked) {
        line.start()
    } else {
        line.stop()
    }
});

// 停止回放
// line.stop()

// 销毁
// line.destroy()