import * as Map2d from "map2d";

const key = "4f8dc07442f4aad13d055fec8d01b4c8";
const uri = "http://t{0-7}.tianditu.gov.cn";

const vec_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

const cva_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + key + ""
});

// 创建地图
const viewer = new Map2d.Viewer("map");
viewer.imageryLayers.addImageryProvider(vec_w);
viewer.imageryLayers.addImageryProvider(cva_w);

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