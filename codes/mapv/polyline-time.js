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
    mapProjection: new Map2d.WebMercatorProjection(),
    mapCenter: [
        ...ol.proj.transform([114.321317, 30.398428], 'EPSG:4326', 'EPSG:3857'),
        11
    ],
    mapZoom: 11
});

// 以下例子数据来源 mapv
const mapv = Map2d.SDK.mapv;
const map = viewer.map;

// 构造数据
fetch('./assets/data/wuhan-car')
    .then(resp => resp.text())
    .then(rs => {
        var data = [];
        var timeData = [];
        rs = rs.split("\n");
        var maxLength = 0;
        for (var i = 0; i < rs.length; i++) {
            var item = rs[i].split(',');
            var coordinates = [];
            if (item.length > maxLength) {
                maxLength = item.length;
            }
            for (j = 0; j < item.length; j += 2) {
                coordinates.push([item[j], item[j + 1]]);
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [item[j], item[j + 1]]
                    },
                    count: 1,
                    time: j
                });
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        }

        var dataSet = new mapv.DataSet(data);

        var mapvOptions = {
            strokeStyle: 'rgba(53,57,255,0.5)',
            coordType: 'bd09mc',
            // globalCompositeOperation: 'lighter',
            shadowColor: 'rgba(53,57,255,0.2)',
            shadowBlur: 3,
            lineWidth: 3.0,
            draw: 'simple'
        };

        var options = {
            map: map, dataSet: dataSet, mapvOptions: mapvOptions, attributions: ''
        };

        map.addLayer(new ol.layer.Image({
            source: new ol.source.Mapv(options)
        }));

        var dataSet = new mapv.DataSet(timeData);

        var mapvOptions = {
            fillStyle: 'rgba(255, 250, 250, 0.2)',
            coordType: 'bd09mc',
            globalCompositeOperation: "lighter",
            size: 1.5,
            animation: {
                stepsRange: {
                    start: 0,
                    end: 100
                },
                trails: 3,
                duration: 5,
            },
            draw: 'simple'
        };

        var options = {
            map: map, dataSet: dataSet, mapvOptions: mapvOptions
        };

        map.addLayer(new ol.layer.Image({
            source: new ol.source.Mapv(options)
        }));
    })
