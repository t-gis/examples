import * as Map2d from "map2d";

// 创建地图
const viewer = new Map2d.Viewer("map");

// 天地图参数
const uri = "http://10.223.178.107/api/t-gis/tdtd";

// 天地图底图
const vec_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk="
});
viewer.imageryLayers.addImageryProvider(vec_w);

// 天地图注记
const cva_w = new Map2d.UrlTemplateImageryProvider({
    url: uri + "/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk="
});
viewer.imageryLayers.addImageryProvider(cva_w);

// 定位到深圳
viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});

const map = viewer.map;

// 添加 mvt 图层
// 1、准备 style URL
const styleURL = "http://10.223.178.107/api/t-gis/iserver/services/map-TGIS_Static/restjsr/v1/vectortile/maps/道路路网/style.json";

// 2、创建 mapbox style
const style = new ol.supermap.MapboxStyles({
    style: encodeURI(styleURL),
    map: map
});

// 3、load style
style.on("styleloaded", () => {
    vectorLayer = new ol.layer.VectorTile({
        declutter: true,
        source: new ol.source.VectorTileSuperMapRest({
            style: encodeURI(styleURL),
            projection: 'EPSG:4326',
            format: new ol.format.MVT({
                featureClass: ol.Feature
            })
        }),
        style: style.getStyleFunction()
    });
    map.addLayer(vectorLayer);
})

// 4、get properties
map.on('pointermove', function (e) {
    const features = map.getFeaturesAtPixel(e.pixel);
    if (!features || features.length === 0) {
        return;
    }

    const props = features[0].getProperties()
    console.log("props:", props);
});