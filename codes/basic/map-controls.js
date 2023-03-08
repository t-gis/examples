import * as Map2d from "map2d";

// 创建 osm 图层
const osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: osm,
    controls: [
        // 平移控件
        new Map2d.TranslateControl(),

        // 滑动放大缩小控件
        new Map2d.ZoomSliderControl(),

        // 刻度线控件
        new Map2d.ScaleLineControl(),
    ]
});

viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});