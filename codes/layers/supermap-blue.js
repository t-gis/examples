import * as Map2d from "map2d";

// 创建超图蓝色色图层
let imageryProvider = new Map2d.SuperMapImageryProvider({
    url: `http://121.37.97.131:8090/iserver/services/map-SZ/rest/maps/SZ`
});

// 创建地图
let viewer = new Map2d.Viewer("map", {
    imageryProvider
});

viewer.camera.flyTo({
    destination: new Map2d.Position(114.14347633526161, 22.63403261589422,)
});