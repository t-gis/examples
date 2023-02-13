import * as Map3d from "map3d";

// 创建超图白色图层
// 放大到深圳边界视图
Map3d.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle(
    1.983072268381204, 
    0.3873200001523347, 
    2.0013747592286615, 
    0.39987761942571864
);
Map3d.Camera.DEFAULT_VIEW_FACTOR = 0;

const url = `http://121.37.97.131:8090/iserver/services/map-GD/rest/maps/${encodeURIComponent('深圳')}`;

// 创建地球
const viewer = new Map3d.Viewer("map", {
    imageryProvider: new Map3d.SuperMapImageryProvider({
        url
    })
});