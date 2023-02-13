import * as Map3d from "map3d";

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
    mapCenter: [104.912777, 34.730746, 4]
});

// 以下例子数据来源 mapv
const mapv = Map2d.SDK.mapv;
const map = viewer.map;

var randomCount = 1000;
var data = [];
var citys = ["北京","天津","上海","重庆","石家庄","太原","呼和浩特","哈尔滨","长春","沈阳","济南","南京","合肥","杭州","南昌","福州","郑州","武汉","长沙","广州","南宁","西安","银川","兰州","西宁","乌鲁木齐","成都","贵阳","昆明","拉萨","海口"];

// 构造数据
while (randomCount--) {
    var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
    data.push({
        geometry: {
            type: 'Point',
            coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
        },
        count: 30 * Math.random(),
        time: 100 * Math.random()
    });
}

var dataSet = new mapv.DataSet(data);

var options = {
    size: 13,
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
    max: 60,
    animation: {
        type: 'time',
        stepsRange: {
            start: 0,
            end: 100
        },
        trails: 10,
        duration: 4,
    },
    draw: 'heatmap'
}

map.addLayer(new ol.layer.Image({
    source: new ol.source.Mapv({
        map: map,
        dataSet: dataSet,
        mapvOptions: options
    })
}));