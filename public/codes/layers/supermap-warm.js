import * as Map2d from "map2d";

// 创建超图白色图层
let imageryProvider = new Map2d.SuperMapImageryProvider({
    url: `http://121.37.97.131:8090/iserver/services/map-GD/rest/maps/${encodeURIComponent('深圳')}`
});

// 创建地图
let viewer = new Map2d.Viewer("map", {
    imageryProvider
});

// 定位到深圳
viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});