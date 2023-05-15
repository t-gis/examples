import * as Map2d from "map2d";

// 创建地图
const viewer = new Map2d.Viewer("map", {
    mapZoom: 9
});

// 天地图参数
const key = "4f8dc07442f4aad13d055fec8d01b4c8";
const uri = "http://t{0-7}.tianditu.gov.cn";

// 天地图底图
const vec_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + key + ""
});
viewer.imageryLayers.addImageryProvider(vec_w);

// 天地图注记
const cva_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + key + ""
});
viewer.imageryLayers.addImageryProvider(cva_w);

// 创建样本数据
const count = 100;
const dataSource = new Map2d.CustomDataSource("cluster");
for (let i = 0; i < count; ++i) {
    const coordinates = [113.55555 + Math.random(), 22.55555 + Math.random()];
    const entity = new Map2d.Entity({
        position: coordinates,
        point: {
            pixelSize: 10,
            color: "red"
        }
    });
    // 添加样本数据
    dataSource.entities.add(entity);
}

// 开启聚合效果
const dataSourcePromise = viewer.dataSources.add(dataSource);
dataSourcePromise.then(dataSource => {
    dataSource.clustering.enabled = true;
})