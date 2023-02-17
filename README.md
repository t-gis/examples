## 更新 2023-02-17 11:41:37 星期五
1、添加了聚合功能
2、压缩了 examples 里面的图片

## 更新 2023-01-31 11:47:56 星期二
1、修改了 Viewer 构造逻辑
（1）、添加 options.iNetHooks 选项，互联网环境 hooks 配置 , viewer 创建完成后触发、默认逻辑待指定
（2）、添加 options.gLANNetHooks 选项，政务内网环境 hooks 配置 , viewer 创建完成后触发、默认逻辑：添加天地图白色底图、叠加规资局 4490 白色底图
（3）、添加 options.gINetHooks 选项，政务外网环境 hooks 配置 , viewer 创建完成后触发、、默认逻辑待指定

## 更新 2023-01-12 18:08:18 星期四
1、添加 TianDiService.queryPOI 根据关键字查询 poi

## 更新 2023-01-07 12:32:45 星期六
1、DrawHandler 增加 resultFomatter
2、MeasureHandler 增加 resultFomatter

## 更新 2023-01-06 14:31:44 星期五
1、增加服务图例查询方法
2、ImageryProvider.getLegends

## 更新 2022-12-22 16:53:24 星期四
### 增加超图 Mvt 图层
1、添加了 MvtProvider

## 更新 2022-10-31 12:55:00 星期一
### 增加了 examples 目录，该目录用 vite 打包，需要启静态服务才能预览

## 更新 2022-10-27 16:10:12 星期四
### 增加了规资局相关服务
1、根据空间范围统计POI信息：Map2d.Service.TGisService.queryPOIByRegion
2、根据空间范围查询POI的类型：Map2d.Service.TGisService.queryPOITypesByRegion
3、根据空间范围统计POI的类型和数量：Map2d.Service.TGisService.queryPOITypesAndNumByRegion
4、逆地理编码：Map2d.Service.TGisService.regeo
5、地理编码：Map2d.Service.TGisService.geo
6、地址地名模糊检索：Map2d.Service.TGisService.search

## 更新 2022-10-25 16:20:21 星期二
1、增加了 TianDiService 天地图地理编码和逆地理编码 API

## 更新 2022-10-17 20:58:42 星期一
1. 增加了 MeasureHandler
2. 增加了 DrawHandler

## 大更新 2022-10-11 10:07:43 星期二
1. gis.map2d.min.js 更名为 map2d.iife.js
2. 增加模块化输出 map2d.es.js map2d.umd.js, 更好的融合 vue 或 react
3. 使用新的 map2d 可减少之前的 script 标签引入，都打包到一起了
4. 兼容之前的 Map2D，之前的 Map2D 相关的 api 不做新增，只做维护


## 注意 2022-10-11 10:10:53 星期二
#### 新 api 入口变量名为 Map2d(注意 d 是小写的，区别于之前的 Map2D)