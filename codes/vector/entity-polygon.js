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