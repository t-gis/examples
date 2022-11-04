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
    mapCenter: [104.912777, 34.730746, 4]
});

// 以下例子数据来源 mapv
const mapv = Map2d.SDK.mapv;
const map = viewer.map;


var data = [];
var timeData = [];
function curive(fromPoint, endPoint, n) {
    var delLng = (endPoint.lng - fromPoint.lng) / n;
    var delLat = (endPoint.lat - fromPoint.lat) / n;

    for (var i = 0; i < n; i++) {
        var pointNLng = fromPoint.lng + delLng * i;
        var pointNLat = fromPoint.lat + delLat * i;
        timeData.push({
            geometry: {
                type: 'Point',
                coordinates: [pointNLng, pointNLat]
            },
            count: 1,
            time: i
        });
    }
}

// 构造数据
fetch('https://iclient.supermap.io/examples/data/qianxi-time')
    .then(resp => resp.text())
    .then(rs => {
        var items = rs.split('|');
        var count = 20;
        for (var i = 0; i < items.length; i++) {
            var itemArr = items[i].split(/\n/);
            for (var k = 0; k < itemArr.length; k++) {
                if (!!itemArr[k]) {
                    var item = itemArr[k].split(/\t/);
                    if (item[0] === '起点城市' || item[0] === '迁出城市') {
                        var cityBegin = item[1];
                    }
                    if (item[0] !== '起点城市' || item[0] !== '迁出城市' && item.length > 1) {
                        var cityCenter1 = mapv.utilCityCenter.getCenterByCityName(item[0].replace(/市|省/, ""));
                        var cityCenter2 = mapv.utilCityCenter.getCenterByCityName(cityBegin.replace(/市|省/, ""));
                        if (cityCenter1) {
                            if (Math.random() > 0.7) {
                                curive(cityCenter2, cityCenter1, 50);
                            }
                            data.push({
                                geometry: {
                                    type: 'LineString',
                                    coordinates: [[cityCenter1.lng, cityCenter1.lat], [cityCenter2.lng, cityCenter2.lat]]
                                },
                                count: 100 * Math.random()
                            });
                        }
                    }
                }
            }
        }

        var dataSet = new mapv.DataSet(data);
        var options = {
            strokeStyle: 'rgba(55, 50, 250, 0.3)',
            globalCompositeOperation: 'lighter',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            methods: {
                click: function (item) {
                }
            },
            gradient: { 0: 'rgba(55, 50, 250, 0)', 1: 'rgba(55, 50, 250, 1)' },
            lineWidth: .2,
            draw: 'intensity'
        }

        map.addLayer(new ol.layer.Image({
            source: new ol.source.Mapv({
                map: map,
                dataSet: dataSet,
                mapvOptions: options
            })
        }));

        var dataSet = new mapv.DataSet(timeData);
        var options = {
            fillStyle: 'rgba(255, 250, 250, 0.9)',
            size: .5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 50
                },
                trails: 1,
                duration: 5,
            },
            draw: 'simple'
        }
        map.addLayer(new ol.layer.Image({
            source: new ol.source.Mapv({
                map: map,
                dataSet: dataSet,
                mapvOptions: options
            })
        }));
    })
