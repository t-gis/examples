import * as Map2d from "map2d";

// 创建 arcgis 图层
const arcgis = new Map2d.UrlTemplateImageryProvider({
    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/Tile/{z}/{y}/{x}"
});

// 创建地图
const viewer = new Map2d.Viewer("map", {
    imageryProvider: arcgis,
    mapZoom: 7
});

// 创建 html 字符串
const html = `
    <div style="
        border: 2px solid yellow; 
        border-radius: 50px; 
        width: 50px; height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
    ">
        <img style="width: 100%" src="./assets/icons/icon01.png" />
    </div>
`;

// 根据 html 字符串生成 canvas 对象
const canvas = await Map2d.htmlToCanvas(html);

// 创建 entity
const entity = viewer.entities.add({
    position: new Map2d.Position(114.06, 22.54),
    billboard: {
        image: canvas
    }
});
viewer.flyTo(entity);

// 更新 entity
// const updateHtml = `
//     <div style="
//         border: 2px solid green; 
//         border-radius: 50px; 
//         width: 50px; height: 50px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         padding: 15px;
//         box-sizing: border-box;
//     ">
//         <img style="width: 100%" src="./assets/icons/icon01.png" />
//     </div>
// `;
// const updateCanvas = await Map2d.htmlToCanvas(updateHtml);
// entity.billboard.image = updateCanvas;
