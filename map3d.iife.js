/**
 *  ██████████   ████████  ██  ████████
 * ░░░░░██░░░   ██░░░░░░██░██ ██░░░░░░ 
 *     ░██     ██      ░░ ░██░██       
 *     ░██    ░██         ░██░█████████
 *     ░██    ░██    █████░██░░░░░░░░██
 *     ░██    ░░██  ░░░░██░██       ░██
 *     ░██     ░░████████ ░██ ████████ 
 *     ░░       ░░░░░░░░  ░░ ░░░░░░░░  
 * name: tgis-3d
 * version: v0.0.4
 * description: tgis map3d
 * author: tgis
 * time: 2023年2月13日 13:20:32
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var Map3d = function(exports, cesium) {
  "use strict";
  class BaseControl {
  }
  class ControlCollection {
    constructor(owner) {
      this.owner = owner;
    }
  }
  class Util {
    static string2html(htmlString) {
      return new DOMParser().parseFromString(htmlString, "text/html").body.childNodes[0];
    }
  }
  class ImagerySplit extends BaseControl {
    constructor(viewer2, imageryLayer, direction) {
      super();
      __publicField(this, "direction", Cesium.ImagerySplitDirection.LEFT);
      this.viewer = viewer2;
      this.imageryLayer = imageryLayer;
      this.direction = direction;
      this.init();
    }
    get splitEl() {
      const wrap = this.viewer.container;
      let splitEl = wrap.querySelector(".tgis-map3d-control-imagery_split");
      if (!splitEl) {
        splitEl = Util.string2html(`<div style="display: none; position:" class="tgis-map3d-control-imagery_split"><div class="tgis-map3d-control-split_btn"></div></div>`);
        wrap.insertAdjacentElement("beforeend", splitEl);
      }
      return splitEl;
    }
    displaySplitEl(show) {
      this.splitEl.style.display = show ? "block" : "none";
    }
    init() {
      this.displaySplitEl(true);
      this.initSplitBtnEvent();
      this.imageryLayer.splitDirection = this.direction;
      this.updateImagerySplitPosition();
    }
    initSplitBtnEvent() {
      const wrap = this.viewer.container;
      let down = false;
      this.onMousedown = () => down = true;
      this.onPointermove = (e) => {
        if (down) {
          this.splitEl.style.left = `${e.clientX}px`;
          this.updateImagerySplitPosition();
        }
      };
      this.onMouseup = () => down = false;
      wrap.addEventListener("mousedown", this.onMousedown);
      wrap.addEventListener("pointermove", this.onPointermove);
      wrap.addEventListener("mouseup", this.onMouseup);
    }
    updateImagerySplitPosition() {
      const { viewer: viewer2 } = this;
      viewer2.scene.imagerySplitPosition = this.splitEl.offsetLeft / this.splitEl.parentElement.offsetWidth;
    }
    destroy() {
      this.displaySplitEl(false);
      const { viewer: viewer2 } = this;
      const wrap = viewer2.container;
      this.onMousedown && wrap.removeEventListener("mousedown", this.onMousedown);
      this.onPointermove && wrap.removeEventListener("pointermove", this.onPointermove);
      this.onMouseup && wrap.removeEventListener("mouseup", this.onMouseup);
      viewer2.imageryLayers.remove(this.imageryLayer);
    }
  }
  class Format {
    constructor() {
      if (new.target === Format) {
        return new Cesium.DeveloperError("Format \u662F\u62BD\u8C61\u7C7B\uFF0C\u4E0D\u80FD\u88AB\u5B9E\u4F8B\u5316");
      }
    }
    read(data) {
    }
    write(object) {
    }
  }
  class GMLFormat extends Format {
    constructor() {
      super(...arguments);
      __publicField(this, "parser", new DOMParser());
      __publicField(this, "GEONODENAMES", ["geometryproperty", "shape", "the_geom"]);
    }
    read(gmlStr) {
      return this.parseGML(gmlStr);
    }
    write() {
    }
    parseGML(str) {
      const geojson = {
        type: "FeatureCollection",
        features: []
      };
      const xmlDoc = this.parser.parseFromString(str, "text/xml");
      const featureCollectionEle = xmlDoc.children[0];
      if (!featureCollectionEle || !featureCollectionEle.nodeName || this.getNodeName(featureCollectionEle).indexOf("featurecollection") === -1) {
        return geojson;
      }
      let i2 = 0;
      const features = [];
      while (featureCollectionEle.children.item(i2)) {
        const featureEle = featureCollectionEle.children.item(i2);
        const nodeName = this.getNodeName(featureEle);
        if (nodeName.indexOf("featuremember") > -1 && featureEle.children[0]) {
          features.push(featureEle.children[0]);
        }
        i2++;
      }
      for (let i3 = 0, len = features.length; i3 < len; i3++) {
        const f = features[i3];
        const properties = this.getFeatureEleProperties(f);
        const geometry = this.getFeatureEleGeometry(f, properties.isShape);
        if (!geometry || !properties) {
          continue;
        }
        const feature = {
          type: "Feature",
          geometry,
          properties
        };
        geojson.features.push(feature);
      }
      return geojson;
    }
    getFeatureEleGeometry(featureEle, isShape) {
      const children = featureEle.children || [];
      let type;
      let coordinates = [];
      let parseFeture = false;
      for (let i2 = 0, len = children.length; i2 < len; i2++) {
        if (parseFeture) {
          break;
        }
        const node = children[i2];
        const nodeName = this.getNodeName(node);
        if (!this.isGeoAttribute(nodeName)) {
          continue;
        }
        if (node.children[0]) {
          type = node.children[0].nodeName.split("gml:")[1] || "";
          if (!type) {
            return;
          }
        }
        if (node.children[0] && node.children[0].children[0]) {
          const nodeName2 = this.getNodeName(node.children[0].children[0]);
          let geoNodes = node.children;
          if (this.isMulti(nodeName2)) {
            geoNodes = this.flatMultiGeoNodes(geoNodes);
          }
          if (!geoNodes.length) {
            return;
          }
          for (let j = 0, len1 = geoNodes.length; j < len1; j++) {
            const geoNode = geoNodes[j];
            let coords = this.parseGeoCoordinates(geoNode.children, isShape);
            if (!this.geoIsPolygon(type)) {
              coords = coords[0];
            }
            coordinates.push(coords);
            parseFeture = true;
          }
          if (coordinates.length === 1 && type.indexOf("Multi") === -1) {
            coordinates = coordinates[0];
          }
        }
      }
      if (!type || !coordinates.length) {
        return;
      }
      return {
        type,
        coordinates
      };
    }
    getFeatureEleProperties(featureEle) {
      const children = featureEle.children || [];
      const properties = {};
      let isShape = false;
      for (let i2 = 0, len = children.length; i2 < len; i2++) {
        const node = children[i2];
        const nodeName = this.getNodeName(node);
        if (this.isGeoAttribute(nodeName) && node.children.length) {
          if (nodeName.indexOf("shape") > -1) {
            isShape = true;
          }
          continue;
        }
        const key = this.getNodeName(node, false).split(":")[1];
        if (!key) {
          continue;
        }
        const value = node.textContent || "";
        properties[key] = value;
      }
      properties.isShape = isShape;
      return properties;
    }
    flatMultiGeoNodes(nodes) {
      const geoNodes = [];
      for (let i2 = 0, len = nodes.length; i2 < len; i2++) {
        const children = nodes[i2].children;
        for (let j = 0, len1 = children.length; j < len1; j++) {
          geoNodes.push(children[j].children[0]);
        }
      }
      return geoNodes;
    }
    isMulti(nodeName) {
      return nodeName.indexOf("member") > -1;
    }
    isGeoAttribute(nodeName) {
      for (let i2 = 0, len = this.GEONODENAMES.length; i2 < len; i2++) {
        if (nodeName.indexOf(this.GEONODENAMES[i2]) > -1) {
          return true;
        }
      }
      return false;
    }
    parseGeoCoordinates(coordNodes, isShape) {
      const coordiantes = [];
      for (let i2 = 0, len = coordNodes.length; i2 < len; i2++) {
        const coordNode = this.findCoordsNode(coordNodes[i2]);
        coordiantes.push(this.parseCoordiantes(coordNode.textContent, isShape));
      }
      return coordiantes;
    }
    parseCoordiantes(text, isShape) {
      if (!text) {
        return;
      }
      const split = " ";
      const coords = text.split(split);
      let [c1, c2] = coords;
      if (c1.indexOf(",") > -1) {
        const coordinates = [];
        for (let i2 = 0, len = coords.length; i2 < len; i2++) {
          const c = coords[i2];
          let [lng, lat] = c.split(",");
          lng = this.trim(lng);
          lat = this.trim(lat);
          coordinates.push([lng, lat]);
        }
        return coordinates.length > 1 ? coordinates : coordinates[0];
      } else {
        c1 = this.trim(c1);
        c2 = this.trim(c2);
        if (isShape) {
          return [c2, c1];
        }
        return [c1, c2];
      }
    }
    trim(str) {
      const BLANK = " ";
      while (str.indexOf(BLANK) > -1) {
        str = str.replace(BLANK, "");
      }
      return parseFloat(str);
    }
    findCoordsNode(node) {
      let nodeName = this.getNodeName(node);
      while (nodeName.indexOf(":coordinates") === -1 && nodeName.indexOf(":pos") === -1) {
        node = node.children[0];
        nodeName = this.getNodeName(node);
      }
      return node;
    }
    getNodeName(node, lowerCase = true) {
      if (lowerCase) {
        return (node.nodeName || "").toLocaleLowerCase();
      } else {
        return node.nodeName || "";
      }
    }
    geoIsPolygon(type) {
      return type.indexOf("Polygon") > -1;
    }
  }
  class Position$1 {
    constructor(longitude, latitude, height) {
      this.longitude = longitude;
      this.latitude = latitude;
      this.height = height;
    }
    static fromCartesian(cartesian, ellipsoid) {
      const cart = Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
      return new Position$1(
        Cesium.Math.toDegrees(cart.longitude),
        Cesium.Math.toDegrees(cart.latitude),
        cart.height
      );
    }
    static toCartesian(position, ellipsoid) {
      const { longitude, latitude, height } = position;
      const cart = Cesium.Cartographic.fromDegrees(longitude, latitude, height != null ? height : 3e4);
      return Cesium.Cartographic.toCartesian(cart, ellipsoid);
    }
    static fromRadians(longitude, latitude, height) {
      return new Position$1(
        Cesium.Math.toDegrees(longitude),
        Cesium.Math.toDegrees(latitude),
        height
      );
    }
    static toCartographic(position) {
      const { longitude, latitude, height } = position;
      return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    }
  }
  cesium.Cartesian3.toPosition = function(cartesian, ellipsoid) {
    const cart = cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    return new Position(
      Cesium.Math.toDegrees(cart.longitude),
      Cesium.Math.toDegrees(cart.latitude),
      cart.height
    );
  };
  cesium.PolygonHierarchy.prototype.holes;
  cesium.PolygonHierarchy.prototype.positions;
  const _CoordTransforms = class {
    static outOfChina(lng, lat) {
      return lng < 72.004 || lng > 137.8347 || (lat < 0.8293 || lat > 55.8271 || false);
    }
    static transformlat(lng, lat) {
      const { PI } = _CoordTransforms;
      var ret = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
      ret += (20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) * 2 / 3;
      ret += (20 * Math.sin(lat * PI) + 40 * Math.sin(lat / 3 * PI)) * 2 / 3;
      ret += (160 * Math.sin(lat / 12 * PI) + 320 * Math.sin(lat * PI / 30)) * 2 / 3;
      return ret;
    }
    static transformlng(lng, lat) {
      const { PI } = _CoordTransforms;
      var ret = 300 + lng + 2 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += (20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) * 2 / 3;
      ret += (20 * Math.sin(lng * PI) + 40 * Math.sin(lng / 3 * PI)) * 2 / 3;
      ret += (150 * Math.sin(lng / 12 * PI) + 300 * Math.sin(lng / 30 * PI)) * 2 / 3;
      return ret;
    }
    static wgs84Togcj02(lng, lat) {
      const { outOfChina, transformlat, transformlng, PI, A, EE } = _CoordTransforms;
      if (outOfChina(lng, lat)) {
        return [lng, lat];
      } else {
        var dlat = transformlat(lng - 105, lat - 35);
        var dlng = transformlng(lng - 105, lat - 35);
        var radlat = lat / 180 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - EE * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = dlat * 180 / (A * (1 - EE) / (magic * sqrtmagic) * PI);
        dlng = dlng * 180 / (A / sqrtmagic * Math.cos(radlat) * PI);
        var mglat2 = lat + dlat;
        var mglng2 = lng + dlng;
        return [mglng2, mglat2];
      }
    }
    static gcj02Towgs84(lng, lat) {
      const { outOfChina, transformlat, transformlng, PI, A, EE } = _CoordTransforms;
      if (outOfChina(lng, lat)) {
        return [lng, lat];
      } else {
        var dlat = transformlat(lng - 105, lat - 35);
        var dlng = transformlng(lng - 105, lat - 35);
        var radlat = lat / 180 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - EE * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = dlat * 180 / (A * (1 - EE) / (magic * sqrtmagic) * PI);
        dlng = dlng * 180 / (A / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
      }
    }
    static gcj02Tobd09(lng, lat) {
      const { X_PI } = _CoordTransforms;
      var z = Math.sqrt(lng * lng + lat * lat) + 2e-5 * Math.sin(lat * X_PI);
      var theta = Math.atan2(lat, lng) + 3e-6 * Math.cos(lng * X_PI);
      var bd_lng = z * Math.cos(theta) + 65e-4;
      var bd_lat = z * Math.sin(theta) + 6e-3;
      return [bd_lng, bd_lat];
    }
    static bd09Togcj02(lng, lat) {
      const { X_PI } = _CoordTransforms;
      var x = lng - 65e-4;
      var y = lat - 6e-3;
      var z = Math.sqrt(x * x + y * y) - 2e-5 * Math.sin(y * X_PI);
      var theta = Math.atan2(y, x) - 3e-6 * Math.cos(x * X_PI);
      var gg_lng = z * Math.cos(theta);
      var gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat];
    }
    static bd09Towgs84(lng, lat) {
      const { bd09Togcj02, gcj02Towgs84 } = _CoordTransforms;
      const gcj02 = bd09Togcj02(lng, lat);
      const result = gcj02Towgs84(gcj02[0], gcj02[1]);
      return result;
    }
    static wgs84Tobd09(lng, lat) {
      const { wgs84Togcj02, gcj02Tobd09 } = _CoordTransforms;
      const gcj02 = wgs84Togcj02(lng, lat);
      const result = gcj02Tobd09(gcj02[0], gcj02[1]);
      return result;
    }
  };
  let CoordTransforms = _CoordTransforms;
  __publicField(CoordTransforms, "X_PI", 3.141592653589793 * 3e3 / 180);
  __publicField(CoordTransforms, "PI", 3.141592653589793);
  __publicField(CoordTransforms, "A", 6378245);
  __publicField(CoordTransforms, "EE", 0.006693421622965943);
  function defer() {
    let n;
    let reject;
    const signatureEffort = new Promise(function(max_out, rj) {
      n = max_out;
      reject = rj;
    });
    return {
      resolve: n,
      reject,
      promise: signatureEffort
    };
  }
  function SupermapImageryProvider(options) {
    if (!(options = Cesium.defaultValue(options, {})).url) {
      throw new Cesium.DeveloperError("options.url is required.");
    }
    if (this._url = Cesium.appendForwardSlash(options.url), this._resource = Cesium.Resource.createIfNeeded(this._url), this._isTileMap = options.url.indexOf("rest/maps") > -1, this._isSci3D = options.url.indexOf("rest/realspace") > -1, !this._isTileMap && !this._isSci3D) {
      throw new Cesium.DeveloperError("options.url is error");
    }
    this._urlTemplate = void 0;
    this._errorEvent = new Cesium.Event();
    this._tileWidth = 256;
    this._tileHeight = 256;
    this._tileFormat = Cesium.defaultValue(options.tileFormat, "png");
    this._minimumLevel = Cesium.defaultValue(options.minimumLevel, 0);
    this._maximumLevel = options.maximumLevel;
    this._rectangle = void 0;
    this._tilingScheme = options.tilingScheme;
    this._coordUnit = void 0;
    this._scales = Co;
    this._tileDiscardPolicy = options.tileDiscardPolicy;
    let canvas = Cesium.defaultValue(options.credit, "");
    if ("string" == typeof canvas) {
      canvas = new Cesium.Credit(canvas);
    }
    this._credit = canvas;
    this._ready = false;
    this._readyPromise = defer();
    let i2;
    let loadPropPromise;
    let that2 = this;
    if (this._isSci3D) {
      i2 = this._resource.getDerivedResource({
        url: "config"
      });
      loadPropPromise = i2.fetchXML();
    } else {
      i2 = Cesium.Resource.createIfNeeded(options.url + ".json");
      loadPropPromise = i2.fetchJson();
    }
    loadPropPromise.then(function(childCompute) {
      if (that2._isSci3D) {
        (function(that3, value) {
          let i3 = "http://www.supermap.com/SuperMapCache/sci3d";
          let localStorageObject = value.documentElement;
          let r = self.queryFirstNode(localStorageObject, "Bounds", i3);
          let minLon = self.queryNumericValue(r, "Left", i3);
          let maxLon = self.queryNumericValue(r, "Right", i3);
          let maxLat = self.queryNumericValue(r, "Top", i3);
          let minLat = self.queryNumericValue(r, "Bottom", i3);
          let fields = self.queryStringValue(localStorageObject, "FileExtentName", i3);
          let target = self.queryNumericValue(localStorageObject, "CellWidth", i3);
          let e = self.queryNumericValue(localStorageObject, "CellHeight", i3);
          let fileNode = self.queryFirstNode(localStorageObject, "Levels", i3);
          let textEls = self.queryNodes(fileNode, "Level", i3);
          let charListNotLatin = [];
          for (let i4 = 0, l = textEls.length; i4 < l; i4++) {
            charListNotLatin.push(parseInt(textEls[i4].textContent, 10));
          }
          that3._tileFormat = Cesium.defaultValue(fields, "png");
          that3._tileWidth = Cesium.defaultValue(target, 256);
          that3._tileHeight = Cesium.defaultValue(e, 256);
          let charsNotLatinNum = charListNotLatin.length;
          that3._minimumLevel = Cesium.defaultValue(charListNotLatin[0], 0);
          that3._maximumLevel = Cesium.defaultValue(that3._maximumLevel, charListNotLatin[charsNotLatinNum - 1]);
          if (!that3._tilingScheme) {
            that3._tilingScheme = new Cesium.GeographicTilingScheme();
          }
          let tilingScheme = that3._tilingScheme;
          if (!that3._rectangle && minLon && maxLon && maxLat && minLat) {
            that3._rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(minLon), Cesium.Math.toRadians(minLat), Cesium.Math.toRadians(maxLon), Cesium.Math.toRadians(maxLat));
          }
          if (that3._rectangle.west < tilingScheme.rectangle.west) {
            that3._rectangle.west = tilingScheme.rectangle.west;
          }
          if (that3._rectangle.east > tilingScheme.rectangle.east) {
            that3._rectangle.east = tilingScheme.rectangle.east;
          }
          if (that3._rectangle.south < tilingScheme.rectangle.south) {
            that3._rectangle.south = tilingScheme.rectangle.south;
          }
          if (that3._rectangle.north > tilingScheme.rectangle.north) {
            that3._rectangle.north = tilingScheme.rectangle.north;
          }
          let Cpoints = tilingScheme.positionToTileXY(Cesium.Rectangle.southwest(that3._rectangle), that3._minimumLevel);
          let point = tilingScheme.positionToTileXY(Cesium.Rectangle.northeast(that3._rectangle), that3._minimumLevel);
          if ((Math.abs(point.x - Cpoints.x) + 1) * (Math.abs(point.y - Cpoints.y) + 1) > 4) {
            that3._minimumLevel = 0;
          }
          that3._urlTemplate = that3._url + "data/index/{y}/{x}.{fileExtension}?level={level}";
          that3._ready = true;
          that3._readyPromise.resolve(true);
        })(that2, childCompute);
      } else {
        if (that2._isTileMap) {
          (function(that3, value) {
            let keyfinder = value.prjCoordSys.coordUnit;
            let json = value.bounds;
            let dispositions = value.visibleScales;
            let topLeft = 0 === dispositions.length;
            if (that3._coordUnit = keyfinder, "DEGREE" === keyfinder) {
              return that3._tilingScheme = new Cesium.GeographicTilingScheme(), json.left = Cesium.Math.clamp(json.left, -180, 180), json.bottom = Cesium.Math.clamp(json.bottom, -90, 90), json.right = Cesium.Math.clamp(json.right, -180, 180), json.top = Cesium.Math.clamp(json.top, -90, 90), Cesium.Math.equalsEpsilon(json.left, json.right, Cesium.Math.EPSILON7) && (json.right += Cesium.Math.EPSILON5), Cesium.Math.equalsEpsilon(json.top, json.bottom, Cesium.Math.EPSILON7) && (json.top += Cesium.Math.EPSILON5), that3._rectangle = Cesium.Rectangle.fromDegrees(json.left, json.bottom, json.right, json.top), that3._urlTemplate = that3._url + "tileImage." + that3._tileFormat + '?x={x}&y={y}&scale={scale}&origin={"x":-180,"y":90}', that3._maximumLevel = Cesium.defaultValue(that3._maximumLevel, that3._scales.length), that3._ready = true, void that3._readyPromise.resolve(true);
            }
            let a = new Cesium.Cartesian3(json.left, json.bottom, 0);
            let b = new Cesium.Cartesian3(json.right, json.top, 0);
            if (!Cesium.defined(that3._tilingScheme)) {
              let i3;
              let n;
              let newNodeLists;
              let u2;
              let isHorizontal = Cesium.defined(value.prjCoordSys) && Cesium.defined(value.prjCoordSys.projection) && ("PRJ_SPHERE_MERCATOR" === value.prjCoordSys.projection.type || "PRJ_TRANSVERSE_MERCATOR" === value.prjCoordSys.projection.type);
              let data = isHorizontal ? new Cesium.WebMercatorProjection() : new Cesium.GeographicProjection();
              let region = data.unproject(a);
              let options2 = data.unproject(b);
              let RECTANGLE_CONTAINING_EXPECTED_POS = new Cesium.Rectangle(region.longitude, region.latitude, options2.longitude, options2.latitude);
              if (!topLeft) {
                newNodeLists = [];
                u2 = new Cesium.Cartesian2(value.dpi, value.dpi);
                for (let i4 = 0; i4 < dispositions.length; i4++) {
                  newNodeLists.push(1 / dispositions[i4]);
                }
                let length = dispositions[0];
                let nWorkspaces = 0.0254 / (value.dpi * length);
                i3 = Math.ceil((b.x - a.x) / nWorkspaces / value.viewer.width);
                n = Math.ceil((b.y - a.y) / nWorkspaces / value.viewer.height);
                that3._scales = dispositions;
              }
              that3._tilingScheme = isHorizontal ? new Cesium.WebMercatorTilingScheme({
                numberOfLevelZeroTilesX: i3,
                numberOfLevelZeroTilesY: n,
                rectangleSouthwestInMeters: topLeft ? void 0 : a,
                rectangleNortheastInMeters: topLeft ? void 0 : b
              }) : new WebMercatorTilingScheme({
                projection: data,
                rectangleSouthwestInMeters: a,
                rectangleNortheastInMeters: b,
                numberOfLevelZeroTilesX: i3,
                numberOfLevelZeroTilesY: n,
                customDPI: u2,
                scaleDenominators: newNodeLists
              });
              that3._rectangle = RECTANGLE_CONTAINING_EXPECTED_POS;
            }
            let l = topLeft ? -20037508342789248e-9 : json.left;
            let u = topLeft ? 20037508342789095e-9 : json.top;
            that3._urlTemplate = that3._url + "tileImage." + that3._tileFormat + '?x={x}&y={y}&scale={scale}&origin={"x":' + l + ',"y":' + u + "}";
            that3._maximumLevel = Cesium.defaultValue(that3._maximumLevel, that3._scales.length);
            that3._ready = true;
            that3._readyPromise.resolve(true);
          })(that2, childCompute);
        }
      }
    }, function(canCreateDiscussions) {
      let lng = "An error occurred while accessing " + that2._url + ".";
      that2._readyPromise.reject(new Cesium.RuntimeError(lng));
    });
  }
  const Co = [1690163571602655e-24, 33803271432053056e-25, 6760654286410611e-24, 13521308572821242e-24, 27042617145642484e-24, 5408523429128511e-23, 10817046858256998e-23, 21634093716513974e-23, 43268187433028044e-23, 8653637486605571e-22, 17307274973211203e-22, 34614549946422405e-22, 69229099892844565e-22, 13845819978568952e-21, 27691639957137904e-21, 553832799142758e-19, 1107665598285516e-19, 2215331196571032e-19, 4430662393142064e-19, 8861324786284128e-19, 0.001772264957256826, 0.003544529914513652];
  Object.defineProperties(SupermapImageryProvider.prototype, {
    url: {
      get: function() {
        return this._url;
      }
    },
    tileWidth: {
      get: function() {
        if (!this._ready) {
          throw new DeveloperError("tileWidth must not be called before the imagery provider is ready.");
        }
        return this._tileWidth;
      }
    },
    tileHeight: {
      get: function() {
        if (!this._ready) {
          throw new DeveloperError("tileHeight must not be called before the imagery provider is ready.");
        }
        return this._tileHeight;
      }
    },
    tileFormat: {
      get: function() {
        return this._tileFormat;
      }
    },
    maximumLevel: {
      get: function() {
        if (!this._ready) {
          throw new DeveloperError("maximumLevel must not be called before the imagery provider is ready.");
        }
        return 1 === this.resolution ? this._maximumLevel : this._maximumLevel - 1;
      }
    },
    minimumLevel: {
      get: function() {
        if (!this._ready) {
          throw new DeveloperError("minimumLevel must not be called before the imagery provider is ready.");
        }
        return this._minimumLevel;
      }
    },
    tilingScheme: {
      get: function() {
        if (!this._ready) {
          throw new DeveloperError("tilingScheme must not be called before the imagery provider is ready.");
        }
        return this._tilingScheme;
      }
    },
    rectangle: {
      get: function() {
        if (!this._ready) {
          throw new DeveloperError("rectangle must not be called before the imagery provider is ready.");
        }
        return this._rectangle;
      }
    },
    errorEvent: {
      get: function() {
        return this._errorEvent;
      }
    },
    ready: {
      get: function() {
        return this._ready;
      }
    },
    credit: {
      get: function() {
        return this._credit;
      }
    },
    hasAlphaChannel: {
      get: function() {
        return true;
      }
    },
    readyPromise: {
      get: function() {
        return this._readyPromise.promise;
      }
    },
    tileDiscardPolicy: {
      get: function() {
        return this._tileDiscardPolicy;
      }
    }
  });
  SupermapImageryProvider.prototype.getTileCredits = function(level, x, y) {
  };
  SupermapImageryProvider.prototype.requestImage = function(x, y, level, file) {
    if (!this._ready) {
      throw new Cesium.DeveloperError("requestImage must not be called before the imagery provider is ready.");
    }
    let alwaysDownload;
    if (this._isSci3D) {
      alwaysDownload = this._resource.getDerivedResource({
        url: this._urlTemplate,
        request: file,
        templateValues: {
          x,
          y,
          level,
          fileExtension: this._tileFormat
        }
      });
    } else {
      let serverScale = "DEGREE" === this._coordUnit ? this._scales[level + 1] : this._scales[level];
      alwaysDownload = this._resource.getDerivedResource({
        url: this._urlTemplate,
        request: file,
        templateValues: {
          x,
          y,
          scale: serverScale
        },
        queryParameters: {
          transparent: true,
          cacheEnabled: true,
          _cache: true,
          width: 256,
          height: 256,
          redirect: false,
          overlapDisplayed: false
        }
      });
    }
    return function(imageryProvider, alwaysDownload2) {
      let context = Cesium.Resource.createIfNeeded(alwaysDownload2);
      return imageryProvider.tileDiscardPolicy ? context.fetchImage({
        preferBlob: true,
        preferImageBitmap: true,
        flipY: true
      }) : context.fetchImage();
    }(this, alwaysDownload);
  };
  SupermapImageryProvider.prototype.pickFeatures = function() {
  };
  class TopolAnalysis {
    static pointsWithinPolygon(pointPos, polygonPos) {
      const firstPolyPoint = polygonPos[0];
      const lastPolyPoint = polygonPos[polygonPos.length - 1];
      if (firstPolyPoint[0].toFixed(14) !== lastPolyPoint[0].toFixed(14) || firstPolyPoint[0].toFixed(1) !== lastPolyPoint[0].toFixed(1)) {
        polygonPos.push(polygonPos[0]);
      }
      const points = turf.points([...pointPos]);
      const searchWithin = turf.polygon([polygonPos]);
      const ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
      const res = [];
      ptsWithin.features.forEach((item) => {
        const point = item;
        const coord = turf.getCoord(point);
        const index = pointPos.findIndex((item2) => item2[0].toFixed(14) === coord[0].toFixed(14) && item2[1].toFixed(14) === coord[1].toFixed(14));
        if (index !== -1)
          res.push(index);
      });
      return res.length > 0 ? res : null;
    }
    static distance(from, to) {
      if (!from || !to)
        return from || to;
      return Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(from.x, from.y, from.z),
        Cesium.Cartesian3.fromDegrees(to.x, to.y, to.z)
      );
    }
  }
  class WebFeatureServiceImageryProvider {
    constructor() {
    }
    static load(url, options) {
      const { layerName } = options;
      Cesium.Check.typeOf.string("layerName \u5E94\u8BE5\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B", layerName);
      const realUrl = new URL(url);
      const queryParameters = new URLSearchParams({
        typeName: layerName,
        service: "WFS",
        request: "GetFeature",
        outputFormat: "application/xml"
      });
      realUrl.search = queryParameters;
      const promise = fetch(realUrl).then((res) => res.text());
      return Promise.resolve(promise).then((xmlStr) => {
        const geojson = new GMLFormat().read(xmlStr);
        return GeoJsonDataSource.load(geojson);
      }).catch((err) => {
        throw err;
      });
    }
  }
  Object.defineProperties(cesium.Camera.prototype, {
    isFullScreen: {
      get: () => Boolean(document.fullscreenElement)
    }
  });
  cesium.Camera.prototype.flyPosition = function(options) {
    let { position } = options;
    const { ellipsoid } = this._projection;
    const destination = Position$1.toCartesian(position, ellipsoid);
    this.flyTo(__spreadProps(__spreadValues({}, options), {
      destination
    }));
  };
  cesium.Camera.prototype.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
      if (document.documentElement.RequestFullScreen) {
        document.documentElement.RequestFullScreen();
      }
      if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      }
      if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
      }
      if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullScreen) {
        document.exitFullscreen();
      }
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  cesium.Camera.prototype.defaultZoomAmount;
  cesium.Camera.prototype.zoomIn;
  cesium.Camera.prototype.zoomOut;
  cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);
  class BaseService {
    constructor(options) {
      __publicField(this, "protocol", "http");
      __publicField(this, "host", "10.223.178.107");
      __publicField(this, "port");
      __publicField(this, "url");
      var _a, _b, _c;
      this.protocol = (_a = options == null ? void 0 : options.protocol) != null ? _a : this.protocol;
      this.host = (_b = options == null ? void 0 : options.host) != null ? _b : this.host;
      this.port = (_c = options == null ? void 0 : options.port) != null ? _c : this.port;
      this.makeUrl();
    }
    makeUrl() {
      this.url = `${this.protocol}://${this.host}${this.port ? ":" + this.port : ""}`;
      return this.url;
    }
  }
  class TGisService extends BaseService {
    constructor(options) {
      super(options);
    }
    queryPOIByRegion(options) {
      const url = `${this.url}/api/t-gis/gw/COMMON/POI/ByRegion`;
      const { geom, pageNo: page = 1, pageSize: limit = 10 } = options;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ geom, page, limit })
        }).then((resp) => resp.json()).then((res) => {
          var _a;
          let { code, msg: message, data } = res;
          resolve({
            code,
            message,
            data: data ? {
              pageNo: data == null ? void 0 : data.pageNo,
              pageSize: data == null ? void 0 : data.pageSize,
              total: data == null ? void 0 : data.total,
              list: (_a = data == null ? void 0 : data.list) == null ? void 0 : _a.map((item) => ({
                id: item.entityId,
                name: item.name,
                typeName: item.nameLarge,
                typeCode: item.codeLarge,
                viceTypeName: item.nameMedium,
                viceTypeCode: item.codeMedium,
                subTypeName: item.nameSmall,
                subTypeCode: item.codeSmall,
                geometry: item.location
              }))
            } : null
          });
        }).catch((err) => reject(err));
      });
    }
    static queryPOIByRegion(options, serviceOptions) {
      return new TGisService(serviceOptions).queryPOIByRegion(options);
    }
    queryPOITypesByRegion(options) {
      const url = `${this.url}/api/t-gis/gw/COMMON/poiSearch/types`;
      const { geom, pageNo: page = 1, pageSize: limit = 10 } = options;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ geom, page, limit })
        }).then((resp) => resp.json()).then((res) => {
          let { code, msg: message, data } = res;
          resolve({
            code,
            message,
            data
          });
        }).catch((err) => reject(err));
      });
    }
    static queryPOITypesByRegion(options, serviceOptions) {
      return new TGisService(serviceOptions).queryPOITypesByRegion(options);
    }
    queryPOITypesAndNumByRegion(options) {
      const url = `${this.url}/api/t-gis/gw/COMMON/poiSearch/stat`;
      const { geom, pageNo: page = 1, pageSize: limit = 10 } = options;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ geom, page, limit })
        }).then((resp) => resp.json()).then((res) => {
          var _a, _b, _c;
          let { code, msg: message, data } = res;
          resolve({
            code,
            message,
            data: data ? {
              list: (_b = (_a = data == null ? void 0 : data.quantity) == null ? void 0 : _a.stat) == null ? void 0 : _b.map((item) => ({
                name: item.label,
                num: item.num
              })),
              total: (_c = data == null ? void 0 : data.quantity) == null ? void 0 : _c.sum
            } : null
          });
        }).catch((err) => reject(err));
      });
    }
    static queryPOITypesAndNumByRegion(options, serviceOptions) {
      return new TGisService(serviceOptions).queryPOITypesAndNumByRegion(options);
    }
    queryPOIListByRegion(options) {
      const url = `${this.url}/api/t-gis/gw/COMMON/POI/ByRegion`;
      const { geom, pageNo: page = 1, pageSize: limit = 10 } = options;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ geom, page, limit })
        }).then((resp) => resp.json()).then((res) => {
          var _a;
          let { code, msg: message, data } = res;
          resolve({
            code,
            message,
            data: data ? {
              pageNo: data == null ? void 0 : data.pageNo,
              pageSize: data == null ? void 0 : data.pageSize,
              total: data == null ? void 0 : data.total,
              list: (_a = data == null ? void 0 : data.list) == null ? void 0 : _a.map((item) => ({
                id: item.entityId,
                name: item.name,
                typeName: item.nameLarge,
                typeCode: item.codeLarge,
                viceTypeName: item.nameMedium,
                viceTypeCode: item.codeMedium,
                subTypeName: item.nameSmall,
                subTypeCode: item.codeSmall,
                geometry: item.location
              }))
            } : null
          });
        }).catch((err) => reject(err));
      });
    }
    static queryPOIListByRegion(options, serviceOptions) {
      return new TGisService(serviceOptions).queryPOIListByRegion(options);
    }
    regeo(options) {
      const _a = options != null ? options : {}, { lng, lat, pageNo: pageNum = 1, pageSize = 10 } = _a, rest = __objRest(_a, ["lng", "lat", "pageNo", "pageSize"]);
      const searchParams = new URLSearchParams(__spreadValues({ pageNum, pageSize }, rest)).toString();
      const url = `${this.url}/api/t-gis/gw/COMMON/query/InvAddrMatch/${lng}/${lat}?${searchParams}`;
      return new Promise((resolve, reject) => {
        fetch(url).then((resp) => resp.json()).then((res) => {
          const { result, status } = res;
          resolve({
            code: status === "ok" ? 200 : -1,
            message: status === "ok" ? "\u8BF7\u6C42\u6210\u529F" : "\u8BF7\u6C42\u5931\u8D25",
            data: result
          });
        }).catch((err) => reject(err));
      });
    }
    static regeo(options, serviceOptions) {
      return new TGisService(serviceOptions).regeo(options);
    }
    geo(options) {
      const { address } = options;
      const searchParams = new URLSearchParams({
        query: encodeURIComponent(address),
        region: 440300,
        ak: "ebf48ecaa1fd436fa3d40c4600aa051f"
      });
      const url = `${this.url}/api/t-gis/gw/COMMON/addrMatch?${searchParams.toString()}`;
      return new Promise((resolve, reject) => {
        fetch(url).then((resp) => resp.json()).then((res) => {
          const { status, message, total, result } = res;
          resolve({
            code: status === 0 ? 200 : -1,
            message,
            data: {
              list: result == null ? void 0 : result.map((item) => __spreadValues({
                id: item.std_addr_id,
                address: item.address,
                name: item.name,
                shortName: item.key_prefix,
                nickName: item.alias,
                code: item.adcode
              }, item.location)),
              total
            }
          });
        }).catch((err) => reject(err));
      });
    }
    static geo(options, serviceOptions) {
      return new TGisService(serviceOptions).geo(options);
    }
    search(options) {
      const { address: keyword, pageNo: pageNum = 1, pageSize = 10 } = options;
      const searchParams = new URLSearchParams({
        keyword,
        pageNum,
        pageSize
      });
      const url = `${this.url}/api/t-gis/gw/COMMON/search/prev?${searchParams.toString()}`;
      return new Promise((resolve, reject) => {
        fetch(url).then((resp) => resp.json()).then((res) => {
          const { code, msg: message, data } = res;
          resolve({
            code,
            message,
            data: data == null ? void 0 : data.map((item) => ({
              id: item.entityId,
              name: item.name,
              address: item.address,
              typeName: item.type,
              geometry: item.geo
            }))
          });
        }).catch((err) => reject(err));
      });
    }
    static search(options, serviceOptions) {
      return new TGisService(serviceOptions).search(options);
    }
  }
  class TianDiService extends BaseService {
    constructor(options) {
      super(__spreadProps(__spreadValues({}, options), {
        port: 9082
      }));
    }
    geo(options) {
      const searchParams = new URLSearchParams();
      searchParams.append("ds", `{"keyWord":"${options == null ? void 0 : options.address}"}`);
      searchParams.append("tk", options == null ? void 0 : options.tk);
      const url = this.url + `/geocoder?${searchParams.toString()}`;
      return new Promise((resolve, reject) => {
        fetch(url).then((res) => res.json()).then((res) => {
          const { location: { keyWord, level, lon, lat } } = res;
          resolve({
            address: keyWord,
            typeName: level,
            lng: lon,
            lat
          });
        }).catch((err) => reject(err));
      });
    }
    regeo(options) {
      const searchParams = new URLSearchParams();
      searchParams.append("postStr", `{'lon':${options == null ? void 0 : options.lng},'lat':${options == null ? void 0 : options.lat},'ver':1}`);
      searchParams.append("type", "geocode");
      searchParams.append("tk", options == null ? void 0 : options.tk);
      const url = this.url + `/geocoder?${searchParams.toString()}`;
      return new Promise((resolve, reject) => {
        fetch(url).then((res) => res.json()).then((res) => {
          const {
            formatted_address,
            addressComponent: {
              address,
              address_distince,
              address_position,
              nation,
              province,
              city,
              county,
              road,
              poi
            }
          } = res.result;
          resolve({
            fullAddress: formatted_address,
            address,
            distince: address_distince,
            direction: address_position,
            country: nation,
            province,
            city,
            district: county,
            street: road,
            name: poi
          });
        }).catch((err) => reject(err));
      });
    }
    static geo(options, serviceOptions) {
      return new TianDiService(serviceOptions).geo(options);
    }
    static regeo(options, serviceOptions) {
      return new TianDiService(serviceOptions).regeo(options);
    }
  }
  function Map3D(paramObj) {
    this.maptoken = paramObj.token;
    this.vmodels = Cesium.createDefaultImageryProviderViewModels();
    var tms = new Cesium.SingleTileImageryProvider({
      type: "image",
      url: paramObj.singmapimg
    });
    this.zoomLevel = paramObj.zoomLevel || [
      26014400,
      3276800,
      1638400,
      819200,
      409600,
      204800,
      102400,
      51200,
      25600,
      12800,
      6400,
      3200,
      1600,
      800,
      400,
      200,
      100,
      50
    ];
    this.viewerobj = {
      animation: paramObj.animation || false,
      fullscreenButton: paramObj.fullscreenButton || false,
      geocoder: paramObj.geocoder || false,
      homeButton: paramObj.homeButton || false,
      infoBox: paramObj.infoBox || false,
      maximumRenderTimeChange: paramObj.maximumRenderTimeChange || Infinity,
      sceneModePicker: paramObj.sceneModePicker || false,
      shadows: paramObj.shadows || false,
      selectionIndicator: paramObj.selectionIndicator || false,
      timeline: paramObj.timeline || false,
      navigationHelpButton: paramObj.navigationHelpButton || false,
      shouldAnimate: paramObj.shouldAnimate || true,
      clock: new Cesium.Clock(),
      baseLayerPicker: paramObj.baseLayerPicker || false,
      selectedImageryProviderViewModel: this.vmodels[15],
      imageryProviderViewModels: paramObj.imageryProviderViewModels || Cesium.createDefaultImageryProviderViewModels(),
      selectedTerrainProviderViewModel: void 0,
      terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),
      imageryProvider: tms,
      fullscreenElement: document.body,
      useDefaultRenderLoop: paramObj.useDefaultRenderLoop || true,
      targetFrameRate: paramObj.targetFrameRate || void 0,
      showRenderLoopErrors: paramObj.showRenderLoopErrors || false,
      automaticallyTrackDataSourceClocks: paramObj.automaticallyTrackDataSourceClocks || false,
      contextOptions: paramObj.contextOptions || void 0,
      mapProjection: new Cesium.WebMercatorProjection(),
      dataSources: new Cesium.DataSourceCollection(),
      orderIndependentTranslucency: paramObj.orderIndependentTranslucency || false,
      contextOptions: {
        webgl: {
          alpha: true
        }
      }
    };
    this.Popups = [];
    this.modelcolors = {};
  }
  Map3D.prototype.createMap = function(paramObj) {
    if (!this.viewer && paramObj.id) {
      if (this.maptoken) {
        Cesium.Ion.defaultAccessToken = this.maptoken;
      }
      try {
        this.viewer = new Cesium.Viewer(paramObj.id, this.viewerobj);
        this.viewer.bottomContainer.style.display = paramObj.cesiumicoshow ? "inherit" : "none";
        this.minimumZoomDistance = paramObj.minimumZoomDistance || 5;
        this.maximumZoomDistance = paramObj.maximumZoomDistance || 47866985;
        this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = this.minimumZoomDistance;
        this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = this.maximumZoomDistance;
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.resolutionScale = 1.25;
        this.viewer.scene.fxaa = true;
        this.viewer.scene.fog.enabled = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        console.log("paramObj.hasEdit:", paramObj.hasEdit);
        if (paramObj.hasEdit == void 0) {
          window.drawgeometry = new DrawEdit(this.viewer, {
            hasEdit: true
          });
        } else {
          window.drawgeometry = new DrawEdit(this.viewer, {
            hasEdit: Boolean(paramObj.hasEdit)
          });
        }
      } catch (e) {
        console.log("\u9519\u8BEF:" + e);
      }
    }
  };
  Map3D.prototype.loadmapbytype = function(paramObj) {
    var mapdata = void 0;
    if (paramObj.type) {
      switch (paramObj.type) {
        case "tile":
          mapdata = new Cesium.UrlTemplateImageryProvider({
            url: paramObj.url,
            minimumLevel: paramObj.minLevel || 0,
            maximumLevel: paramObj.maxLevel || 18
          });
          break;
        case "arcgis":
          mapdata = new Cesium.ArcGisMapServerImageryProvider({
            url: paramObj.url,
            minimumLevel: paramObj.minLevel || 0,
            maximumLevel: paramObj.maxLevel || 18
          });
          break;
        case "image":
          mapdata = new Cesium.SingleTileImageryProvider({
            type: "image",
            url: paramObj.url
          });
          break;
        case "tianditu":
          var urlParam = "?";
          var mapUrlObj = paramObj.mapUrlObj;
          for (const mapUrlObjKey in mapUrlObj) {
            const mapUrlObjValue = mapUrlObj[mapUrlObjKey];
            if (mapUrlObjValue) {
              urlParam += mapUrlObjKey + "=" + mapUrlObjValue + "&";
            }
          }
          urlParam += "tk=" + paramObj.key;
          mapdata = new Cesium.WebMapTileServiceImageryProvider({
            layer: paramObj.layer,
            url: paramObj.url + urlParam,
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            tileMatrixSetID: paramObj.tileMatrixSetID || "GoogleMapsCompatible"
          });
          break;
        case "bingMaps":
          mapdata = new Cesium.BingMapsImageryProvider({
            url: "https://dev.virtualearth.net",
            key: paramObj.key
          });
          break;
      }
    }
    return mapdata;
  };
  Map3D.prototype.MapSwitch = function(paramObj) {
    if (this.viewer) {
      var mapimagery = this.loadmapbytype(paramObj);
      if (mapimagery) {
        this[paramObj.id] = this.viewer.imageryLayers.addImageryProvider(mapimagery);
      }
    }
  };
  Map3D.prototype.destroyMap = function() {
    if (this.viewer) {
      this.viewer.destroy();
      delete this.viewer;
      console.log("\u9500\u6BC1\u5730\u56FE\uFF0C\u6B64\u65F6this.viewer\u4E3A\uFF1A" + this.viewer);
    }
  };
  Map3D.prototype.deleteMapById = function(paramObj) {
    if (this.viewer) {
      this.viewer.imageryLayers.remove(this[paramObj.id]);
      delete this[paramObj.id];
    }
  };
  Map3D.prototype.addressSearch = function(parmeObj2) {
    const $this = this;
    if (!parmeObj2.r || parmeObj2.r == " ") {
      parmeObj2.r = 500;
    }
    if (parmeObj2.x && parmeObj2.y && parmeObj2.type && parmeObj2.url) {
      new Promise(function(resolve, reject) {
        const requestUrl = "" + parmeObj2.url + "/" + parmeObj2.x + "/" + parmeObj2.y + "?r=" + parmeObj2.r + "&type=" + parmeObj2.type;
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
          }
        };
        xmlHttp.open("GET", requestUrl, true);
        xmlHttp.setRequestHeader(
          "Content-Type",
          "application/json"
        );
        xmlHttp.setRequestHeader(
          "szvsud-license-key",
          "CVz440zV4BE7fCSznRZvnE6J/SCKlMDbCjGBRD9XtmwvQE2h+NK4qJI/0feODJfIrU/Cb6BQ2ZgMhkzEJUARAQ=="
        );
        xmlHttp.withCredentials = true;
        xmlHttp.send();
        function callback(e) {
          const resp = JSON.parse(e);
          if (resp.status === "ok") {
            console.log("\u5730\u5740\u641C\u7D22\u7ED3\u679C\uFF1A" + e);
            const arr = [];
            for (let res of resp.result) {
              const ent = $this.viewer.entities.add({
                id: res.house_id,
                name: "simulation",
                position: Cesium.Cartesian3.fromDegrees(
                  Number(res.x),
                  Number(res.y),
                  Number(0)
                ),
                show: true,
                label: {
                  id: parmeObj2.label.id,
                  text: res.full_name,
                  scale: parmeObj2.label.scale,
                  font: parmeObj2.label.font || "normal 12px MicroSoft YaHei",
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  fillColor: Cesium.Color.fromCssColorString(parmeObj2.label.fillColor),
                  outlineColor: Cesium.Color.AQUA,
                  outlineWidth: parmeObj2.label.linewidth || 2,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    0,
                    500
                  ),
                  pixelOffset: new Cesium.Cartesian2(
                    parmeObj2.label.pixelOffset.x,
                    parmeObj2.label.pixelOffset.y
                  ),
                  disableDepthTestDistance: Number.POSITIVE_INFINITY,
                  showBackground: parmeObj2.label.showBackground,
                  backgroundColor: Cesium.Color.fromCssColorString(
                    parmeObj2.label.backgroundColor
                  ),
                  option: parmeObj2.label.option
                }
              });
              arr.push(ent);
            }
            if (arr.length > 0) {
              $this.viewer.flyTo(arr);
            }
          }
        }
      });
    }
  };
  Map3D.prototype.ptSearch = function(parmeObj2) {
    if (parmeObj2.address && parmeObj2.pageNum && parmeObj2.pageSize && parmeObj2.url) {
      new Promise(function(resolve, reject) {
        const requestUrl = "http://10.223.178.107/api/t-gis/gw/COMMON/addrMatch";
        const xmlHttp = new XMLHttpRequest();
        const dRequest = {
          address: parmeObj2.address || "",
          pageNum: parmeObj2.pageNum || 1,
          pageSize: parmeObj2.pageSize || 10
        };
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
          }
        };
        xmlHttp.open("POST", requestUrl, true);
        xmlHttp.setRequestHeader(
          "szvsud-license-key",
          "CVz440zV4BE7fCSznRZvnE6J/SCKlMDbCjGBRD9XtmwvQE2h+NK4qJI/0feODJfIrU/Cb6BQ2ZgMhkzEJUARAQ=="
        );
        xmlHttp.setRequestHeader(
          "Content-Type",
          "application/json"
        );
        xmlHttp.withCredentials = true;
        xmlHttp.send(JSON.stringify(dRequest));
        xmlHttp.send();
        function callback(e) {
          const resp = JSON.parse(e);
          if (resp.scuuess && resp.code == 200) {
            console.log("\u70B9\u4F4D\u641C\u7D22\u7ED3\u679C\uFF1A" + e);
          } else {
            console.log("\u70B9\u4F4D\u641C\u7D22\u63A5\u53E3\u5F02\u5E38\uFF1A" + e);
          }
        }
      });
    }
  };
  var startPoint = null;
  var endPoint = null;
  var startMarker = null;
  var endMarker = null;
  Map3D.prototype.setStartloation = function(url) {
    if (startMarker) {
      mapObj.viewer.entities.remove(startMarker);
    }
    getPickPosition(0, url);
  };
  Map3D.prototype.setEndloation = function(url) {
    if (endMarker) {
      mapObj.viewer.entities.remove(endMarker);
    }
    getPickPosition(1, url);
  };
  function getPickPosition(key, imageUrl) {
    var position;
    var Handler = new Cesium.ScreenSpaceEventHandler(mapObj.viewer.scene.canvas);
    Handler.setInputAction(function(clickEvent) {
      var newposition = mapObj.viewer.scene.pickPosition(clickEvent.position);
      var cartographic = Cesium.Cartographic.fromCartesian(newposition);
      Cesium.Math.toDegrees(cartographic.longitude);
      Cesium.Math.toDegrees(cartographic.latitude);
      cartographic.height;
      position = mapObj.viewer.scene.globe.pick(mapObj.viewer.camera.getPickRay(clickEvent.position), mapObj.viewer.scene);
      position = Cesium.Cartographic.fromCartesian(position);
      position = Cesium.Math.toDegrees(position.longitude) + "," + Cesium.Math.toDegrees(position.latitude);
      if (key == 0) {
        startMarker = addPositionMarker(position, imageUrl);
        startPoint = position;
      } else {
        endMarker = addPositionMarker(position, imageUrl);
        endPoint = position;
      }
      Handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  function addPositionMarker(position, imageUrl) {
    return mapObj.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(parseFloat(position.split(",")[0]), parseFloat(position.split(",")[1])),
      billboard: {
        image: imageUrl,
        scale: 0.5,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
  }
  Map3D.prototype.pathRule = function() {
    var params = { "startPoint": startPoint, "endPoint": endPoint };
    $.get("http://192.168.3.136:6060/api/web/pathPlanning", params, function(obj) {
      console.log(obj);
    }, "json");
  };
  Map3D.prototype.pathRuleFun = function() {
    var returnobj = void 0;
    if (parmeObj) {
      let callback = function(e) {
        const resp = JSON.parse(e);
        if (resp.code == 0) {
          returnobj = resp;
          addpathRuleline(resp.data);
        } else {
          console.log("\u63A5\u53E3\u5F02\u5E38\uFF1A" + resp);
        }
      };
      const requestUrl = "http://192.168.3.136:6060/api/web/pathPlanning?startPoint=+`startPoint`+&endPoint=+`endPoint`";
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        }
      };
      xmlHttp.open("get", requestUrl, false);
      xmlHttp.setRequestHeader("szvsud-license-key", "");
      xmlHttp.setRequestHeader(
        "Content-Type",
        "application/json"
      );
      xmlHttp.withCredentials = true;
      xmlHttp.send();
    }
    return returnobj;
  };
  function addpathRuleline(data) {
    var promise = Cesium.GeoJsonDataSource.load(data);
    promise.then(function(dataSource) {
      this.viewer.dataSources.add(dataSource);
    });
  }
  Map3D.prototype.planningPath = function(parmeObj2) {
    this.viewer.entities.remove(startMarker);
    this.viewer.entities.remove(endMarker);
    this.viewer.dataSources.removeAll();
  };
  Map3D.prototype.zoomIn = function(paramObj) {
    var nowheight = this.viewer.camera.positionCartographic.height;
    var n = nowheight - paramObj.height;
    if (n > this.minimumZoomDistance) {
      this.viewer.camera.zoomIn(paramObj.height);
    } else {
      console.log("\u5DF2\u8D85\u51FA\u7F29\u653E\u8303\u56F4,\u5F53\u524D\u6D77\u62D4\uFF1A" + nowheight);
    }
  };
  Map3D.prototype.zoomOut = function(paramObj) {
    var nowheight = this.viewer.camera.positionCartographic.height;
    var n = nowheight - paramObj.height;
    if (n < this.maximumZoomDistance) {
      this.viewer.camera.zoomOut(paramObj.height);
    } else {
      console.log("\u5DF2\u8D85\u51FA\u7F29\u653E\u8303\u56F4,\u5F53\u524D\u6D77\u62D4\uFF1A" + nowheight);
    }
  };
  Map3D.prototype.mapcameralocate = function(paramObj) {
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        paramObj.x,
        paramObj.y,
        paramObj.z
      ),
      orientation: {
        heading: Cesium.Math.toRadians(paramObj.heading),
        pitch: Cesium.Math.toRadians(paramObj.pitch),
        roll: Cesium.Math.toRadians(paramObj.roll)
      }
    });
  };
  Map3D.prototype.setmapcamera = function(paramObj) {
    const parmas = {
      orientation: {
        heading: Cesium.Math.toRadians(paramObj.heading),
        pitch: Cesium.Math.toRadians(paramObj.pitch),
        roll: Cesium.Math.toRadians(paramObj.roll)
      }
    };
    if (Cesium.defined(paramObj.zoom)) {
      const { zoom } = paramObj;
      if (!Cesium.defined(zoom))
        return;
      const zoomHeight = this.zoomLevel.find((item, index) => index + 1 === zoom);
      if (!Cesium.defined(zoomHeight))
        return;
      const { camera } = this.viewer;
      const cart = Cesium.Cartographic.fromCartesian(camera.position);
      parmas.destination = Cesium.Cartesian3.fromDegrees(cart.longitude, cart.latitude, zoomHeight);
    }
    this.viewer.camera.setView(parmas);
  };
  Map3D.prototype.getmapcamera = function() {
    const { viewer: viewer2 } = this;
    const { position, heading, pitch, roll } = viewer2.camera;
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const longitude = cartographic.longitude;
    const latitude = cartographic.latitude;
    const height = this.viewer.scene.camera.positionCartographic.height;
    const zoom = this.getZoom();
    return {
      longitude: Cesium.Math.toDegrees(longitude),
      latitude: Cesium.Math.toDegrees(latitude),
      height,
      zoom,
      orientation: {
        heading: Cesium.Math.toDegrees(heading),
        pitch: Cesium.Math.toDegrees(pitch),
        roll: Cesium.Math.toDegrees(roll)
      }
    };
  };
  Map3D.prototype.setSceneMode = function(mode) {
    const { scene } = this.viewer;
    if (mode === 2) {
      scene.mode = Cesium.SceneMode.SCENE2D;
    } else if (mode === 3) {
      scene.mode = Cesium.SceneMode.SCENE3D;
    }
  };
  Map3D.prototype.getSceneMode = function() {
    const { scene } = this.viewer;
    return scene.mode;
  };
  Map3D.prototype.getById = function(id) {
    return this.viewer.entities.getById(id);
  };
  Map3D.prototype.remove = function(entity) {
    return this.viewer.entities.remove(entity);
  };
  Map3D.prototype.removeById = function(id) {
    return this.viewer.entities.removeById(id);
  };
  Map3D.prototype.addplotting = function(paramObj, type = 0) {
    if (this.pointSelectedHandler) {
      this.pointSelectedHandler.destroy();
      delete this.pointSelectedHandler;
    }
    if (this.addMarkerHandler) {
      this.addMarkerHandler.destroy();
      delete this.addMarkerHandler;
    }
    if (type > 0) {
      this.openBox = true;
    }
    console.log("addplotting paramObj:", paramObj);
    window.drawgeometry.startDraw(paramObj);
  };
  Map3D.prototype.deleteplotting = function(paramObj) {
    window.drawgeometry.clearDrawAll();
  };
  Map3D.prototype.addPonit = function(paramObj) {
    let entity = this.viewer.entities.getById(paramObj.id);
    var position = Cesium.Cartesian3.fromDegrees(114, 22);
    if (paramObj.position.length > 1) {
      position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2] || 0
      );
    }
    if (entity == void 0) {
      var i2 = this.viewer.entities.add({
        id: paramObj.id,
        position,
        point: {
          show: paramObj.show,
          pixelSize: paramObj.pixelSize,
          color: Cesium.Color.fromCssColorString(paramObj.color).withAlpha(
            paramObj.rectangleAlpha
          ),
          outlineColor: Cesium.Color.fromCssColorString(paramObj.outlineColor),
          outlineWidth: paramObj.outlineWidth
        },
        option: paramObj.option
      });
      return i2;
    } else {
      console.log("\u8BE5\u5B9E\u4F53\u70B9\u5DF2\u7ECF\u5B58\u5728");
    }
  };
  Map3D.prototype.drawStraight = function(obj) {
    const arg = {
      viewer: this.viewer,
      Cesium
    };
    const res = new DrawStraightArrow(arg, obj);
    res.startCreate();
    return res;
  };
  Map3D.prototype.clickAddMarker = function(paramObj) {
    let _this = this;
    Cesium.Cartesian3.fromDegrees(114, 22);
    this.addMarkerHandler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    this.addMarkerHandler.setInputAction(function(event) {
      if (JSON.stringify(paramObj) != "{}") {
        const position = _this.viewer.scene.pickPosition(event.position);
        _this.viewer.entities.add({
          position,
          billboard: {
            image: paramObj.image,
            color: Cesium.Color.fromCssColorString(paramObj.color).withAlpha(
              paramObj.rectangleAlpha
            ),
            height: paramObj.height,
            width: paramObj.width,
            rotation: paramObj.rotation,
            pixelOffset: new Cesium.Cartesian2(
              paramObj.pixelOffset.x,
              paramObj.pixelOffset.y
            ),
            scale: paramObj.scale,
            show: paramObj.show,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          option: paramObj.option
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  Map3D.prototype.addMarker = function(paramObj) {
    let entity = this.viewer.entities.getById(paramObj.id);
    var position = Cesium.Cartesian3.fromDegrees(114, 22);
    if (paramObj.position.length > 1) {
      position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2] || 0
      );
    }
    if (JSON.stringify(paramObj) != "{}") {
      if (entity == void 0) {
        var newds = this.viewer.entities.add({
          id: paramObj.id,
          position,
          billboard: {
            image: paramObj.image,
            color: Cesium.Color.fromCssColorString(paramObj.color).withAlpha(
              paramObj.rectangleAlpha
            ),
            height: paramObj.height,
            width: paramObj.width,
            rotation: paramObj.rotation,
            pixelOffset: new Cesium.Cartesian2(
              paramObj.pixelOffset.x,
              paramObj.pixelOffset.y
            ),
            scale: paramObj.scale,
            show: paramObj.show
          },
          option: paramObj.option
        });
        console.log("\u6DFB\u52A0\u56FE\u6807");
        if (paramObj.isZoomTo === void 0 || paramObj.isZoomTo) {
          this.viewer.zoomTo(newds);
        }
      } else {
        console.log("\u8BE5\u5B9E\u4F53\u56FE\u6807\u5DF2\u7ECF\u5B58\u5728\uFF0C\u8BF7\u52FF\u91CD\u590D\u6DFB\u52A0");
      }
    }
  };
  Map3D.prototype.updateMarker = function(paramObj) {
    if (JSON.stringify(paramObj) != "{}") {
      const { id, image, color, rectangleAlpha, width, height, rotation, scale, show, option, properties } = paramObj;
      let entity = this.viewer.entities.getById(id);
      if (entity) {
        if (image !== void 0)
          entity.billboard.image = image;
        if (color !== void 0)
          entity.billboard.color = Cesium.Color.fromCssColorString(color).withAlpha(rectangleAlpha || 1);
        if (width !== void 0)
          entity.billboard.width = width;
        if (height !== void 0)
          entity.billboard.height = height;
        if (rotation !== void 0)
          entity.billboard.rotation = rotation;
        if (scale !== void 0)
          entity.billboard.scale = scale;
        if (show !== void 0)
          entity.billboard.show = show;
        if (option !== void 0)
          entity.billboard.option = option || {};
        if (properties !== void 0)
          entity.billboard.properties = properties;
      } else {
        console.log("\u627E\u4E0D\u5230\u5B9E\u4F53\u56FE\u6807");
      }
    }
  };
  const writeToCanvas = (imageUrl, text, options = {}) => {
    const { width, height, fontSize, textColor, textAlign, textBaseline } = options;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        let W = width || 100, H = height || 100, canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = textColor || "rgb(255,255,255)";
        ctx.textAlign = textAlign || "center";
        ctx.textBaseline = textBaseline || "middle";
        ctx.font = `bold ${16 + (fontSize ? fontSize / 10 : 0)}px sans-serif`;
        ctx.drawImage(image, 0, 0, W, H);
        ctx.fillText(text, W / 2, H / 2);
        const result = canvas.toDataURL();
        resolve(result);
      };
      image.onerror = (e) => reject(e);
    });
  };
  Map3D.prototype.addClusterMarkers = function(options) {
    return __async(this, null, function* () {
      const _options = options;
      const _a = _options, {
        id,
        dataType = "DegreesArray",
        data,
        image,
        width = 40,
        height = 40,
        color = "#ffffff",
        rotation,
        pixelOffset = { x: 0, y: 0 },
        rectangleAlpha = 1,
        scale = 1,
        show,
        displayCondition,
        cluster = {
          enabled: true,
          show: true,
          pixelRange: 60,
          minimumClusterSize: 2,
          styleRules: []
        }
      } = _a, rest = __objRest(_a, [
        "id",
        "dataType",
        "data",
        "image",
        "width",
        "height",
        "color",
        "rotation",
        "pixelOffset",
        "rectangleAlpha",
        "scale",
        "show",
        "displayCondition",
        "cluster"
      ]);
      const { viewer: viewer2 } = this;
      if (!data)
        return;
      this[`_batchDataSource${id}`] = void 0;
      this[`_batchRemoveClusterListener${id}`] = void 0;
      if (dataType === "KML") {
        this[`_batchDataSource${id}`] = yield new Cesium.KmlDataSource().load(data);
      } else if (dataType === "GeoJSON") {
        this[`_batchDataSource${id}`] = yield new Cesium.GeoJsonDataSource().load(data);
      } else if (dataType === "DegreesArray" || dataType === "DegreesArrayHeights") {
        this[`_batchDataSource${id}`] = yield new Cesium.CustomDataSource();
        const carts = Cesium.Cartesian3[`from${dataType}`](data.map((item) => item.position).flat());
        data.forEach((item, index) => {
          const _id = item.id ? `${item.id}` : void 0;
          const _image = item.image || image;
          const _displayCondition = item.displayCondition || displayCondition;
          const _width = item.width || width;
          const _height = item.height || height;
          const _color = item.color ? item.color : color ? Cesium.Color.fromCssColorString(color).withAlpha(rectangleAlpha) : Cesium.Color.WHITE;
          const _rotation = item.rotation || rotation;
          const _pixelOffset = item.pixelOffset || pixelOffset;
          const _scale = item.scale || scale;
          const _show = item.show !== void 0 ? item.show : show;
          const entityParams = __spreadValues({
            position: carts[index],
            billboard: {
              image: _image,
              width: _width,
              height: _height,
              color: _color,
              rotation: _rotation,
              pixelOffset: new Cesium.Cartesian2(
                _pixelOffset.x,
                _pixelOffset.y
              ),
              scale: _scale,
              show: _show !== void 0 ? _show : _displayCondition && typeof _displayCondition === "function" ? _displayCondition(item.properties) : true
            },
            properties: item.properties
          }, rest);
          if (_id)
            entityParams.id = _id;
          this[`_batchDataSource${id}`].entities.add(entityParams);
        });
      }
      viewer2.dataSources.add(this[`_batchDataSource${id}`]);
      if (cluster.styleRules && cluster.styleRules.length > 0)
        ;
      else {
        const pinBuilder = new Cesium.PinBuilder();
        cluster.styleRules = [
          {
            backgroundImage: pinBuilder.fromColor(Cesium.Color.RED, 48).toDataURL(),
            count: 50,
            options: {
              width: 60,
              height: 60,
              textBaseline: "bottom"
            }
          },
          {
            backgroundImage: pinBuilder.fromColor(Cesium.Color.ORANGE, 48).toDataURL(),
            count: 40,
            options: {
              width: 60,
              height: 60,
              textBaseline: "bottom"
            }
          },
          {
            backgroundImage: pinBuilder.fromColor(Cesium.Color.YELLOW, 48).toDataURL(),
            count: 30,
            options: {
              width: 60,
              height: 60,
              textBaseline: "bottom"
            }
          },
          {
            backgroundImage: pinBuilder.fromColor(Cesium.Color.GREEN, 48).toDataURL(),
            count: 20,
            options: {
              width: 60,
              height: 60,
              textBaseline: "bottom"
            }
          },
          {
            backgroundImage: pinBuilder.fromColor(Cesium.Color.BLUE, 48).toDataURL(),
            count: 10,
            options: {
              width: 60,
              height: 60,
              textBaseline: "bottom"
            }
          },
          {
            backgroundImage: pinBuilder.fromColor(Cesium.Color.VIOLET, 48).toDataURL(),
            default: true,
            options: {
              width: 60,
              height: 60,
              textBaseline: "bottom"
            }
          }
        ];
      }
      const defaultPin = cluster.styleRules.find((item) => item.default);
      const otherPins = cluster.styleRules.filter((item) => !item.default);
      otherPins.sort((a, b) => b.count - a.count);
      const getSectionMax = (num) => {
        const arr = otherPins.concat();
        return arr.find((item) => num >= item.count);
      };
      const customStyle = () => __async(this, null, function* () {
        if (Cesium.defined(this[`_batchRemoveClusterListener${id}`])) {
          this[`_batchRemoveClusterListener${id}`]();
          this[`_batchRemoveClusterListener${id}`] = null;
        } else {
          this[`_batchRemoveClusterListener${id}`] = this[`_batchDataSource${id}`].clustering.clusterEvent.addEventListener((clusteredEntities, cluster2) => __async(this, null, function* () {
            cluster2.label.show = false;
            cluster2.billboard.show = true;
            cluster2.billboard.id = cluster2.label.id;
            cluster2.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            const pin = getSectionMax(clusteredEntities.length);
            if (pin) {
              cluster2.billboard.image = yield writeToCanvas(pin.backgroundImage, `${pin.count}+`, pin.options || {});
            } else {
              cluster2.billboard.image = yield writeToCanvas(defaultPin.backgroundImage, `${clusteredEntities.length}`, defaultPin.options || {});
            }
          }));
        }
      });
      customStyle();
      const clustering = this[`_batchDataSource${id}`].clustering;
      clustering.enabled = cluster.enabled === void 0 || cluster.enabled ? true : false;
      clustering.show = cluster.show === void 0 || cluster.show ? true : false;
      clustering.pixelRange = cluster.pixelRange || 60;
      clustering.minimumClusterSize = cluster.minimumClusterSize || 2;
      return this[`_batchDataSource${id}`].entities.values;
    });
  };
  Map3D.prototype.updateClusterMarkers = function(options) {
    return __async(this, null, function* () {
      const _options = options;
      const _a = _options, {
        id,
        dataType,
        data,
        image,
        width,
        height,
        color,
        rotation,
        pixelOffset,
        rectangleAlpha,
        scale,
        show,
        displayCondition,
        cluster
      } = _a, rest = __objRest(_a, [
        "id",
        "dataType",
        "data",
        "image",
        "width",
        "height",
        "color",
        "rotation",
        "pixelOffset",
        "rectangleAlpha",
        "scale",
        "show",
        "displayCondition",
        "cluster"
      ]);
      if (data && dataType) {
        this[`_batchDataSource${id}`].entities.removeAll();
        let dataSource = null;
        if (dataType === "KML") {
          dataSource = yield new Cesium.KmlDataSource().load(data);
        } else if (dataType === "GeoJSON") {
          dataSource = yield new Cesium.GeoJsonDataSource().load(data);
        } else if (dataType === "DegreesArray" || dataType === "DegreesArrayHeights") {
          dataSource = yield new Cesium.CustomDataSource();
          const carts = Cesium.Cartesian3[`from${dataType}`](data.map((item) => item.position).flat());
          data.forEach((item, index) => {
            const _id = item.id ? `${item.id}` : void 0;
            const _image = item.image || image;
            const _displayCondition = item.displayCondition || displayCondition;
            const _width = item.width || width;
            const _height = item.height || height;
            const _color = item.color ? item.color : color ? Cesium.Color.fromCssColorString(color).withAlpha(rectangleAlpha) : Cesium.Color.WHITE;
            const _rotation = item.rotation || rotation;
            const _pixelOffset = item.pixelOffset || pixelOffset;
            const _scale = item.scale || scale;
            const _show = item.show !== void 0 ? item.show : show;
            const entityParams = __spreadValues({
              position: carts[index],
              billboard: {
                image: _image,
                width: _width || 40,
                height: _height || 40,
                color: _color,
                rotation: _rotation,
                pixelOffset: new Cesium.Cartesian2(
                  _pixelOffset ? _pixelOffset.x : 0,
                  _pixelOffset ? _pixelOffset.y : 0
                ),
                scale: _scale || 1,
                show: _show !== void 0 ? _show : _displayCondition && typeof _displayCondition === "function" ? _displayCondition(item.properties) : true
              },
              properties: item.properties
            }, rest);
            if (_id)
              entityParams.id = _id;
            dataSource.entities.add(entityParams);
          });
        }
        dataSource.entities.values.forEach((item) => this[`_batchDataSource${id}`].entities.add(dataSource.entities.getById(item.id)));
        dataSource = null;
      } else {
        this[`_batchDataSource${id}`].entities.values.forEach((item) => {
          if (image !== void 0)
            item.billboard.image = image;
          if (width !== void 0)
            item.billboard.width = width;
          if (height !== void 0)
            item.billboard.height = height;
          if (color !== void 0)
            item.billboard.color = Cesium.Color.fromCssColorString(color).withAlpha(rectangleAlpha) || Cesium.Color.WHITE;
          if (rotation !== void 0)
            item.billboard.rotation = rotation;
          if (pixelOffset !== void 0)
            item.billboard.pixelOffset = new Cesium.Cartesian2(pixelOffset.x, pixelOffset.y);
          if (scale !== void 0)
            item.billboard.scale = scale;
          if (displayCondition && typeof displayCondition === "function")
            item.show = displayCondition(item.properties.getValue());
          if (show !== void 0)
            item.billboard.show = show;
        });
      }
      if (cluster) {
        const clustering = this[`_batchDataSource${id}`].clustering;
        clustering.enabled = cluster.enabled === void 0 || cluster.enabled ? true : false;
        clustering.show = cluster.show === void 0 || cluster.show ? true : false;
        clustering.pixelRange = cluster.pixelRange || 60;
        clustering.minimumClusterSize = cluster.minimumClusterSize || 2;
      }
    });
  };
  Map3D.prototype.displayClusterMarkersByProperties = function(options) {
    const { id, condition } = options;
    if (!Cesium.defined(id))
      return;
    if (!Cesium.defined(condition))
      return;
    this[`_batchDataSource${id}`].entities.values.forEach((item) => {
      if (condition && typeof condition === "function")
        item.show = condition(item.properties.getValue());
    });
  };
  Map3D.prototype.removeClusterMarkersByProperties = function(options) {
    const { id, condition } = options;
    if (!Cesium.defined(id))
      return;
    if (!Cesium.defined(condition))
      return;
    const arr = this[`_batchDataSource${id}`].entities.values;
    for (let i2 = arr.length - 1; i2 >= 0; i2--) {
      let entity = this[`_batchDataSource${id}`].entities.getById(arr[i2].id);
      if (Cesium.defined(entity) && condition(entity.properties.getValue())) {
        this[`_batchDataSource${id}`].entities.remove(entity);
        entity = null;
      }
    }
  };
  Map3D.prototype.destroyClusterMarkers = function(options) {
    const _options = options;
    const { id } = _options;
    const { viewer: viewer2 } = this;
    let dataSource = this[`_batchDataSource${id}`];
    if (!dataSource)
      return;
    if (Cesium.defined(this[`_batchRemoveClusterListener${id}`])) {
      this[`_batchRemoveClusterListener${id}`]();
      this[`_batchRemoveClusterListener${id}`] = null;
    }
    let entities = this[`_batchDataSource${id}`].entities;
    if (entities) {
      entities.removeAll();
      entities = null;
    }
    let clustering = this[`_batchDataSource${id}`].clustering;
    if (clustering) {
      clustering.destroy();
      clustering = null;
    }
    if (viewer2.dataSources.contains(dataSource)) {
      viewer2.dataSources.remove(dataSource, true);
      dataSource = null;
    }
  };
  Map3D.prototype.addClusterMarkerByClusterId = function(options) {
    const _a = options, { id, entityId, position, image, width, height, color, rectangleAlpha, rotation, pixelOffset, scale, displayCondition, show, properties } = _a, rest = __objRest(_a, ["id", "entityId", "position", "image", "width", "height", "color", "rectangleAlpha", "rotation", "pixelOffset", "scale", "displayCondition", "show", "properties"]);
    let dataSource = this[`_batchDataSource${id}`];
    if (!dataSource)
      return;
    const _id = entityId;
    const _position = Cesium.Cartesian3.fromDegrees(...position);
    const _image = image;
    const _width = width;
    const _height = height;
    const _color = Cesium.Color.fromCssColorString(color || Cesium.Color.WHITE).withAlpha(rectangleAlpha);
    const _rotation = rotation;
    const _pixelOffset = pixelOffset || { x: 1, y: 1 };
    const _scale = scale;
    const _displayCondition = displayCondition;
    const _show = show !== void 0 ? show : true;
    const entityParams = __spreadValues({
      position: _position,
      billboard: {
        image: _image,
        width: _width,
        height: _height,
        color: _color,
        rotation: _rotation,
        pixelOffset: new Cesium.Cartesian2(
          _pixelOffset.x,
          _pixelOffset.y
        ),
        scale: _scale,
        show: _show !== void 0 ? _show : _displayCondition && typeof _displayCondition === "function" ? _displayCondition(properties) : true
      },
      properties
    }, rest);
    if (_id)
      entityParams.id = _id;
    return this[`_batchDataSource${id}`].entities.add(entityParams);
  };
  Map3D.prototype.addClusterMarkersByClusterId = function(options) {
    return __async(this, null, function* () {
      const _options = options;
      const _a = _options, {
        id,
        dataType = "DegreesArray",
        data,
        image,
        width = 40,
        height = 40,
        color = "#ffffff",
        rotation,
        pixelOffset = { x: 0, y: 0 },
        rectangleAlpha = 1,
        scale = 1,
        show,
        displayCondition
      } = _a, rest = __objRest(_a, [
        "id",
        "dataType",
        "data",
        "image",
        "width",
        "height",
        "color",
        "rotation",
        "pixelOffset",
        "rectangleAlpha",
        "scale",
        "show",
        "displayCondition"
      ]);
      if (!Cesium.defined(data) || data.length <= 0)
        return;
      let dataSource = this[`_batchDataSource${id}`];
      if (!dataSource)
        return;
      let _dataSource = void 0;
      if (dataType === "KML") {
        _dataSource = yield new Cesium.KmlDataSource().load(data);
      } else if (dataType === "GeoJSON") {
        _dataSource = yield new Cesium.GeoJsonDataSource().load(data);
      } else if (dataType === "DegreesArray" || dataType === "DegreesArrayHeights") {
        _dataSource = yield new Cesium.CustomDataSource();
        const carts = Cesium.Cartesian3[`from${dataType}`](data.map((item) => item.position).flat());
        data.forEach((item, index) => {
          const _id = item.id ? `${item.id}` : void 0;
          const _image = item.image || image;
          const _displayCondition = item.displayCondition || displayCondition;
          const _width = item.width || width;
          const _height = item.height || height;
          const _color = item.color ? item.color : color ? Cesium.Color.fromCssColorString(color).withAlpha(rectangleAlpha) : Cesium.Color.WHITE;
          const _rotation = item.rotation || rotation;
          const _pixelOffset = item.pixelOffset || pixelOffset;
          const _scale = item.scale || scale;
          const _show = item.show !== void 0 ? item.show : show;
          const entityParams = __spreadValues({
            position: carts[index],
            billboard: {
              image: _image,
              width: _width,
              height: _height,
              color: _color,
              rotation: _rotation,
              pixelOffset: new Cesium.Cartesian2(
                _pixelOffset.x,
                _pixelOffset.y
              ),
              scale: _scale,
              show: _show !== void 0 ? _show : _displayCondition && typeof _displayCondition === "function" ? _displayCondition(item.properties) : true
            },
            properties: item.properties
          }, rest);
          if (_id)
            entityParams.id = _id;
          _dataSource.entities.add(entityParams);
        });
      }
      _dataSource.entities.values.forEach((item) => {
        const entity = _dataSource.entities.getById(item.id);
        if (entity && !this[`_batchDataSource${id}`].entities.getById(entity)) {
          this[`_batchDataSource${id}`].entities.add(entity);
        }
      });
      return _dataSource.entities.values;
    });
  };
  Map3D.prototype.addFlame = function(paramObj) {
    var position = Cesium.Cartesian3.fromDegrees(114, 22);
    if (paramObj.position.length > 1) {
      position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2] || 0
      );
    }
    this.viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        image: paramObj.image,
        startColor: Cesium.Color.fromCssColorString(
          paramObj.startColor
        ).withAlpha(0.6),
        endColor: Cesium.Color.fromCssColorString(paramObj.endColor).withAlpha(
          0.3
        ),
        startScale: paramObj.startScale,
        endScale: paramObj.endScale,
        minimumParticleLife: paramObj.minimumParticleLife,
        maximumParticleLife: paramObj.maximumParticleLife,
        minimumSpeed: paramObj.minimumSpeed,
        maximumSpeed: paramObj.maximumSpeed,
        emitter: new Cesium.CircleEmitter(paramObj.emitter),
        imageSize: new Cesium.Cartesian2(
          paramObj.imageSize[0],
          paramObj.imageSize[1]
        ),
        emissionRate: paramObj.emissionRate,
        lifetime: paramObj.lifetime,
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
        loop: true
      })
    );
  };
  Map3D.prototype.addInformation = function(paramObj) {
    console.log("addInformation", paramObj);
    document.getElementById(paramObj.id);
    var newposition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
    if (paramObj.position.length > 1) {
      newposition = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        -50
      );
    }
    var bubble = document.getElementById("bubbleContent");
    if (!bubble) {
      var div = document.createElement("div");
      div.id = "bubbleContent";
      document.body.appendChild(div);
      bubble = document.getElementById("bubbleContent");
    }
    if (paramObj.HTMLdiv instanceof Element) {
      var classStr = paramObj.HTMLdiv.className;
      paramObj.HTMLdiv.className += (classStr ? " " : "") + "leaflet-popup";
      paramObj.HTMLdiv.style.position = "absolute";
    }
    bubble[`insertAdjacent${paramObj.HTMLdiv instanceof Element ? "Element" : "HTML"}`]("beforeend", paramObj.HTMLdiv);
    var realTime = new Object();
    realTime.PopupsID = paramObj.popid;
    realTime.scenePosition = newposition;
    realTime.paramObj = paramObj;
    if (this.Popups.length == 0) {
      this.Popups.push(realTime);
    }
    var bools = true;
    for (var i2 = 0; i2 < this.Popups.length; i2++) {
      if (this.Popups[i2].PopupsID == paramObj.popid) {
        this.Popups[i2] = realTime;
        bools = false;
      }
    }
    if (bools) {
      this.Popups.push(realTime);
    }
    var that2 = this;
    this.popevent = function() {
      if (that2.Popups.length > 0) {
        for (var i3 = 0; i3 < that2.Popups.length; i3++) {
          var infoboxContainer = document.getElementById(that2.Popups[i3].PopupsID);
          if (infoboxContainer != null && infoboxContainer) {
            if (that2.Popups[i3].scenePosition) {
              var canvasHeight = that2.viewer.scene.canvas.height;
              var windowPosition = new Cesium.Cartesian2();
              Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                that2.viewer.scene,
                that2.Popups[i3].scenePosition,
                windowPosition
              );
              infoboxContainer.style.bottom = canvasHeight - windowPosition.y + that2.Popups[i3].paramObj.Offset.y + "px";
              infoboxContainer.style.left = windowPosition.x + that2.Popups[i3].paramObj.Offset.x + -(infoboxContainer.scrollWidth / 2) + "px";
            }
            var height = Math.ceil(that2.viewer.camera.positionCartographic.height);
            if (paramObj.heighthidenum < height) {
              infoboxContainer.style.display = "none";
            } else {
              infoboxContainer.style.display = "block";
            }
            const mode = that2.viewer.scene.mode;
            if (mode === 3) {
              const cameraPosition = that2.viewer.camera.position;
              let cameraheight = that2.viewer.scene.globe.ellipsoid.cartesianToCartographic(cameraPosition).height;
              cameraheight += that2.viewer.scene.globe.ellipsoid.maximumRadius;
              if (!(Cesium.Cartesian3.distance(cameraPosition, that2.Popups[i3].scenePosition) > cameraheight) && that2.viewer.camera.positionCartographic.height < 5e7) {
                infoboxContainer.style.display = "block";
              } else {
                infoboxContainer.style.display = "none";
              }
            }
          }
        }
      }
    };
    this.viewer.scene.postRender.addEventListener(this.popevent);
  };
  Map3D.prototype.add3DTileset = function(obj) {
    var tileset = new Cesium.Cesium3DTileset({
      url: new Cesium.Resource({
        url: obj.url,
        headers: {
          "szvsud-license-key": "CVz440zV4BE7fCSznRZvnE6J/SCKlMDbCjGBRD9XtmwvQE2h+NK4qJI/0feODJfIrU/Cb6BQ2ZgMhkzEJUARAQ=="
        }
      })
    });
    this.viewer.scene.primitives.add(tileset);
    this.viewer.zoomTo(tileset);
  };
  Map3D.prototype.deleteInformation = function(paramObj) {
    var entity = document.getElementById(paramObj.popid);
    if (entity) {
      $(entity).remove();
      for (var i2 = 0; i2 < this.Popups.length; i2++) {
        var pop = this.Popups[i2];
        if (pop.PopupsID == paramObj.popid) {
          this.Popups.splice(i2, 1);
          i2--;
        }
      }
    } else {
      console.log("\u8BE5\u5B9E\u4F53\u4E0D\u5B58\u5728");
    }
  };
  Map3D.prototype.drawTest = function(paramObj) {
    const $this = this;
    if (document.getElementById("popupContainer")) {
      document.getElementsByName("popupContainerInput")[0].value = "";
    } else {
      $("#cesiumContainer").append(paramObj.inputHTML);
    }
    let popWindow = new PopUpOnWindowPosition(this.viewer, paramObj);
    $this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    $this.handler.setInputAction(function(movement) {
      $this.testMovement = __spreadValues({}, movement.position);
      popWindow.setPositon(
        movement
      );
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  Map3D.prototype.closePopupContainer = function() {
    document.getElementById("popupContainer").style.display = "none";
    if (this.handler) {
      this.handler.destroy();
      delete this.handler;
    }
  };
  Map3D.prototype.insuePopupEnsure = function(paramObj) {
    if (this.handler) {
      this.handler.destroy();
      delete this.handler;
    }
    document.getElementById("popupContainer").style.display = "none";
    let entity = this.viewer.entities.getById(paramObj.id);
    var position = this.viewer.scene.pickPosition(this.testMovement);
    if (typeof entity === "undefined") {
      this.viewer.entities.add({
        id: paramObj.id,
        position,
        label: {
          text: paramObj.text,
          font: paramObj.font,
          scale: paramObj.scale,
          fillColor: Cesium.Color.fromCssColorString(paramObj.fillColor),
          pixelOffset: new Cesium.Cartesian2(
            paramObj.pixelOffset.x,
            paramObj.pixelOffset.y
          ),
          showBackground: paramObj.showBackground,
          backgroundColor: Cesium.Color.fromCssColorString(
            paramObj.backgroundColor
          ),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        option: paramObj.option
      });
    } else {
      console.log("\u8BE5\u5B9E\u4F53\u6807\u7B7E\u5DF2\u7ECF\u5B58\u5728");
    }
  };
  Map3D.prototype.addLabel = function(paramObj) {
    let entity = this.viewer.entities.getById(paramObj.id);
    var position = Cesium.Cartesian3.fromDegrees(114, 22);
    if (paramObj.position.length > 1) {
      position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2] || 0
      );
    }
    if (entity == void 0) {
      var news = this.viewer.entities.add({
        id: paramObj.id,
        position,
        label: {
          text: paramObj.text,
          font: paramObj.font,
          scale: paramObj.scale,
          fillColor: Cesium.Color.fromCssColorString(paramObj.fillColor),
          pixelOffset: new Cesium.Cartesian2(
            paramObj.pixelOffset.x,
            paramObj.pixelOffset.y
          ),
          showBackground: paramObj.showBackground,
          backgroundColor: Cesium.Color.fromCssColorString(
            paramObj.backgroundColor
          )
        },
        option: paramObj.option
      });
      if (paramObj.isZoomTo === void 0 || paramObj.isZoomTo) {
        this.viewer.zoomTo(news);
      }
    } else {
      console.log("\u8BE5\u5B9E\u4F53\u6807\u7B7E\u5DF2\u7ECF\u5B58\u5728");
    }
  };
  Map3D.prototype.addLine = function(paramObj) {
    var positions = [];
    for (var i2 = 0; i2 < paramObj.positions.length; i2++) {
      positions = positions.concat(paramObj.positions[i2]);
    }
    let entity = this.viewer.entities.getById(paramObj.id);
    if (entity) {
      console.log("\u8BE5\u5B9E\u4F53\u6807\u7B7E\u5DF2\u7ECF\u5B58\u5728");
    } else {
      if (positions.length > 0) {
        this.viewer.entities.add({
          id: paramObj.id,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
            width: paramObj.width || 2,
            material: Cesium.Color.fromCssColorString(paramObj.color)
          },
          option: paramObj.option
        });
      }
    }
  };
  Map3D.prototype.updateLine = function(paramObj) {
    var viewer2 = this.viewer;
    if (JSON.stringify(paramObj) != "{}") {
      let entity = viewer2.entities.getById(paramObj.id);
      if (entity) {
        entity.polyline.material = Cesium.Color.fromCssColorString(paramObj.color);
        entity.width = paramObj.width;
      } else {
        console.log("\u627E\u4E0D\u5230\u5B9E\u4F53");
      }
    }
  };
  Map3D.prototype.addPolygon = function(obj) {
    let entity = this.viewer.entities.getById(obj.id);
    var positions = [];
    for (var i2 = 0; i2 < obj.positions.length; i2++) {
      positions = positions.concat(obj.positions[i2]);
    }
    var newhierarchy = void 0;
    if (obj.positions[0].length == 2) {
      newhierarchy = Cesium.Cartesian3.fromDegreesArray(positions);
    } else if (obj.positions[0].length == 3) {
      newhierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
    }
    if (JSON.stringify(obj) != "{}") {
      if (entity == void 0) {
        if (newhierarchy) {
          this.viewer.entities.add({
            id: obj.id,
            name: obj.name,
            polygon: {
              hierarchy: newhierarchy,
              extrudedHeight: obj.extrudedHeight || 0,
              material: Cesium.Color.fromCssColorString(obj.color).withAlpha(
                obj.opacity
              ),
              outline: obj.isoutline,
              outlineColor: Cesium.Color.fromCssColorString(obj.outlineColor)
            },
            option: obj.option
          });
        } else {
          console.warn("\u8B66\u544A", "\u5750\u6807\u8F6C\u6362\u51FA\u9519");
        }
      } else {
        console.log("\u6B64\u5B9E\u4F53\u5DF2\u5B58\u5728");
      }
    }
  };
  Map3D.prototype.updatePolygon = function(obj) {
    if (JSON.stringify(obj) != "{}") {
      let viewer2 = this.viewer;
      let entity = viewer2.entities.getById(obj.id);
      if (entity) {
        entity.polygon.outline = obj.isoutline;
        if (obj.isoutline) {
          entity.polygon.outlineColor = Cesium.Color.fromCssColorString(
            obj.outlineColor
          );
        } else {
          entity.polygon.outlineColor = Cesium.Color.TRANSPARENT;
        }
        entity.polygon.material = Cesium.Color.fromCssColorString(
          obj.color
        ).withAlpha(obj.rectangleAlpha);
        entity.polygon.extrudedHeight = obj.extrudedHeight;
      } else {
        console.log("\u627E\u4E0D\u5230\u5B9E\u4F53");
      }
    }
  };
  Map3D.prototype.addadmini3d = function(obj) {
    let viewer2 = this.viewer;
    var promise = Cesium.GeoJsonDataSource.load(obj.geojsonurl);
    promise.then(function(dataSource) {
      dataSource.name = obj.name;
      viewer2.dataSources.add(dataSource);
      var entities = dataSource.entities.values;
      for (var i2 = 0; i2 < entities.length; i2++) {
        var entity = entities[i2];
        if (i2 <= obj.color.length - 1) {
          entity.polygon.material = Cesium.Color.fromCssColorString(
            obj.color[i2]
          ).withAlpha(obj.alpha);
        } else {
          entity.polygon.material = Cesium.Color.fromRandom({
            alpha: obj.alpha
          });
        }
        entity.polygon.outline = obj.isoutline || false;
        if (obj.outlineColor) {
          entity.polygon.outlineColor = Cesium.Color.fromCssColorString(
            obj.outlineColor
          );
        } else {
          entity.polygon.outlineColor = void 0;
        }
        entity.polygon.extrudedHeight = obj.extrudedHeight;
        entity.option = obj.option;
      }
      viewer2.zoomTo(entities);
    });
  };
  Map3D.prototype.getadmini3dinfo = function(obj) {
    var geopolygons = this.viewer.dataSources.getByName(obj.name);
    if (geopolygons) {
      var geopolygon = geopolygons[0];
      if (geopolygon.entities.values.length > 0) {
        var infoList = new Array();
        for (var i2 = 0; i2 < geopolygon.entities.values.length; i2++) {
          var entity = geopolygon.entities.values[i2];
          var newoption = new Object();
          Object.assign(newoption, entity.option);
          if (entity.properties) {
            var propertyNames = entity.properties._propertyNames;
            for (var j = 0; j < propertyNames.length; j++) {
              var name = propertyNames[j];
              var val = entity.properties["_" + name].getValue();
              newoption[name] = val;
            }
          }
          infoList.push(newoption);
        }
        return infoList;
      }
      return void 0;
    } else {
      return void 0;
    }
  };
  Map3D.prototype.addgltfmodel = function(obj) {
    var entity = this.viewer.entities.getById(obj.id);
    if (entity == void 0) {
      var position = Cesium.Cartesian3.fromDegrees(
        obj.position[0],
        obj.position[1],
        obj.position[2]
      );
      var heading = Cesium.Math.toRadians(obj.heading || 0);
      var pitch = Cesium.Math.toRadians(obj.pitch || 0);
      var roll = Cesium.Math.toRadians(obj.roll || 0);
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      var newcolor = void 0;
      if (obj.hlightcolor) {
        newcolor = new Cesium.Color.fromCssColorString(obj.hlightcolor).withAlpha(
          obj.alpha || 1
        );
      }
      var entity = this.viewer.entities.add({
        id: obj.id,
        position,
        orientation,
        model: {
          uri: obj.url,
          scale: obj.scale,
          color: newcolor,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            obj.distanceDisplayCondition[0] || 0,
            obj.distanceDisplayCondition[1] || 2e8
          )
        },
        option: obj.option
      });
      return entity;
    } else {
      console.log("id\u76F8\u540C,\u5DF2\u5B58\u5728");
    }
  };
  Map3D.prototype.add3Dmodel = function(obj) {
    var position = Cesium.Cartesian3.fromDegrees(
      obj.position[0],
      obj.position[1],
      obj.position[2]
    );
    var heading = Cesium.Math.toRadians(obj.heading);
    var pitch = Cesium.Math.toRadians(obj.pitch);
    var roll = Cesium.Math.toRadians(obj.roll);
    var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var converter = Cesium.Transforms.eastNorthUpToFixedFrame;
    var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      hpRoll,
      Cesium.Ellipsoid.WGS84,
      converter
    );
    var tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: obj.url,
        show: obj.show,
        asset: {
          id: obj.id
        }
      })
    );
    tileset.readyPromise.then(function() {
      tileset._root.transform = modelMatrix;
      tileset.asset.id = obj.id;
      Object.assign(tileset.asset, obj.option);
    }).otherwise(function(error) {
      throw error;
    });
    return tileset;
  };
  Map3D.prototype.get3Dmodelbyid = function(obj) {
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    for (var i2 = 0; i2 < length; ++i2) {
      var p = primitives.get(i2);
      if (p.asset.id === obj.id) {
        return p.asset;
      }
    }
  };
  Map3D.prototype.Highlightmodelbyid = function(obj) {
    for (var j = 0; j < obj.ids.length; j++) {
      var id = obj.ids[j];
      var entity = this.viewer.entities.getById(id);
      if (entity) {
        if (entity.model) {
          if (obj.ishighlight) {
            this.modelcolors[id] = entity.model.color;
            entity.model.color = new Cesium.Color.fromCssColorString(
              obj.color
            ).withAlpha(obj.alpha || 1);
          } else {
            if (this.modelcolors[id]) {
              entity.model.color = this.modelcolors[id];
            } else {
              entity.model.color = void 0;
              this.modelcolors[id] = void 0;
            }
          }
        }
      }
    }
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    for (var i2 = 0; i2 < length; ++i2) {
      var p = primitives.get(i2);
      if (p instanceof Cesium.Cesium3DTileset) {
        if (p.asset) {
          if (obj.ids.indexOf(p.asset.id) > 0) {
            if (obj.ishighlight) {
              this.modelcolors[p.asset.id] = p.style;
              p.style = new Cesium.Cesium3DTileStyle({
                color: {
                  conditions: [
                    ["true", 'color("' + obj.color + '",' + obj.alpha + ")"]
                  ]
                }
              });
            } else {
              p.style = this.modelcolors[p.asset.id] || void 0;
              this.modelcolors[p.asset.id] = void 0;
            }
          }
        }
      }
    }
  };
  Map3D.prototype.CancelHighlightmodelALL = function() {
    var entityvals = this.viewer.entities.values;
    for (var e = 0; e < entityvals.length; ++e) {
      var entity = entityvals[e];
      if (entity.model) {
        entity.model.color = this.modelcolors[entity.id] || void 0;
        this.modelcolors[entity.id] = void 0;
      }
    }
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    for (var i2 = 0; i2 < length; ++i2) {
      var p = primitives.get(i2);
      if (p instanceof Cesium.Cesium3DTileset) {
        p.style = this.modelcolors[p.asset.id] || void 0;
        this.modelcolors[p.asset.id] = void 0;
      }
    }
  };
  Map3D.prototype.deleteentitybyid = function(obj) {
    for (var j = 0; j < obj.ids.length; j++) {
      var id = obj.ids[j];
      var entity = this.viewer.entities.getById(id);
      if (entity) {
        this.viewer.entities.remove(entity);
      }
    }
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    for (var i2 = 0; i2 < length; ++i2) {
      var p = primitives.get(i2);
      if (p instanceof Cesium.Cesium3DTileset) {
        if (p.asset) {
          if (obj.ids.indexOf(p.asset.id) > 0) {
            this.viewer.scene.primitives.remove(p);
          }
        }
      }
    }
  };
  Map3D.prototype.showentitybyid = function(obj) {
    for (var j = 0; j < obj.ids.length; j++) {
      var id = obj.ids[j];
      var entity = this.viewer.entities.getById(id);
      if (entity) {
        entity.show = obj.isshow;
      }
    }
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    for (var i2 = 0; i2 < length; ++i2) {
      var p = primitives.get(i2);
      if (p instanceof Cesium.Cesium3DTileset) {
        if (p.asset) {
          if (obj.ids.indexOf(p.asset.id) > 0) {
            p.show = obj.isshow;
          }
        }
      }
    }
  };
  Map3D.prototype.registMouseMoveEvnet = function(options) {
    const { viewer: viewer2 } = this;
    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    handler.setInputAction((movement) => {
      const pick = viewer2.scene.pick(movement.endPosition);
      console.log("\u6CE8\u518C\u4E86\u79FB\u52A8\u4E8B\u4EF6");
      var newposition = viewer2.scene.pickPosition(movement.endPosition);
      let tempPos = null;
      let longitude = 0;
      let latitude = 0;
      let height = 0;
      let entity = null;
      let customOption = null;
      if (newposition) {
        tempPos = newposition.clone();
      } else {
        tempPos = viewer2.camera.pickEllipsoid(movement.endPosition);
      }
      if (tempPos) {
        const cartographic = Cesium.Cartographic.fromCartesian(tempPos);
        longitude = Cesium.Math.toDegrees(cartographic.longitude);
        latitude = Cesium.Math.toDegrees(cartographic.latitude);
        height = cartographic.height > 0 ? cartographic.height : 0;
      }
      if (pick && pick.id && pick.id instanceof Cesium.Entity) {
        entity = pick.id;
        if (pick.id.option) {
          customOption = pick.id.option;
        }
      }
      if (options.onMove && typeof options.onMove === "function") {
        options.onMove({
          position: [longitude, latitude, height],
          entity,
          option: customOption
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    const eventType = Cesium.ScreenSpaceEventType.MOUSE_MOVE;
    return this.addRegisteredEvent(eventType, handler);
  };
  Map3D.prototype.destroyMouseMoveEvnet = function(params) {
    this.removeRegisteredEvent(Cesium.ScreenSpaceEventType.MOUSE_MOVE, params);
  };
  Map3D.prototype.registdbClickEvnet = function(obj) {
    const { viewer: viewer2 } = this;
    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    var that2 = this;
    handler.setInputAction(function(movement) {
      var pick = that2.viewer.scene.pick(movement.position);
      console.log("\u6CE8\u518C\u4E86\u53CC\u51FB\u4E8B\u4EF6");
      if (pick) {
        if (pick.id instanceof Cesium.Entity) {
          var option = pick.id.option;
          if (option) {
            obj.dbClickevent(option);
          }
        }
      }
      var newposition = that2.viewer.scene.pickPosition(movement.position);
      let tempPos = null;
      let longitude = 0;
      let latitude = 0;
      let height = 0;
      let entity = null;
      let customOption = null;
      if (newposition) {
        tempPos = newposition.clone();
      } else {
        tempPos = viewer2.camera.pickEllipsoid(movement.position);
      }
      if (tempPos) {
        const cartographic = Cesium.Cartographic.fromCartesian(tempPos);
        longitude = Cesium.Math.toDegrees(cartographic.longitude);
        latitude = Cesium.Math.toDegrees(cartographic.latitude);
        height = cartographic.height > 0 ? cartographic.height : 0;
      }
      if (pick && pick.id && pick.id instanceof Cesium.Entity) {
        entity = pick.id;
        if (pick.id.option) {
          customOption = pick.id.option;
        }
      }
      if (obj.onDbClick && typeof obj.onDbClick === "function") {
        obj.onDbClick({
          position: [longitude, latitude, height],
          entity,
          option: customOption
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    const eventType = Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK;
    return this.addRegisteredEvent(eventType, handler);
  };
  Map3D.prototype.destroydbClickEvnet = function(params) {
    this.removeRegisteredEvent(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK, params);
  };
  Map3D.prototype.registclickEvnet = function(obj) {
    const { viewer: viewer2 } = this;
    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    handler.setInputAction((movement) => {
      var pick = this.viewer.scene.pick(movement.position);
      if (pick) {
        if (pick.id instanceof Cesium.Entity) {
          var option = pick.id.option;
          if (option) {
            obj.clickevent(option);
          }
        }
      }
      var newposition = this.viewer.scene.pickPosition(movement.position);
      let tempPos = null;
      let longitude = 0;
      let latitude = 0;
      let height = 0;
      let entity = null;
      let customOption = null;
      if (newposition) {
        tempPos = newposition.clone();
      } else {
        tempPos = viewer2.camera.pickEllipsoid(movement.position);
      }
      if (tempPos) {
        const cartographic = Cesium.Cartographic.fromCartesian(tempPos);
        longitude = Cesium.Math.toDegrees(cartographic.longitude);
        latitude = Cesium.Math.toDegrees(cartographic.latitude);
        height = cartographic.height > 0 ? cartographic.height : 0;
      }
      if (pick && pick.id && pick.id instanceof Cesium.Entity) {
        entity = pick.id;
        if (pick.id.option) {
          customOption = pick.id.option;
        }
      }
      if (obj.onClick && typeof obj.onClick === "function") {
        obj.onClick({
          position: [longitude, latitude, height],
          entity,
          option: customOption
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    const eventType = Cesium.ScreenSpaceEventType.LEFT_CLICK;
    return this.addRegisteredEvent(eventType, handler);
  };
  Map3D.prototype.destroyclickEvnet = function(params) {
    this.removeRegisteredEvent(Cesium.ScreenSpaceEventType.LEFT_CLICK, params);
  };
  Map3D.prototype.addRegisteredEvent = function(eventType, handler) {
    if (!Cesium.defined(this.registeredEventMap))
      this.registeredEventMap = {};
    if (!Cesium.defined(this.registeredEventMap[eventType]))
      this.registeredEventMap[eventType] = {};
    const uuid = Cesium.randomUUID();
    this.registeredEventMap[eventType][uuid] = handler;
    return uuid;
  };
  Map3D.prototype.removeRegisteredEvent = function(eventType, uuids) {
    if (!Cesium.defined(this.registeredEventMap))
      return;
    const eventMap = this.registeredEventMap[eventType];
    if (!Cesium.defined(eventMap))
      return;
    let ids = [];
    if (uuids === void 0) {
      ids = uuids;
    } else if (typeof uuids === "string") {
      ids.push(uuids);
    } else if (uuids instanceof Array) {
      ids = uuids.concat();
    }
    Object.keys(eventMap).forEach((key) => {
      if (ids && !ids.includes(key))
        return;
      let handler = eventMap[key];
      if (!Cesium.defined(handler))
        return;
      handler.removeInputAction(eventType);
      handler.destroy();
      eventMap[key] = null;
      delete eventMap[key];
    });
  };
  Map3D.prototype.registmapzoom = function(paramObj) {
    var that2 = this;
    this.moveEndmapzoom = function() {
      var level = that2.getZoom();
      paramObj.zoomchangEvent(level);
    };
    this.viewer.camera.moveEnd.addEventListener(this.moveEndmapzoom);
  };
  Map3D.prototype.destroymapzoom = function(paramObj) {
    if (this.moveEndmapzoom) {
      console.log("\u6CE8\u9500\u4E86\u5730\u56FE\u7F29\u653E\u4E8B\u4EF6");
      this.viewer.camera.moveEnd.removeEventListener(this.moveEndmapzoom);
    }
  };
  Map3D.prototype.getZoom = function() {
    var height = this.viewer.scene.camera.positionCartographic.height;
    var arr = this.zoomLevel.concat();
    var value = arr.sort(function(a, b) {
      return Math.abs(a - height) - Math.abs(b - height);
    })[0];
    Array.prototype.getIndex = function(obj) {
      var i2 = this.length;
      for (i2; i2 != 0; i2 -= 1) {
        if (this[i2 - 1] == obj) {
          return i2;
        }
      }
      return -1;
    };
    var level = this.zoomLevel.getIndex(value);
    return level;
  };
  Map3D.prototype.getbounds = function(datas) {
    var lons = [];
    var lats = [];
    var vals = [];
    for (var i2 = 0; i2 < datas.length; i2++) {
      var data = datas[i2];
      var lon = Number(data.x);
      var lat = Number(data.y);
      var val = Number(data.value);
      if (isNaN(lon) || isNaN(lat) || isNaN(val)) {
        console.warn("\u5B58\u5728\u975E\u6570\u5B57\u7C7B\u578B");
        continue;
      }
      lons.push(lon);
      lats.push(lat);
      vals.push(val);
    }
    lons.sort(function(a, b) {
      return a - b;
    });
    lats.sort(function(a, b) {
      return a - b;
    });
    vals.sort(function(a, b) {
      return a - b;
    });
    var obj = {
      west: lons[0],
      east: lons[lons.length - 1],
      south: lats[0],
      north: lats[lats.length - 1],
      valueMin: 0,
      valueMax: vals[vals.length - 1]
    };
    return obj;
  };
  Map3D.prototype.addHeatmap = function(paramObj) {
    let datab = this.getbounds(paramObj.points);
    let bounds = {
      west: datab.west,
      east: datab.east,
      south: datab.south,
      north: datab.north
    };
    this.heatMap = CesiumHeatmap.create(this.viewer, bounds, paramObj.heatmap);
    var obj = {
      valueMin: datab.valueMin,
      valueMax: datab.valueMax,
      datas: paramObj.points,
      id: paramObj.id
    };
    this.heatMap.setWGS84Data(obj);
    var entity = this.viewer.entities.getById(paramObj.id);
    return entity;
  };
  Map3D.prototype.deleteHeatmap = function(paramObj) {
    if (this.heatMap) {
      this.heatMap.removebyid(paramObj.id);
      this.heatMap = void 0;
    }
  };
  Map3D.prototype.add3DHeatmap = function(paramObj) {
    this.heatcolum = new HeatColumn({
      viewer: this.viewer
    });
    var obj = {
      id: paramObj.id,
      pointdata: paramObj.pointdata,
      columnSide: paramObj.columnSide,
      columnfillList: paramObj.columnfillList
    };
    this.heatcolum.createsquareGrid(obj);
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        114.04866695646105,
        22.54199417627788,
        600
      ),
      orientation: {
        heading: Cesium.Math.toRadians(90),
        pitch: Cesium.Math.toRadians(-40),
        roll: 0
      }
    });
  };
  Map3D.prototype.delete3DHeatmap = function(paramObj) {
    if (this.heatcolum) {
      this.heatcolum.removeheatcolumnbyid(paramObj.id);
      this.heatcolum = void 0;
    }
  };
  var newId = void 0;
  Map3D.prototype.addFlyLine = function(paramObj) {
    if (newId == void 0) {
      var view = this.viewer;
      newId = paramObj.id;
      view.scene.globe.enableLighting = true;
      let data = [];
      data[0] = paramObj.data;
      var overData = paramObj.data;
      var lastElement = overData.slice(-1);
      let start = Cesium.JulianDate.fromDate(new Date());
      let stops = lastElement[0].time;
      let stop = Cesium.JulianDate.addSeconds(
        start,
        stops,
        new Cesium.JulianDate()
      );
      view.clock.startTime = start.clone();
      view.clock.currentTime = start.clone();
      view.clock.stopTime = stop.clone();
      view.clock.multiplier = paramObj.multiplier;
      view.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      for (let j = 0; j < data.length; j++) {
        let computeFlight = function(source) {
          let property2 = new Cesium.SampledPositionProperty();
          for (let i2 = 0; i2 < source.length; i2++) {
            let time = Cesium.JulianDate.addSeconds(
              start,
              source[i2].time,
              new Cesium.JulianDate()
            );
            let position = Cesium.Cartesian3.fromDegrees(
              source[i2].x,
              source[i2].y,
              source[i2].z
            );
            property2.addSample(time, position);
          }
          return property2;
        };
        let property = computeFlight(data[j]);
        var pathPosition = new Cesium.SampledPositionProperty();
        let planeModel = view.entities.add({
          id: paramObj.id,
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
              start,
              stop
            })
          ]),
          position: property,
          orientation: new Cesium.VelocityOrientationProperty(property),
          model: {
            uri: paramObj.uri,
            minimumPixelSize: paramObj.minimumPixelSize,
            maximumScale: paramObj.maximumScale
          },
          positions: pathPosition,
          path: {
            show: paramObj.show || false,
            leadTime: paramObj.leadTime,
            trailTime: paramObj.trailTime,
            width: paramObj.width,
            resolution: paramObj.resolution,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: paramObj.glowPower,
              taperPower: paramObj.taperPower
            })
          }
        });
        view.trackedEntity = planeModel;
        planeModel.viewFrom = new Cesium.Cartesian3(-40, 0, 10);
      }
    } else {
      console.log("\u6B63\u5728\u98DE\u884C\u5DE1\u6E38");
    }
  };
  Map3D.prototype.deleteFlyLine = function(paramObj) {
    if (newId) {
      var viewer2 = this.viewer;
      viewer2.clock.multiplier = 0;
      viewer2.entities.removeAll();
      newId = void 0;
    } else {
      console.log("\u6CA1\u6709\u5B9E\u4F53\u5728\u5DE1\u6E38");
    }
  };
  Map3D.prototype.pointSelected = function(newid) {
    const $this = this;
    this.pointSelectedHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.pointSelectedHandler.setInputAction(function(movement) {
      var pointSelectedRes = $this.viewer.scene.pick(movement.position);
      if (pointSelectedRes) {
        $this.pointSelectedRes = pointSelectedRes;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  Map3D.prototype.deleteNewid = function() {
    if (this.newid) {
      var ent = window.drawgeometry.getEntityById(this.newid);
      window.drawgeometry.deleteEntity(ent);
    }
  };
  Map3D.prototype.updateNewid = function(newid) {
    if (this.openBox) {
      this.newid = newid;
      this.openBox = false;
    }
  };
  Map3D.prototype.calculateRectangular = function() {
    try {
      if (this.pointSelectedRes) {
        return this.pointSelected;
      }
      if (this.newid) {
        var entity = window.drawgeometry.getEntitys();
        let calculRes = [];
        var selectEntity = window.drawgeometry.getEntityById(this.newid);
        var selectEntityPositions = selectEntity._positions_draw;
        var commedSelectEntity = this.commed(selectEntityPositions);
        var features1 = turf.featureCollection([
          turf.point(commedSelectEntity[0], {
            "name": "Location A"
          }),
          turf.point(commedSelectEntity[1], {
            "name": "Location B"
          })
        ]);
        var compareOneEnvelope = turf.envelope(features1);
        var compareOne = turf.polygon(compareOneEnvelope.geometry.coordinates);
        for (let s of entity) {
          if (s._attribute.attr.id !== this.newid) {
            let enveloped = null;
            if (s._attribute.type == "circle") {
              const arr = s._positions_draw;
              const commed = this.commed(arr);
              var features = turf.featureCollection([
                turf.point(commed[0], {
                  "name": "Location A"
                }),
                turf.point(commed[1], {
                  "name": "Location B"
                })
              ]);
              enveloped = turf.envelope(features);
            } else if (s._attribute.type == "rectangle") {
              const arr = s._positions_draw;
              const commed = this.commed(arr);
              var features = turf.featureCollection([
                turf.point(commed[0], {
                  "name": "Location A"
                }),
                turf.point(commed[1], {
                  "name": "Location B"
                })
              ]);
              enveloped = turf.envelope(features);
            } else if (s._attribute.type == "polygon") {
              const arr = s._positions_draw;
              const commed = this.commed(arr);
              var features = turf.featureCollection([
                turf.point(commed[0], {
                  "name": "Location A"
                }),
                turf.point(commed[1], {
                  "name": "Location B"
                }),
                turf.point(commed[2], {
                  "name": "Location B"
                })
              ]);
              enveloped = turf.envelope(features);
            } else if (s._attribute.type == "polyline") {
              const arr = s._positions_draw;
              const commed = this.commed(arr);
              var features = turf.featureCollection([
                turf.point(commed[0], {
                  "name": "Location A"
                }),
                turf.point(commed[1], {
                  "name": "Location B"
                })
              ]);
              enveloped = turf.envelope(features);
            }
            var polygon2 = turf.polygon(enveloped.geometry.coordinates);
            var boo = turf.booleanContains(compareOne, enveloped);
            if (boo) {
              calculRes.push(s);
            }
          }
        }
        return calculRes;
      }
    } catch (e) {
      console.log("\u51FA\u9519\u5566" + e);
      return e;
    }
  };
  Map3D.prototype.commed = function(arr) {
    var polygon = [];
    arr.forEach(function(r) {
      var ellipsoid = mapObj.viewer.scene.globe.ellipsoid;
      var wgs84 = ellipsoid.cartesianToCartographic(r);
      polygon.push([
        Cesium.Math.toDegrees(wgs84.longitude),
        Cesium.Math.toDegrees(wgs84.latitude)
      ]);
    });
    return polygon;
  };
  Map3D.prototype.measuredistance = function(paramObj) {
    var _this = this;
    _this.destroymeasure();
    function getLineDis(startPoint2, endPoint2) {
      var x2 = (endPoint2.x - startPoint2.x) * (endPoint2.x - startPoint2.x);
      var y2 = (endPoint2.y - startPoint2.y) * (endPoint2.y - startPoint2.y);
      var dis = Math.sqrt(x2 + y2) / 1e3;
      return dis.toFixed(2);
    }
    function sum(arr) {
      var s = 0;
      for (var i2 = arr.length - 1; i2 >= 0; i2--) {
        s += Number(arr[i2]);
      }
      return s;
    }
    _this.measureEnities = _this.measureEnities || [];
    _this.AllEnities = [];
    var isDraw = false;
    var polyline = new Cesium.Entity();
    _this.polylinePath = [];
    var disNums = [];
    var temLine = null;
    _this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    _this.handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    _this.handler.setInputAction(function(movement) {
      var position1;
      var cartographic;
      var ray = _this.viewer.scene.camera.getPickRay(movement.endPosition);
      if (ray)
        position1 = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
      if (position1)
        cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
      if (cartographic) {
        var height = _this.viewer.scene.globe.getHeight(cartographic);
        var point = Cesium.Cartesian3.fromDegrees(
          cartographic.longitude / Math.PI * 180,
          cartographic.latitude / Math.PI * 180,
          height
        );
        if (isDraw) {
          if (_this.polylinePath.length < 1) {
            return;
          }
          if (temLine != null) {
            _this.viewer.entities.remove(temLine);
          }
          if (_this.polylinePath.length == 1 && point.x != null) {
            temLine = _this.viewer.entities.add({
              polyline: {
                show: true,
                positions: [_this.polylinePath[0], point],
                material: new Cesium.PolylineOutlineMaterialProperty({
                  color: Cesium.Color.fromCssColorString(
                    paramObj.polylineStyle.color
                  )
                }),
                width: paramObj.polylineStyle.width
              }
            });
            _this.AllEnities.push(temLine);
            _this.measureEnities.push(temLine);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    _this.handler.setInputAction(function(movement) {
      isDraw = true;
      var position1;
      var cartographic;
      var ray = _this.viewer.scene.camera.getPickRay(movement.position);
      if (ray) {
        position1 = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
      }
      if (position1) {
        cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
      }
      if (cartographic) {
        _this.viewer.scene.globe.getHeight(cartographic);
        var point = Cesium.Cartesian3.fromDegrees(
          cartographic.longitude / Math.PI * 180,
          cartographic.latitude / Math.PI * 180,
          0
        );
        _this.polylinePath.push(point);
        if (isDraw && _this.polylinePath.length == 1) {
          StartPoint = point;
          var strartpoint = _this.viewer.entities.add({
            position: point,
            point: {
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              show: true,
              color: Cesium.Color.fromCssColorString(
                paramObj.startPointStyle.color
              ),
              pixelSize: paramObj.startPointStyle.pixelSize,
              outlineColor: Cesium.Color.fromCssColorString(
                paramObj.startPointStyle.outlineColor
              ),
              outlineWidth: paramObj.startPointStyle.outlineWidth
            },
            label: {
              text: paramObj.startLabeltStyle.text,
              font: paramObj.startLabeltStyle.fontSize + "pt " + paramObj.startLabeltStyle.fontStyle,
              color: Cesium.Color.fromCssColorString(
                paramObj.startLabeltStyle.color
              ),
              backgroundColor: Cesium.Color.fromCssColorString(
                paramObj.startLabeltStyle.backgroundColor
              ),
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: paramObj.startLabeltStyle.outlineWidth,
              heightReference: Cesium.HeightReference.NONE,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: new Cesium.Cartesian2(
                paramObj.startLabeltStyle.pixelOffset[0],
                paramObj.startLabeltStyle.pixelOffset[1]
              )
            }
          });
          _this.AllEnities.push(strartpoint);
          _this.measureEnities.push(strartpoint);
        }
        if (isDraw && _this.polylinePath.length > 1) {
          var text = 0;
          text = sum(disNums) + Number(getLineDis(_this.polylinePath[0], _this.polylinePath[1]));
          disNums.push(getLineDis(_this.polylinePath[0], _this.polylinePath[1]));
          var temppoint = _this.viewer.entities.add({
            position: point,
            point: {
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              show: true,
              color: Cesium.Color.fromCssColorString(
                paramObj.endPointStyle.color
              ),
              pixelSize: paramObj.endPointStyle.pixelSize,
              outlineColor: Cesium.Color.fromCssColorString(
                paramObj.endPointStyle.outlineColor
              ),
              outlineWidth: paramObj.endPointStyle.outlineWidth,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
              text: text.toFixed(2).toString() + "\u516C\u91CC",
              font: paramObj.endLabeltStyle.fontSize + "pt " + paramObj.endLabeltStyle.fontStyle,
              color: Cesium.Color.fromCssColorString(
                paramObj.endLabeltStyle.color
              ),
              backgroundColor: Cesium.Color.fromCssColorString(
                paramObj.endLabeltStyle.backgroundColor
              ),
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: paramObj.endLabeltStyle.outlineWidth,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              heightReference: Cesium.HeightReference.NONE,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(
                paramObj.endLabeltStyle.pixelOffset[0],
                paramObj.endLabeltStyle.pixelOffset[1]
              )
            }
          });
          _this.AllEnities.push(temppoint);
          _this.measureEnities.push(temppoint);
          polyline = _this.viewer.entities.add({
            polyline: {
              clampToGround: true,
              show: true,
              positions: _this.polylinePath,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.fromCssColorString(
                  paramObj.polylineStyle.color
                )
              }),
              width: paramObj.polylineStyle.width
            }
          });
          _this.AllEnities.push(polyline);
          _this.measureEnities.push(polyline);
          var lastpoint = _this.polylinePath[_this.polylinePath.length - 1];
          _this.polylinePath = [lastpoint];
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    _this.handler.setInputAction(function() {
      _this.AllEnities.push(polyline);
      _this.measureEnities.push(polyline);
      _this.viewer.trackedEntity = void 0;
      isDraw = false;
      _this.polylinePath = [];
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  };
  Map3D.prototype.measurearea = function(paramObj) {
    var _this = this;
    _this.destroymeasure();
    _this.measureEnities = _this.measureEnities || [];
    _this.measureareaEnities = _this.measureareaEnities || [];
    _this.positions = [];
    _this.tempPoints = [];
    var polygon = null;
    var cartesian = null;
    _this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    _this.handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    _this.handler.setInputAction(function(movement) {
      let ray = _this.viewer.camera.getPickRay(movement.endPosition);
      cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
      if (cartesian != void 0) {
        if (_this.positions.length >= 2) {
          if (!Cesium.defined(polygon)) {
            polygon = new PolygonPrimitive(_this.positions);
          } else {
            _this.positions.pop();
            _this.positions.push(cartesian);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    _this.handler.setInputAction(function(movement) {
      let ray = _this.viewer.camera.getPickRay(movement.position);
      cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
      if (cartesian) {
        if (_this.positions.length == 0) {
          _this.positions.push(cartesian.clone());
        }
        _this.positions.push(cartesian);
        var cartographic = Cesium.Cartographic.fromCartesian(
          _this.positions[_this.positions.length - 1]
        );
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        var heightString = cartographic.height;
        _this.tempPoints.push({
          lon: longitudeString,
          lat: latitudeString,
          hei: heightString
        });
        var floatingPoint = _this.viewer.entities.add({
          name: "\u591A\u8FB9\u5F62\u9762\u79EF",
          position: _this.positions[_this.positions.length - 1],
          point: {
            pixelSize: paramObj.pointStyle.pixelSize,
            color: Cesium.Color.fromCssColorString(paramObj.pointStyle.color),
            outlineColor: Cesium.Color.fromCssColorString(
              paramObj.pointStyle.outlineColor
            ),
            outlineWidth: paramObj.pointStyle.outlineWidth,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
        _this.measureareaEnities.push(floatingPoint);
        _this.measureEnities.push(floatingPoint);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    _this.handler.setInputAction(function() {
      _this.handler.destroy();
      _this.positions.pop();
      var textArea = getArea(_this.tempPoints) + "\u5E73\u65B9\u516C\u91CC";
      var areaEntity = _this.viewer.entities.add({
        name: "\u591A\u8FB9\u5F62\u9762\u79EF",
        position: _this.positions[_this.positions.length - 1],
        label: {
          text: textArea,
          font: paramObj.labelStyle.fontSize + "pt " + paramObj.labelStyle.fontStyle,
          color: Cesium.Color.fromCssColorString(paramObj.labelStyle.color),
          backgroundColor: Cesium.Color.fromCssColorString(
            paramObj.labelStyle.backgroundColor
          ),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: paramObj.labelStyle.outlineWidth,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new Cesium.Cartesian2(
            paramObj.labelStyle.pixelOffset[0],
            paramObj.labelStyle.pixelOffset[1]
          )
        }
      });
      _this.measureEnities.push(areaEntity);
      _this.measureareaEnities = [];
      _this.measurearea();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    var radiansPerDegree = Math.PI / 180;
    var degreesPerRadian = 180 / Math.PI;
    function getArea(points) {
      var res = 0;
      for (var i2 = 0; i2 < points.length - 2; i2++) {
        var j = (i2 + 1) % points.length;
        var k = (i2 + 2) % points.length;
        var totalAngle = Angle(points[i2], points[j], points[k]);
        var dis_temp1 = distance(_this.positions[i2], _this.positions[j]);
        var dis_temp2 = distance(_this.positions[j], _this.positions[k]);
        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
      }
      return (res / 1e6).toFixed(4);
    }
    function Angle(p1, p2, p3) {
      var bearing21 = Bearing(p2, p1);
      var bearing23 = Bearing(p2, p3);
      var angle = bearing21 - bearing23;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    }
    function Bearing(from, to) {
      var lat1 = from.lat * radiansPerDegree;
      var lon1 = from.lon * radiansPerDegree;
      var lat2 = to.lat * radiansPerDegree;
      var lon2 = to.lon * radiansPerDegree;
      var angle = -Math.atan2(
        Math.sin(lon1 - lon2) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
      if (angle < 0) {
        angle += Math.PI * 2;
      }
      angle = angle * degreesPerRadian;
      return angle;
    }
    var PolygonPrimitive = function() {
      function _(positions) {
        this.options = {
          name: "\u591A\u8FB9\u5F62",
          polygon: {
            hierarchy: [],
            material: Cesium.Color.fromCssColorString(
              paramObj.polygonStyle.color
            ).withAlpha(0.5)
          }
        };
        this.hierarchy = {
          positions
        };
        this._init();
      }
      _.prototype._init = function() {
        var _self = this;
        var _update = function() {
          return _self.hierarchy;
        };
        this.options.polygon.hierarchy = new Cesium.CallbackProperty(
          _update,
          false
        );
        var newPolygonPrimitive = _this.viewer.entities.add(this.options);
        _this.measureareaEnities.push(newPolygonPrimitive);
        _this.measureEnities.push(newPolygonPrimitive);
      };
      return _;
    }();
    function distance(point1, point2) {
      var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
      var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
      var geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      var s = geodesic.surfaceDistance;
      s = Math.sqrt(
        Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2)
      );
      return s;
    }
  };
  Map3D.prototype.destroymeasure = function() {
    if (this.polylinePath && this.polylinePath.length > 0) {
      this.AllEnities.forEach((element) => {
        this.viewer.entities.remove(element);
      });
      delete this.AllEnities;
      delete this.polylinePath;
    }
    if (this.positions && this.tempPoints) {
      if (this.positions.length != this.tempPoints.length) {
        this.measureareaEnities.forEach((element) => {
          this.viewer.entities.remove(element);
        });
        delete this.positions;
        delete this.tempPoints;
      }
    }
    if (this.handler) {
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.handler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      delete this.handler;
    }
  };
  Map3D.prototype.removeentity = function() {
    if (this.measureEnities && this.measureEnities.length > 0) {
      this.measureEnities.forEach((element) => {
        this.viewer.entities.remove(element);
      });
      this.measureEnities = [];
    }
  };
  let flags = null;
  function keyDown(event) {
    let flagName = getFlagFromKeyCode(event.keyCode);
    if (typeof flagName !== "undefined") {
      flags[flagName] = true;
      event.preventDefault();
    }
  }
  function keyUp(event) {
    let flagName = getFlagFromKeyCode(event.keyCode);
    if (typeof flagName !== "undefined") {
      flags[flagName] = false;
      event.preventDefault();
    }
  }
  function getFlagFromKeyCode(keyCode) {
    switch (keyCode) {
      case 87:
        return "moveForward";
      case 83:
        return "moveBackward";
      case 81:
        return "moveUp";
      case 69:
        return "moveDown";
      case 68:
        return "moveRight";
      case 65:
        return "moveLeft";
      case 38:
        return "lookUp";
      case 40:
        return "lookDown";
      case 37:
        return "lookLeft";
      case 39:
        return "lookRight";
      default:
        return void 0;
    }
  }
  Map3D.prototype.keyboardfly = function(obj) {
    var _this = this;
    var scene = _this.viewer.scene;
    var canvas = _this.viewer.canvas;
    _this.viewer.camera;
    canvas.setAttribute("tabindex", "0");
    canvas.onclick = function() {
      canvas.focus();
    };
    var ellipsoid = scene.globe.ellipsoid;
    scene.screenSpaceCameraController.enableRotate = false;
    scene.screenSpaceCameraController.enableTranslate = false;
    scene.screenSpaceCameraController.enableZoom = false;
    scene.screenSpaceCameraController.enableTilt = false;
    scene.screenSpaceCameraController.enableLook = false;
    flags = {
      moveForward: false,
      moveBackward: false,
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
      startPosition: null,
      endPosition: null,
      lookUp: false,
      lookDown: false,
      lookLeft: false,
      lookRight: false
    };
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", keyUp, false);
    _this.viewer.clock.onTick.addEventListener(function() {
      var camera = _this.viewer.camera;
      var lookFactor = obj.lookFactor;
      var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
      var moveRate = cameraHeight / 100;
      if (flags.moveForward) {
        camera.moveForward(moveRate);
      }
      if (flags.moveBackward) {
        camera.moveBackward(moveRate);
      }
      if (flags.moveUp) {
        camera.moveUp(moveRate);
      }
      if (flags.moveDown) {
        camera.moveDown(moveRate);
      }
      if (flags.moveLeft) {
        camera.moveLeft(moveRate);
      }
      if (flags.moveRight) {
        camera.moveRight(moveRate);
      }
      if (flags.lookUp) {
        camera.lookUp(0.01 * lookFactor);
      }
      if (flags.lookDown) {
        camera.lookDown(0.01 * lookFactor);
      }
      if (flags.lookLeft) {
        camera.lookLeft(0.01 * lookFactor);
      }
      if (flags.lookRight) {
        camera.lookRight(0.01 * lookFactor);
      }
    });
  };
  Map3D.prototype.deletekeyboardfly = function() {
    console.log("\u53D6\u6D88\u952E\u76D8\u9A71\u52A8\u6F2B\u6E38");
    var scene = this.viewer.scene;
    document.removeEventListener("keydown", keyDown, false);
    document.removeEventListener("keyup", keyUp, false);
    scene.screenSpaceCameraController.enableRotate = true;
    scene.screenSpaceCameraController.enableTranslate = true;
    scene.screenSpaceCameraController.enableZoom = true;
    scene.screenSpaceCameraController.enableTilt = true;
    scene.screenSpaceCameraController.enableLook = true;
  };
  Map3D.prototype.search3D = function(obj) {
    var objList = [];
    var entityvals = this.viewer.entities.values;
    for (var e = 0; e < entityvals.length; ++e) {
      var entity = entityvals[e];
      if (entity.option) {
        var bol = false;
        for (let key in obj) {
          if (entity.option[key].includes(obj[key])) {
            bol = true;
          }
        }
        if (bol) {
          objList.push(entity.option);
        }
      }
    }
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    for (var i2 = 0; i2 < length; ++i2) {
      var p = primitives.get(i2);
      if (p.asset) {
        var bol = false;
        for (let key in obj) {
          if (p.asset[key].includes(obj[key])) {
            bol = true;
          }
        }
        if (bol) {
          objList.push(p.asset);
        }
      }
    }
    return objList;
  };
  var newvideo = void 0;
  var v_model;
  Map3D.prototype.addVideo3D = function(obj) {
    var viewer2 = this.viewer;
    var primitives = this.viewer.scene.primitives;
    var length = primitives.length;
    console.log(length);
    if (newvideo == void 0) {
      newvideo = obj.id;
      var model_position = Cesium.Cartesian3.fromDegrees(
        obj.model_position[0],
        obj.model_position[1],
        obj.model_position[2]
      );
      var heading = Cesium.Math.toRadians(obj.heading);
      var pitch = Cesium.Math.toRadians(obj.pitch);
      var roll = Cesium.Math.toRadians(obj.roll);
      var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var converter = Cesium.Transforms.eastNorthUpToFixedFrame;
      var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        model_position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      );
      v_model = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: obj.model_url
        })
      );
      v_model.readyPromise.then(function() {
        v_model._root.transform = modelMatrix;
        var videoElement = document.getElementById("trailer");
        new Cesium.VideoSynchronizer({
          clock: viewer2.clock,
          element: videoElement
        });
        viewer2.clock.shouldAnimate = true;
        var position = Cesium.Cartesian3.fromDegrees(
          obj.position[0],
          obj.position[1],
          obj.position[2]
        );
        viewer2.entities.add({
          id: obj.id,
          position,
          plane: {
            plane: new Cesium.Plane(
              new Cesium.Cartesian3(
                obj.planes[0],
                obj.planes[1],
                obj.planes[2]
              ),
              obj.planes[3]
            ),
            dimensions: new Cesium.Cartesian2(
              obj.dimensions[0],
              obj.dimensions[1]
            ),
            material: videoElement
          }
        });
      }).otherwise(function(error) {
        throw error;
      });
      return v_model;
    }
  };
  Map3D.prototype.deleteVideo3D = function(obj) {
    if (newvideo) {
      newvideo = void 0;
      var videoElement = document.getElementById("trailer");
      new Cesium.VideoSynchronizer({
        shouldAnimate: this.viewer.clock.shouldAnimate = false,
        element: videoElement
      });
      this.viewer.entities.removeById(obj.id);
    }
  };
  var newsightline = void 0;
  var tsdyt_model;
  Map3D.prototype.addsightline = function(obj) {
    var viewer2 = this.viewer;
    var positions = [];
    var markers = [];
    if (newsightline == void 0) {
      newsightline = obj.id;
      var modelposition = Cesium.Cartesian3.fromDegrees(
        obj.position[0],
        obj.position[1],
        obj.position[2]
      );
      var heading = Cesium.Math.toRadians(obj.heading);
      var pitch = Cesium.Math.toRadians(obj.pitch);
      var roll = Cesium.Math.toRadians(obj.roll);
      var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var converter = Cesium.Transforms.eastNorthUpToFixedFrame;
      var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        modelposition,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      );
      tsdyt_model = viewer2.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: obj.model_url,
          asset: {
            id: obj.id
          }
        })
      );
      tsdyt_model.readyPromise.then(function(tsdyt_model2) {
        tsdyt_model2._root.transform = modelMatrix;
        tsdyt_model2.asset.id = obj.id;
        Object.assign(tsdyt_model2.asset);
      }).otherwise(function(error) {
        throw error;
      });
      viewer2.zoomTo(tsdyt_model);
    }
    var CesiumEventHandler = new Cesium.ScreenSpaceEventHandler(
      viewer2.scene.canvas
    );
    CesiumEventHandler.setInputAction(function(movement) {
      var cartesian = viewer2.scene.pickPosition(movement.position);
      if (cartesian) {
        positions.push(cartesian);
        if (markers.length == 0) {
          var startpoint = viewer2.entities.add({
            position: cartesian,
            billboard: {
              image: obj.startpointStyle.image,
              heightReference: Cesium.HeightReference.NONE
            },
            label: {
              text: obj.startpointStyle.text,
              fillColor: Cesium.Color.YELLOW,
              pixelOffset: {
                x: obj.startpointStyle.pixelOffsetX,
                y: obj.startpointStyle.pixelOffsetY
              },
              scale: obj.startpointStyle.scale
            }
          });
          markers.push(startpoint);
        } else if (markers.length == 1) {
          var endpoint = viewer2.entities.add({
            position: cartesian,
            billboard: {
              image: obj.endpointStyle.image,
              heightReference: Cesium.HeightReference.NONE
            },
            label: {
              text: obj.endpointStyle.text,
              fillColor: Cesium.Color.YELLOW,
              pixelOffset: {
                x: obj.endpointStyle.pixelOffsetX,
                y: obj.endpointStyle.pixelOffsetY
              },
              scale: obj.endpointStyle.scale
            }
          });
          markers.push(endpoint);
          CesiumEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
          analysisVisible(positions);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    function analysisVisible(positions2) {
      let direction = Cesium.Cartesian3.normalize(
        Cesium.Cartesian3.subtract(
          positions2[1],
          positions2[0],
          new Cesium.Cartesian3()
        ),
        new Cesium.Cartesian3()
      );
      let ray = new Cesium.Ray(positions2[0], direction);
      let result = viewer2.scene.pickFromRay(ray);
      if (Cesium.defined(result) && Cesium.defined(result.object)) {
        drawLine(result.position, positions2[0], Cesium.Color.GREEN);
        drawLine(result.position, positions2[1], Cesium.Color.RED);
      } else {
        drawLine(positions2[0], positions2[1], Cesium.Color.GREEN);
        console.log("\u4E0D\u5728\u6A21\u578B\u4E0A");
      }
    }
    function drawLine(leftPoint, secPoint, color) {
      viewer2.entities.add({
        polyline: {
          positions: [leftPoint, secPoint],
          width: 2,
          material: color,
          depthFailMaterial: color
        }
      });
    }
  };
  Map3D.prototype.deletesightline = function(obj) {
    if (newsightline) {
      newsightline = void 0;
      this.viewer.entities.removeAll();
    }
  };
  var newAddSkyline = void 0;
  var tjx_model;
  Map3D.prototype.addSkyline = function(paramObj) {
    var viewer2 = this.viewer;
    if (newAddSkyline == void 0) {
      var position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2]
      );
      var heading = Cesium.Math.toRadians(paramObj.heading);
      var pitch = Cesium.Math.toRadians(paramObj.pitch);
      var roll = Cesium.Math.toRadians(paramObj.roll);
      var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var converter = Cesium.Transforms.eastNorthUpToFixedFrame;
      var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      );
      tjx_model = viewer2.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: paramObj.url
        })
      );
      tjx_model.readyPromise.then(function() {
        tjx_model._root.transform = modelMatrix;
      });
      viewer2.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          paramObj.destination[0],
          paramObj.destination[1],
          paramObj.destination[2]
        ),
        orientation: {
          heading: Cesium.Math.toRadians(paramObj.orientation.heading),
          pitch: Cesium.Math.toRadians(paramObj.orientation.pitch),
          roll: paramObj.orientation.roll
        }
      });
      newAddSkyline = paramObj.id;
      var collection = viewer2.scene.postProcessStages;
      var edgeDetection = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      var postProccessStage = new Cesium.PostProcessStage({
        name: paramObj.name,
        fragmentShader: paramObj.fragmentShader
      });
      var postProccessStage1 = new Cesium.PostProcessStage({
        name: "czm_skylinetemp1",
        fragmentShader: "uniform sampler2D colorTexture;uniform sampler2D redTexture;uniform sampler2D silhouetteTexture;varying vec2 v_textureCoordinates;void main(void){vec4 redcolor=texture2D(redTexture, v_textureCoordinates);vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);vec4 color = texture2D(colorTexture, v_textureCoordinates);if(redcolor.r == 1.0){gl_FragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);}else{gl_FragColor = color;}}",
        uniforms: {
          redTexture: postProccessStage.name,
          silhouetteTexture: edgeDetection.name
        }
      });
      var postProccessStage = new Cesium.PostProcessStageComposite({
        stages: [edgeDetection, postProccessStage, postProccessStage1],
        inputPreviousStageTexture: false,
        uniforms: edgeDetection.uniforms
      });
      collection.add(postProccessStage);
    }
  };
  Map3D.prototype.deleteSkyline = function(paramObj) {
    if (newAddSkyline) {
      var viewer2 = this.viewer;
      var collection = viewer2.scene.postProcessStages;
      var edgeDetection = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      var postProccessStage = new Cesium.PostProcessStage({
        name: paramObj.name,
        fragmentShader: "uniform sampler2D colorTexture;uniform sampler2D depthTexture;varying vec2 v_textureCoordinates;void main(void){float depth = czm_readDepth(depthTexture, v_textureCoordinates);vec4 color = texture2D(colorTexture, v_textureCoordinates);if(depth<1.0 - 0.000001){gl_FragColor = color;}else{gl_FragColor = vec4(1.0,0.0,0.0,1.0);}}"
      });
      var postProccessStage1 = new Cesium.PostProcessStage({
        name: "czm_skylinetemp1",
        fragmentShader: "uniform sampler2D colorTexture;uniform sampler2D redTexture;uniform sampler2D silhouetteTexture;varying vec2 v_textureCoordinates;void main(void){vec4 redcolor=texture2D(redTexture, v_textureCoordinates);vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);vec4 color = texture2D(colorTexture, v_textureCoordinates);if(redcolor.r == 1.0){gl_FragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);}else{gl_FragColor = color;}}",
        uniforms: {
          redTexture: postProccessStage.name,
          silhouetteTexture: edgeDetection.name
        }
      });
      var postProccessStage = new Cesium.PostProcessStageComposite({
        stages: [edgeDetection, postProccessStage, postProccessStage1],
        inputPreviousStageTexture: false,
        uniforms: edgeDetection.uniforms
      });
      collection.removeAll(postProccessStage);
      newAddSkyline = void 0;
    }
  };
  var newAddShadow = void 0;
  var yy_model;
  Map3D.prototype.addShadow = function(paramObj) {
    if (newAddShadow == void 0) {
      let stratPlay = function() {
        if (viewer2.clock.shouldAnimate = true, stopTime)
          viewer2.clock.currentTime = stopTime;
        else {
          var e = paramObj.e, t = new Date(e), i2 = paramObj.i, a = paramObj.a, r = new Date(new Date(t).setHours(Number(i2))), o = new Date(new Date(t).setHours(Number(a)));
          viewer2.scene.globe.enableLighting = true, viewer2.shadows = true, viewer2.clock.startTime = Cesium.JulianDate.fromDate(r), viewer2.clock.stopTime = Cesium.JulianDate.fromDate(o), viewer2.clock.currentTime = Cesium.JulianDate.fromDate(r), viewer2.clock.clockRange = Cesium.ClockRange.LOOP_STOP, viewer2.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER, viewer2.clock.multiplier = paramObj.multiplier;
        }
      };
      var viewer2 = this.viewer;
      newAddShadow = paramObj.id;
      yy_model = viewer2.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: paramObj.url
        })
      );
      viewer2.zoomTo(yy_model);
      var stopTime = null;
      stratPlay();
    }
  };
  Map3D.prototype.deleteShadow = function(paramObj) {
    var viewer2 = this.viewer;
    if (newAddShadow) {
      console.log("\u53D6\u6D88\u9634\u5F71");
      viewer2.scene.globe.enableLighting = paramObj.enableLighting;
      viewer2.shadows = paramObj.shadows;
      newAddShadow = void 0;
    }
  };
  var arrViewField = [];
  var newAddViewField = void 0;
  var ksy_model;
  Map3D.prototype.addViewField = function(paramObj) {
    if (newAddViewField == void 0) {
      newAddViewField = paramObj.id;
      var viewer2 = null;
      var viewer2 = this.viewer;
      var viewModel = {
        verticalAngle: 90,
        horizontalAngle: 120,
        distance: 10
      };
      var e = new Cesium.ViewShed3D(viewer2, {
        horizontalAngle: Number(viewModel.horizontalAngle),
        verticalAngle: Number(viewModel.verticalAngle),
        distance: Number(viewModel.distance),
        calback: function() {
          viewModel.distance = e.distance;
        }
      });
      arrViewField.push(e);
      var position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2]
      );
      var heading = Cesium.Math.toRadians(paramObj.heading);
      var pitch = Cesium.Math.toRadians(paramObj.pitch);
      var roll = Cesium.Math.toRadians(paramObj.roll);
      var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var converter = Cesium.Transforms.eastNorthUpToFixedFrame;
      var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      );
      ksy_model = viewer2.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: paramObj.url
        })
      );
      ksy_model.readyPromise.then(function() {
        ksy_model._root.transform = modelMatrix;
      });
      viewer2.zoomTo(ksy_model);
    }
  };
  Map3D.prototype.deleteViewField = function(paramObj) {
    var viewer2 = this.viewer;
    if (newAddViewField) {
      for (var e = 0, i2 = arrViewField.length; e < i2; e++) {
        arrViewField[e].destroy();
      }
      arrViewField = [], newAddViewField = void 0;
      viewer2.scene.primitives.remove(ksy_model);
    }
  };
  var newProfile = void 0;
  var pmxdytmodel;
  Map3D.prototype.addProfile = function(paramObj) {
    if (newProfile == void 0) {
      let profileAnalyse = function(start2, end2) {
        var startPoint2 = Cesium.Cartographic.fromCartesian(start2);
        var endPoint2 = Cesium.Cartographic.fromCartesian(end2);
        profile.arrLX.push(0);
        profile.ponits.push(startPoint2);
        profile.arrPoint.push(getDegrees(startPoint2));
        profile.arrHB.push(startPoint2.height);
        var count = 100;
        for (var i2 = 1; i2 < count; i2++) {
          var cart = Cesium.Cartesian3.lerp(
            start2,
            end2,
            i2 / count,
            new Cesium.Cartesian3()
          );
          var cartographicCart = Cesium.Cartographic.fromCartesian(cart);
          var disc = distance(profile.ponits[i2 - 1], cartographicCart);
          profile.distance = profile.distance + disc;
          profile.ponits.push(cartographicCart);
          profile.arrLX.push(profile.arrLX[i2 - 1] + disc);
          profile.arrPoint.push(getDegrees(cart));
          profile.arrHB.push(cartographicCart.height);
        }
        profile.ponits.push(endPoint2);
        profile.arrLX.push(
          profile.arrLX[profile.arrLX.length - 1] + distance(profile.ponits[profile.ponits.length - 1], endPoint2)
        );
        profile.arrPoint.push(getDegrees(endPoint2));
        profile.arrHB.push(endPoint2.height);
        return profile;
      }, distance = function(point1, point2) {
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1, point2);
        var s = geodesic.surfaceDistance;
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));
        return s;
      }, getDegrees = function(cart) {
        var cartographic = ellipsoid.cartesianToCartographic(cart);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        return {
          x: lng,
          y: lat,
          z: alt
        };
      }, strFormat = function(str) {
        var strString = str.toString();
        var strs = strString.slice(0, strString.indexOf(".") + 3);
        return strs;
      }, setEchartsData = function(e) {
        console.log(e);
        if (null != e && null != e.arrPoint && void 0 != newProfile) {
          $("#sectionChars").show(), null == myChart && (myChart = echarts.init(
            document.getElementById("echartsView1"),
            "dark"
          ));
          var t = e.arrPoint, chartData = {
            grid: {
              left: 10,
              right: 10,
              bottom: 10,
              containLabel: true
            },
            dataZoom: [{
              type: "inside",
              throttle: 50
            }],
            tooltip: {
              trigger: "axis",
              formatter: function(e2) {
                var a = "";
                if (0 == e2.length)
                  return a;
                e2[0].value;
                console.log(e2);
                var r = t[e2[0].dataIndex];
                console.log(r);
                return a += "\u6240\u5728\u4F4D\u7F6E&nbsp;" + strFormat(r.x) + "," + strFormat(r.y) + "<br />\u8DDD\u8D77\u70B9&nbsp;<label>" + haoutil.str.formatLength(e2[0].axisValue) + "</label><br />" + e2[0].seriesName + "&nbsp;<label style='color:" + e2[0].color + ";'>" + haoutil.str.formatLength(e2[0].value) + "</label><br />";
              }
            },
            xAxis: [{
              name: "\u884C\u7A0B",
              type: "category",
              boundaryGap: false,
              axisLine: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: e.arrLX
            }],
            yAxis: [{
              type: "value",
              axisLabel: {
                rotate: 60,
                formatter: "{value} \u7C73"
              }
            }],
            series: [{
              name: "\u9AD8\u7A0B\u503C",
              type: "line",
              smooth: true,
              symbol: "none",
              sampling: "average",
              itemStyle: {
                normal: {
                  color: "rgb(255, 70, 131)"
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgb(255, 158, 68)"
                    },
                    {
                      offset: 1,
                      color: "rgb(255, 70, 131)"
                    }
                  ])
                }
              },
              data: e.arrHB
            }]
          };
          myChart.setOption(chartData);
        }
      };
      var _this = this;
      newProfile = paramObj.id;
      console.log("\u5256\u9762\u7EBF\u5206\u6790");
      var position = Cesium.Cartesian3.fromDegrees(
        paramObj.position[0],
        paramObj.position[1],
        paramObj.position[2]
      );
      var heading = Cesium.Math.toRadians(paramObj.heading);
      var pitch = Cesium.Math.toRadians(paramObj.pitch);
      var roll = Cesium.Math.toRadians(paramObj.roll);
      var hpRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var converter = Cesium.Transforms.eastNorthUpToFixedFrame;
      var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpRoll,
        Cesium.Ellipsoid.WGS84,
        converter
      );
      pmxdytmodel = _this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: paramObj.url
        })
      );
      pmxdytmodel.readyPromise.then(function() {
        pmxdytmodel._root.transform = modelMatrix;
      });
      _this.viewer.zoomTo(pmxdytmodel);
      _this.viewer.scene.globe.depthTestAgainstTerrain = true;
      var ellipsoid = _this.viewer.scene.globe.ellipsoid;
      var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
      var start, end;
      var profile = {
        arrHB: [],
        arrPoint: [],
        arrLX: [],
        ponits: [],
        distance: 0
      };
      var myChart;
      var draw = function(drawingMode) {
        _this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );
        function createPoint(worldPosition) {
          var point = _this.viewer.entities.add({
            position: worldPosition,
            point: {
              pixelSize: 10,
              color: Cesium.Color.YELLOW,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
          });
          return point;
        }
        var drawingMode = drawingMode;
        function drawShape(positionData) {
          var shape;
          if (drawingMode === "line" && void 0 != newProfile) {
            shape = _this.viewer.entities.add({
              polyline: {
                positions: positionData,
                clampToGround: true,
                arcType: Cesium.ArcType.RHUMB,
                material: Cesium.Color.GREEN,
                width: 5
              }
            });
          } else if (drawingMode === "polygon") {
            shape = _this.viewer.entities.add({
              polygon: {
                hierarchy: positionData,
                material: new Cesium.ColorMaterialProperty(
                  Cesium.Color.LIGHTSKYBLUE.withAlpha(0.7)
                )
              }
            });
          }
          return shape;
        }
        var activeShapePoints = [];
        var activeShape;
        var floatingPoint;
        handler.setInputAction(function(event) {
          if (!Cesium.Entity.supportsPolylinesOnTerrain(_this.viewer.scene)) {
            console.log("This browser does not support polylines on terrain.");
            return;
          }
          var earthPosition = _this.viewer.scene.pickPosition(event.position);
          if (Cesium.defined(earthPosition)) {
            if (activeShapePoints.length === 0) {
              start = earthPosition;
              floatingPoint = createPoint(earthPosition);
              activeShapePoints.push(earthPosition);
              var dynamicPositions = new Cesium.CallbackProperty(function() {
                return activeShapePoints;
              }, false);
              activeShape = drawShape(dynamicPositions);
            }
            profile.distance = profile.distance + distance(
              activeShapePoints[activeShapePoints.length - 1],
              earthPosition
            );
            activeShapePoints.push(earthPosition);
            createPoint(earthPosition);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(function(event) {
          if (Cesium.defined(floatingPoint)) {
            var newPosition = _this.viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
              floatingPoint.position.setValue(newPosition);
              activeShapePoints.pop();
              activeShapePoints.push(newPosition);
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        function terminateShape() {
          activeShapePoints.pop();
          drawShape(activeShapePoints);
          _this.viewer.entities.remove(floatingPoint);
          _this.viewer.entities.remove(activeShape);
          floatingPoint = void 0;
          activeShape = void 0;
          activeShapePoints = [];
        }
        handler.setInputAction(function(event) {
          var length = activeShapePoints.length - 1;
          end = activeShapePoints[length];
          var data = profileAnalyse(start, end);
          console.log(data);
          setEchartsData(data);
          terminateShape();
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
          handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      };
      draw("line");
    }
  };
  Map3D.prototype.deleteProfile = function(paramObj) {
    var viewer2 = this.viewer;
    if (newProfile) {
      console.log("\u53D6\u6D88\u5256\u9762\u7EBF");
      $("#sectionChars").hide();
      newProfile = void 0;
      viewer2.entities.removeAll();
    }
  };
  var newclipping = void 0;
  var pq_model;
  var planeEntities = [];
  Map3D.prototype.addclipping = function(paramObj) {
    var viewer2 = this.viewer;
    var targetY = 50;
    var viewModel = {
      debugBoundingVolumesEnabled: false,
      edgeStylingEnabled: true
    };
    var clippingPlanes = new Cesium.ClippingPlaneCollection({
      planes: [
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0, 0, -1), 0)
      ],
      edgeWidth: 2
    });
    if (newclipping == void 0) {
      let createPlaneUpdateFunction = function(plane) {
        return function() {
          plane.distance = targetY;
          return plane;
        };
      };
      newclipping = paramObj.id;
      pq_model = viewer2.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: paramObj.url,
          clippingPlanes
        })
      );
      pq_model.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
      pq_model.readyPromise.then(function() {
        var boundingSphere = pq_model.boundingSphere;
        var radius = boundingSphere.radius;
        viewer2.zoomTo(
          pq_model,
          new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4)
        );
        if (!Cesium.Matrix4.equals(pq_model.root.transform, Cesium.Matrix4.IDENTITY)) {
          var transformCenter = Cesium.Matrix4.getTranslation(
            pq_model.root.transform,
            new Cesium.Cartesian3()
          );
          Cesium.Cartesian3.distance(
            transformCenter,
            pq_model.boundingSphere.center
          );
          clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
            new Cesium.Cartesian3(0, 0, 0)
          );
        }
        for (var i2 = 0; i2 < clippingPlanes.length; ++i2) {
          var plane = clippingPlanes.get(i2);
          var planeEntity = viewer2.entities.add({
            position: boundingSphere.center,
            plane: {
              dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 2.5),
              material: Cesium.Color.WHITE.withAlpha(0.1),
              plane: new Cesium.CallbackProperty(
                createPlaneUpdateFunction(plane),
                false
              ),
              outline: true,
              outlineColor: Cesium.Color.WHITE
            }
          });
          planeEntities.push(planeEntity);
        }
      });
      var selectedPlane;
      var downHandler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);
      downHandler.setInputAction(function(movement) {
        var pickedObject = viewer2.scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
          selectedPlane = pickedObject.id.plane;
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
          selectedPlane.outlineColor = Cesium.Color.WHITE;
          viewer2.scene.screenSpaceCameraController.enableInputs = false;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      var upHandler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);
      upHandler.setInputAction(function() {
        if (Cesium.defined(selectedPlane)) {
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
          selectedPlane.outlineColor = Cesium.Color.WHITE;
          selectedPlane = void 0;
        }
        viewer2.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
      var moveHandler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);
      moveHandler.setInputAction(function(movement) {
        if (Cesium.defined(selectedPlane)) {
          var deltaY = movement.startPosition.y - movement.endPosition.y;
          targetY += deltaY / 10;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  };
  Map3D.prototype.deleteclipping = function(paramObj) {
    if (newclipping) {
      this.viewer.entities.removeAll();
      this.viewer.scene.primitives.remove(pq_model);
      planeEntities = [];
      newclipping = void 0;
    }
  };
  Map3D.prototype.pointMeasure = function(obj) {
    var _this = this;
    function strFormat(str) {
      var strString = str.toString();
      var strs = strString.slice(0, strString.indexOf(".") + 7);
      return strs;
    }
    function strFormath(str) {
      var strString = str.toString();
      var strs = strString.slice(0, strString.indexOf(".") + 3);
      return strs;
    }
    var CesiumEventHandler = new Cesium.ScreenSpaceEventHandler(
      _this.viewer.scene.canvas
    );
    CesiumEventHandler.setInputAction(function(movement) {
      var cartesian = _this.viewer.scene.pickPosition(movement.position);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var lon = strFormat(cartographic.longitude * 180 / Math.PI);
      var lat = strFormat(cartographic.latitude * 180 / Math.PI);
      var height = strFormath(cartographic.height);
      var billboardimg = void 0;
      var pointcolor = void 0;
      if (cartesian) {
        if (obj.billboard) {
          billboardimg = obj.billboard;
        }
        if (obj.point) {
          pointcolor = obj.point;
        }
        if (billboardimg == void 0 && pointcolor != void 0 || billboardimg != void 0 && pointcolor != void 0) {
          _this.viewer.entities.add({
            position: cartesian,
            point: {
              show: obj.point.show,
              pixelSize: obj.point.pixelSize,
              color: Cesium.Color.fromCssColorString(obj.point.color),
              outlineColor: Cesium.Color.fromCssColorString(obj.point.outlineColor),
              outlineWidth: obj.point.outlineWidth
            },
            label: {
              text: "\u7ECF\u5EA6:" + lon + "\xB0\n\u7EAC\u5EA6:" + lat + "\xB0\n\u9AD8\u5EA6:" + height + "\u7C73",
              font: obj.labelStyle.font,
              fillColor: Cesium.Color.fromCssColorString(obj.labelStyle.fillcolor),
              showBackground: obj.labelStyle.showBackground,
              backgroundColor: Cesium.Color.fromCssColorString(obj.labelStyle.backgroundColor),
              pixelOffset: {
                x: obj.labelStyle.pixelOffset[0],
                y: obj.labelStyle.pixelOffset[1]
              },
              scale: obj.labelStyle.scale,
              disableDepthTestDistance: 1e3
            }
          });
        } else if (billboardimg != void 0 && pointcolor == void 0) {
          _this.viewer.entities.add({
            position: cartesian,
            billboard: {
              image: obj.billboard.image,
              pixelOffset: {
                x: obj.billboard.pixelOffset[0],
                y: obj.billboard.pixelOffset[1]
              },
              scale: obj.billboard.scale,
              show: obj.billboard.show
            },
            label: {
              text: "\u7ECF\u5EA6:" + lon + "\xB0\n\u7EAC\u5EA6:" + lat + "\xB0\n\u9AD8\u5EA6:" + height + "\u7C73",
              font: obj.labelStyle.font,
              fillColor: Cesium.Color.fromCssColorString(obj.labelStyle.fillcolor),
              showBackground: obj.labelStyle.showBackground,
              backgroundColor: Cesium.Color.fromCssColorString(obj.labelStyle.backgroundColor),
              pixelOffset: {
                x: obj.labelStyle.pixelOffset[0],
                y: obj.labelStyle.pixelOffset[1]
              },
              scale: obj.labelStyle.scale,
              disableDepthTestDistance: 1e3
            }
          });
        } else if (billboardimg == void 0 && pointcolor == void 0) {
          _this.viewer.entities.add({
            position: cartesian,
            point: {
              show: true,
              pixelSize: 10,
              color: Cesium.Color.fromCssColorString("#bb99ff"),
              outlineColor: Cesium.Color.fromCssColorString("#4B0082"),
              outlineWidth: 2
            },
            label: {
              text: "\u7ECF\u5EA6:" + lon + "\xB0\n\u7EAC\u5EA6:" + lat + "\xB0\n\u9AD8\u5EA6:" + height + "\u7C73",
              font: obj.labelStyle.font,
              fillColor: Cesium.Color.fromCssColorString(obj.labelStyle.fillcolor),
              showBackground: obj.labelStyle.showBackground,
              backgroundColor: Cesium.Color.fromCssColorString(obj.labelStyle.backgroundColor),
              pixelOffset: {
                x: obj.labelStyle.pixelOffset[0],
                y: obj.labelStyle.pixelOffset[1]
              },
              scale: obj.labelStyle.scale,
              disableDepthTestDistance: 1e3
            }
          });
        }
        CesiumEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  Map3D.prototype.angleMeasure = function(obj) {
    var viewer2 = this.viewer;
    var positions = [];
    var markers = [];
    var cartographics = [];
    var CesiumEventHandler = new Cesium.ScreenSpaceEventHandler(
      viewer2.scene.canvas
    );
    CesiumEventHandler.setInputAction(function(movement) {
      var cartesian = viewer2.scene.pickPosition(movement.position);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var billboardimg = void 0;
      var pointcolor = void 0;
      if (cartesian) {
        if (obj.billboard) {
          billboardimg = obj.billboard;
        }
        if (obj.point) {
          pointcolor = obj.point;
        }
        if (markers.length == 0) {
          if (billboardimg == void 0 && pointcolor != void 0 || billboardimg != void 0 && pointcolor != void 0) {
            var startpoint = viewer2.entities.add({
              position: cartesian,
              point: {
                show: obj.point.show,
                pixelSize: obj.point.pixelSize,
                color: Cesium.Color.fromCssColorString(obj.point.color),
                outlineColor: Cesium.Color.fromCssColorString(obj.point.outlineColor),
                outlineWidth: obj.point.outlineWidth
              }
            });
          } else if (billboardimg != void 0 && pointcolor == void 0) {
            var startpoint = viewer2.entities.add({
              position: cartesian,
              billboard: {
                image: obj.billboard.image,
                pixelOffset: {
                  x: obj.billboard.pixelOffset[0],
                  y: obj.billboard.pixelOffset[1]
                },
                scale: obj.billboard.scale,
                show: obj.billboard.show
              }
            });
          } else if (billboardimg == void 0 && pointcolor == void 0) {
            var startpoint = viewer2.entities.add({
              position: cartesian,
              point: {
                show: true,
                pixelSize: 10,
                color: Cesium.Color.fromCssColorString("#bb99ff"),
                outlineColor: Cesium.Color.fromCssColorString("#4B0082"),
                outlineWidth: 2
              }
            });
          }
          positions.push(cartesian);
          cartographics.push(cartographic);
          markers.push(startpoint);
        } else if (markers.length == 1) {
          positions.push(cartesian);
          cartographics.push(cartographic);
          drawLine(positions[0], positions[1], Cesium.Color.GREEN);
          var point1 = turf.point([
            cartographics[0].longitude,
            cartographics[0].latitude
          ]);
          var point2 = turf.point([
            cartographics[1].longitude,
            cartographics[1].latitude
          ]);
          var bearing = strFormat(turf.bearing(point1, point2));
          if (billboardimg == void 0 && pointcolor != void 0 || billboardimg != void 0 && pointcolor != void 0) {
            var endpoint = viewer2.entities.add({
              position: cartesian,
              point: {
                show: obj.point.show,
                pixelSize: obj.point.pixelSize,
                color: Cesium.Color.fromCssColorString(obj.point.color),
                outlineColor: Cesium.Color.fromCssColorString(obj.point.outlineColor),
                outlineWidth: obj.point.outlineWidth
              },
              label: {
                text: "\u89D2\u5EA6\uFF1A" + bearing + "\xB0",
                font: obj.labelStyle.font,
                fillColor: Cesium.Color.fromCssColorString(obj.labelStyle.fillcolor),
                showBackground: obj.labelStyle.showBackground,
                backgroundColor: Cesium.Color.fromCssColorString(obj.labelStyle.backgroundColor),
                pixelOffset: {
                  x: obj.labelStyle.pixelOffset[0],
                  y: obj.labelStyle.pixelOffset[1]
                },
                scale: obj.labelStyle.scale,
                disableDepthTestDistance: 1e3
              }
            });
          } else if (billboardimg != void 0 && pointcolor == void 0) {
            var endpoint = viewer2.entities.add({
              position: cartesian,
              billboard: {
                image: obj.billboard.image,
                pixelOffset: {
                  x: obj.billboard.pixelOffset[0],
                  y: obj.billboard.pixelOffset[1]
                },
                scale: obj.billboard.scale,
                show: obj.billboard.show
              },
              label: {
                text: "\u89D2\u5EA6\uFF1A" + bearing + "\xB0",
                font: obj.labelStyle.font,
                fillColor: Cesium.Color.fromCssColorString(obj.labelStyle.fillcolor),
                showBackground: obj.labelStyle.showBackground,
                backgroundColor: Cesium.Color.fromCssColorString(obj.labelStyle.backgroundColor),
                pixelOffset: {
                  x: obj.labelStyle.pixelOffset[0],
                  y: obj.labelStyle.pixelOffset[1]
                },
                scale: obj.labelStyle.scale,
                disableDepthTestDistance: 1e3
              }
            });
          } else if (billboardimg == void 0 && pointcolor == void 0) {
            var endpoint = viewer2.entities.add({
              position: cartesian,
              point: {
                show: true,
                pixelSize: 10,
                color: Cesium.Color.fromCssColorString("#bb99ff"),
                outlineColor: Cesium.Color.fromCssColorString("#4B0082"),
                outlineWidth: 2
              },
              label: {
                text: "\u89D2\u5EA6\uFF1A" + bearing + "\xB0",
                font: obj.labelStyle.font,
                fillColor: Cesium.Color.fromCssColorString(obj.labelStyle.fillcolor),
                showBackground: obj.labelStyle.showBackground,
                backgroundColor: Cesium.Color.fromCssColorString(obj.labelStyle.backgroundColor),
                pixelOffset: {
                  x: obj.labelStyle.pixelOffset[0],
                  y: obj.labelStyle.pixelOffset[1]
                },
                scale: obj.labelStyle.scale,
                disableDepthTestDistance: 1e3
              }
            });
          }
          markers.push(endpoint);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    function strFormat(str) {
      var strString = str.toString();
      var strs = strString.slice(0, strString.indexOf(".") + 3);
      return strs;
    }
    function drawLine(leftPoint, secPoint, color) {
      viewer2.entities.add({
        polyline: {
          positions: [leftPoint, secPoint],
          width: 2,
          material: color,
          depthFailMaterial: color
        }
      });
    }
  };
  var pointIdsTwo = [];
  var lineIdsTwo = [];
  Map3D.prototype.poumian = function(obj) {
    var _this = this;
    var ellipsoid = _this.viewer.scene.globe.ellipsoid;
    var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    var start, end;
    var profile = {
      arrHB: [],
      arrPoint: [],
      arrLX: [],
      ponits: [],
      disc: [],
      distance: []
    };
    var pointIds = {
      pointid: []
    };
    var lineIds = {
      lineid: []
    };
    var arr = [];
    function createPoint(worldPosition) {
      var point = _this.viewer.entities.add({
        name: "point",
        position: worldPosition,
        point: {
          pixelSize: 10,
          color: Cesium.Color.WHITE,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });
      pointIds.pointid.push(point.id);
      pointIdsTwo.push(point);
      return point;
    }
    function drawShape(positionData) {
      var shape;
      shape = _this.viewer.entities.add({
        name: "polyline",
        polyline: {
          positions: positionData,
          clampToGround: true,
          arcType: Cesium.ArcType.RHUMB,
          material: Cesium.Color.fromCssColorString(obj.color),
          width: obj.width
        }
      });
      lineIds.lineid.push(shape.id);
      lineIdsTwo.push(shape);
      return shape;
    }
    var activeShapePoints = [];
    var floatingPoint;
    handler.setInputAction(function(event) {
      var earthPosition = _this.viewer.scene.pickPosition(event.position);
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          start = earthPosition;
          floatingPoint = createPoint(earthPosition);
          activeShapePoints.push(earthPosition);
          var dynamicPositions = new Cesium.CallbackProperty(function() {
            return activeShapePoints;
          }, false);
          drawShape(dynamicPositions);
        }
        activeShapePoints.push(earthPosition);
        createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function(event) {
      if (Cesium.defined(floatingPoint)) {
        var newPosition = _this.viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function(event) {
      var length = activeShapePoints.length - 1;
      end = activeShapePoints[length];
      profileAnalyse(start, end);
      saveArr();
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    function profileAnalyse(start2, end2) {
      var scene = _this.viewer.scene;
      var startPoint2 = Cesium.Cartographic.fromCartesian(start2);
      var endPoint2 = Cesium.Cartographic.fromCartesian(end2);
      profile.ponits.push(start2);
      profile.arrPoint.push(getDegrees(startPoint2));
      profile.arrHB.push(startPoint2.height);
      var count = 100;
      var arrHeight = [];
      for (var i2 = 0; i2 < count; i2++) {
        var cart = Cesium.Cartesian3.lerp(
          start2,
          end2,
          i2 / count,
          new Cesium.Cartesian3()
        );
        arrHeight.push(cart);
        var cartographicCart = Cesium.Cartographic.fromCartesian(cart);
        profile.disc.push(distance(startPoint2, cartographicCart));
      }
      scene.clampToHeightMostDetailed(arrHeight).then(function(clampedCartesians) {
        for (var i3 = 0; i3 < count; i3++) {
          profile.ponits.push(clampedCartesians[i3]);
          profile.arrPoint.push(getDegrees(clampedCartesians[i3]));
          profile.arrHB.push(
            Cesium.Cartographic.fromCartesian(clampedCartesians[i3]).height
          );
        }
        profile.ponits.push(end2);
        profile.arrPoint.push(getDegrees(endPoint2));
        profile.arrHB.push(endPoint2.height);
        setEchartsData(profile);
      });
    }
    function saveArr() {
      arr.push(profile);
      arr.push(lineIds);
      arr.push(pointIds);
    }
    function distance(point1, point2) {
      var geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1, point2);
      var s = geodesic.surfaceDistance;
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));
      return s;
    }
    function getDegrees(cart) {
      var cartographic = ellipsoid.cartesianToCartographic(cart);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var lng = Cesium.Math.toDegrees(cartographic.longitude);
      var alt = cartographic.height;
      return {
        x: lng,
        y: lat,
        z: alt
      };
    }
    function strFormat(str) {
      var strString = str.toString();
      var strs = strString.slice(0, strString.indexOf(".") + 3);
      return strs;
    }
    function setEchartsData(e) {
      if (null != e && null != e.arrPoint) {
        $("#seChar").show();
        var myChart = echarts.init(
          document.getElementById("echartsView2"),
          "dark"
        );
        var t = e.arrPoint, chartData = {
          grid: {
            left: 10,
            right: 10,
            bottom: 10,
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            formatter: function(e2) {
              var a = "";
              var r = t[e2[0].dataIndex];
              return a += "\u6240\u5728\u4F4D\u7F6E:" + strFormat(r.x) + "," + strFormat(r.y) + "<br/>\u8DDD\u8D77\u70B9:" + haoutil.str.formatLength(e2[0].axisValue) + "<br/>\u9AD8\u7A0B\u503C:" + haoutil.str.formatLength(e2[0].value) + "<br/>";
            }
          },
          xAxis: {
            name: "\u8DDD\u79BB",
            type: "category",
            boundaryGap: false,
            axisLabel: {
              show: false
            },
            data: e.disc
          },
          yAxis: {
            type: "value",
            axisLabel: {
              rotate: 0,
              formatter: "{value} \u7C73"
            }
          },
          series: [{
            name: "\u9AD8\u7A0B\u503C",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              normal: {
                color: "rgb(255, 70, 131)"
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(255, 158, 68)"
                  },
                  {
                    offset: 1,
                    color: "rgb(255, 70, 131)"
                  }
                ])
              }
            },
            data: e.arrHB
          }]
        };
        myChart.setOption(chartData);
      }
    }
    var handlerone = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    handlerone.setInputAction(function(event) {
      let pickedObject = _this.viewer.scene.pick(event.position);
      if (Cesium.defined(pickedObject)) {
        if (pickedObject.id != void 0) {
          pickedObject.id;
          if (arr[1] != void 0 && pickedObject.id._id == arr[1].lineid) {
            setEchartsData(arr[0]);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  };
  Map3D.prototype.closepoumian = function() {
    var viewer2 = this.viewer;
    $("#seChar").hide();
    for (let i2 = 0; i2 < pointIdsTwo.length; i2++) {
      viewer2.entities.remove(pointIdsTwo[i2]);
    }
    for (let j = 0; j < lineIdsTwo.length; j++) {
      viewer2.entities.remove(lineIdsTwo[j]);
    }
  };
  let leftDownFlag = false;
  let pickedEntity = null;
  let MoveEntityIDs = [];
  Map3D.prototype.addMove3D = function(obj) {
    var viewer2 = this.viewer;
    MoveEntityIDs = obj.ids;
    viewer2.screenSpaceEventHandler.setInputAction((e) => {
      leftDownAction(e);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    viewer2.screenSpaceEventHandler.setInputAction((e) => {
      mouseMoveAction(e);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    viewer2.screenSpaceEventHandler.setInputAction((e) => {
      leftUpAction();
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    viewer2.scene.primitives.remove(model);
    function leftDownAction(e) {
      leftDownFlag = true;
      let picked = viewer2.scene.pick(e.position);
      if (picked) {
        for (i = 0; i < MoveEntityIDs.length; i++) {
          if (picked.id._id == MoveEntityIDs[i]) {
            document.body.style.cursor = "move";
            pickedEntity = Cesium.defaultValue(picked.id, picked.primitive.id);
            if (pickedEntity instanceof Cesium.Entity && pickedEntity.model) {
              viewer2.scene.screenSpaceCameraController.enableRotate = false;
            }
          }
        }
      }
    }
    function mouseMoveAction(e) {
      if (leftDownFlag && pickedEntity) {
        let cartesian = viewer2.scene.camera.pickEllipsoid(
          e.endPosition,
          viewer2.scene.globe.ellipsoid
        );
        pickedEntity.position = cartesian;
      }
    }
    function leftUpAction(e) {
      document.body.style.cursor = "default";
      leftDownFlag = false;
      pickedEntity = null;
      viewer2.scene.screenSpaceCameraController.enableRotate = true;
    }
  };
  Map3D.prototype.RemoveMove3D = function(obj) {
    for (i = 0; i < obj.ids.length; i++) {
      var index = MoveEntityIDs.indexOf(obj.ids[i]);
      if (index > -1) {
        MoveEntityIDs.splice(index, 1);
      }
    }
  };
  var juzhengmodel = [];
  Map3D.prototype.addJuzhen = function(obj) {
    var viewer2 = this.viewer;
    const pos = Cesium.Cartesian3.fromDegrees(
      obj.position[0],
      obj.position[1],
      obj.position[2]
    );
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(pos);
    var model2 = viewer2.scene.primitives.add(
      Cesium.Model.fromGltf({
        id: obj.id,
        url: obj.url,
        scale: obj.scale,
        modelMatrix: matrix
      })
    );
    juzhengmodel.push(model2);
    viewer2.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        obj.position[0],
        obj.position[1],
        1e6
      )
    });
  };
  let AngleEntityIDs = [];
  Map3D.prototype.addAngle3D = function(obj) {
    var viewer2 = this.viewer;
    AngleEntityIDs = obj.ids;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);
    handler.setInputAction(function(movement) {
      document.body.style.cursor = "move";
      var pick = viewer2.scene.pick(movement.position);
      handler.setInputAction((movement2) => {
        if (pick) {
          for (i = 0; i < AngleEntityIDs.length; i++) {
            if (pick.id == AngleEntityIDs[i]) {
              const angelZ = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(5));
              const rotationZ = Cesium.Matrix4.fromRotationTranslation(angelZ);
              Cesium.Matrix4.multiply(
                juzhengmodel[i].modelMatrix,
                rotationZ,
                juzhengmodel[i].modelMatrix
              );
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      viewer2.screenSpaceEventHandler.setInputAction((e) => {
        pick = 0;
        document.body.style.cursor = "default";
        viewer2.scene.screenSpaceCameraController.enableRotate = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
      viewer2.scene.screenSpaceCameraController.enableRotate = false;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  };
  Map3D.prototype.RemoveAngle3D = function(obj) {
    for (i = 0; i < obj.ids.length; i++) {
      var index = AngleEntityIDs.indexOf(obj.ids[i]);
      if (index > -1) {
        AngleEntityIDs.splice(index, 1);
      }
      console.log(AngleEntityIDs);
    }
  };
  Map3D.prototype.addPlanish = function(obj) {
    var viewer2 = this.viewer;
    var longitude = obj.position[0];
    var latitude = obj.position[1];
    viewer2.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        obj.heading
      )
    });
    let dian = viewer2.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      point: {
        pixelSize: obj.point.pixelSize,
        color: Cesium.Color.fromCssColorString(obj.point.color)
      }
    });
    var options = {
      lng: obj.position[0],
      lat: obj.position[1],
      height: obj.position[3]
    };
    var position = Cesium.Cartesian3.fromDegrees(
      options.lng,
      options.lat,
      options.height
    );
    var pitch = obj.pitch;
    var angle = obj.angle;
    var distance = obj.distance;
    var startTime = Cesium.JulianDate.fromDate(new Date());
    if (obj.isshow == true) {
      dian.show = true;
    } else {
      dian.show = false;
    }
    var stopTime = Cesium.JulianDate.addSeconds(
      startTime,
      10,
      new Cesium.JulianDate()
    );
    viewer2.clock.startTime = startTime.clone();
    viewer2.clock.stopTime = stopTime.clone();
    viewer2.clock.currentTime = startTime.clone();
    viewer2.clock.clockRange = Cesium.ClockRange.CLAMPED;
    viewer2.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
    var initialHeading = viewer2.camera.heading;
    var Exection = function TimeExecution() {
      var delTime = Cesium.JulianDate.secondsDifference(
        viewer2.clock.currentTime,
        viewer2.clock.startTime
      );
      var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
      viewer2.scene.camera.setView({
        destination: position,
        orientation: {
          heading,
          pitch
        }
      });
      viewer2.scene.camera.moveBackward(distance);
      if (Cesium.JulianDate.compare(
        viewer2.clock.currentTime,
        viewer2.clock.stopTime
      ) >= 0) {
        viewer2.clock.onTick.removeEventListener(Exection);
      }
    };
    viewer2.clock.onTick.addEventListener(Exection);
  };
  var spacecruisenum = 0, spacecruisedata = [], CEventHandler = void 0, nowmultiplier = 0, startspace = false;
  var bottonText = "\u6682\u505C";
  var pointsArr = [];
  Map3D.prototype.drawFLine = function(paramObj) {
    var viewer2 = this.viewer;
    if (startspace) {
      alert("\u6B63\u5728\u6F2B\u6E38,\u4E0D\u80FD\u6DFB\u52A0");
      return false;
    }
    if (CEventHandler) {
      return false;
    }
    CEventHandler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);
    CEventHandler.setInputAction(function(movement) {
      var cartesian = viewer2.scene.pickPosition(movement.position);
      pointsArr.push(cartesian);
      var ellipsoid = viewer2.scene.globe.ellipsoid;
      var xyz = new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z);
      var wgs84 = ellipsoid.cartesianToCartographic(xyz);
      var latitude = Cesium.Math.toDegrees(wgs84.latitude);
      var longitude = Cesium.Math.toDegrees(wgs84.longitude);
      var height = wgs84.height;
      var obj = {
        x: longitude,
        y: latitude,
        z: height,
        id: "spacecruise" + spacecruisenum
      };
      addtablespacecruise(obj);
      addEntitypoint(obj);
      if (pointsArr.length > 1) {
        drawPolyline([pointsArr[pointsArr.length - 2], pointsArr[pointsArr.length - 1]]);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    function addtablespacecruise(obj) {
      spacecruisedata.push(obj);
      spacecruisenum++;
    }
    var billboardimage = paramObj.billboard.image;
    if (billboardimage == "") {
      billboardimage = "images/map/tag_pin_pass.png";
    }
    function addEntitypoint(obj) {
      viewer2.entities.add({
        id: "spacecruise" + spacecruisenum,
        position: Cesium.Cartesian3.fromDegrees(
          Number(obj.x),
          Number(obj.y),
          Number(obj.z)
        ),
        billboard: {
          image: billboardimage,
          scale: paramObj.billboard.scale,
          pixelOffset: {
            x: paramObj.billboard.pixelOffset[0],
            y: paramObj.billboard.pixelOffset[1]
          },
          show: paramObj.billboard.show,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.NONE
        },
        label: {
          text: "\u9014\u7ECF\u70B9" + spacecruisenum,
          font: paramObj.labelStyle.font,
          fillColor: Cesium.Color.fromCssColorString(paramObj.labelStyle.fillcolor),
          scale: paramObj.labelStyle.scale,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            2e5
          ),
          pixelOffset: {
            x: paramObj.labelStyle.pixelOffset[0],
            y: paramObj.labelStyle.pixelOffset[1]
          },
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          showBackground: paramObj.labelStyle.showBackground,
          backgroundColor: Cesium.Color.fromCssColorString(paramObj.labelStyle.backgroundColor)
        }
      });
    }
    function drawPolyline(positions) {
      viewer2.entities.add({
        polyline: {
          positions,
          width: paramObj.polyline.width,
          material: Cesium.Color.fromCssColorString(paramObj.polyline.color),
          depthFailMaterial: Cesium.Color.fromCssColorString(paramObj.polyline.color)
        }
      });
    }
  };
  Map3D.prototype.startFLine = function() {
    viewer = this.viewer;
    if (spacecruisedata.length == 0) {
      alert("\u8BF7\u6DFB\u52A0\u4E24\u4E2A\u4EE5\u4E0A\u6F2B\u6E38\u70B9");
      return;
    }
    if (spacecruisedata.length == 1) {
      alert("\u8BF7\u6DFB\u52A0\u4E24\u4E2A\u4EE5\u4E0A\u6F2B\u6E38\u70B9");
      return;
    }
    startspace = true;
    if (CEventHandler) {
      CEventHandler.destroy();
      CEventHandler = void 0;
    }
    var parameter = {
      setTime: {
        multiplier: 1,
        altitude: 20,
        intervalseconds: 20
      },
      data: {
        Coordinates: spacecruisedata,
        linecolor: "#FFC200",
        linewidth: 5
      },
      resolution: 1,
      Callbackfun: spacecallbackfun
    };
    document.getElementById("myflyline").innerText = "\u6682\u505C\u6F2B\u6E38";
    bottonText = "\u6682\u505C";
    YiFly("draw", parameter);
  };
  function YiFly(type, drawflydata) {
    stop_Fly3DPaths();
    if (type == "draw") {
      if (drawflydata != null) {
        flyExtentss(viewer, drawflydata.data);
        this.visual = false;
        drawflydata.data.Coordinates[0];
        ({
          position: viewer.camera.position,
          heading: viewer.camera.heading,
          pitch: viewer.camera.pitch,
          roll: Cesium.Math.toDegrees(viewer.camera.roll).toFixed(2)
        });
      } else {
        this.$Message["warning"]({
          background: true,
          content: "\u98DE\u884C\u8DEF\u7EBF\u4E0D\u5B58\u5728"
        });
      }
    }
  }
  function stop_Fly3DPaths() {
    {
      boolflya(viewer);
    }
  }
  function spacecallbackfun() {
    startspace = false;
  }
  Map3D.prototype.suspendFLine = function() {
    pause_Fly3DPaths();
    if (bottonText == "\u6682\u505C") {
      bottonText = "\u7EE7\u7EED";
      nowmultiplier = viewer.clock.multiplier;
      viewer.clock.multiplier = 0;
      document.getElementById("myflyline").innerText = "\u7EE7\u7EED\u6F2B\u6E38";
    } else {
      viewer.clock.multiplier = nowmultiplier;
      bottonText = "\u6682\u505C";
      document.getElementById("myflyline").innerText = "\u6682\u505C\u6F2B\u6E38";
    }
    function pause_Fly3DPaths() {
      pauseFly3DPaths(viewer);
    }
  };
  Map3D.prototype.stopFLine = function(obj) {
    document.getElementById("myflyline").innerText = "\u6682\u505C\u6F2B\u6E38";
    bottonText = "\u6682\u505C";
    if (spacecruisedata.length == 0) {
      alert("\u8BF7\u5148\u6DFB\u52A0\u6F2B\u6E38\u70B9");
      return;
    }
    quxiao();
    Flashback(obj.flashback);
  };
  function quxiao() {
    stop_Fly3DPaths();
    startspace = false;
    viewer.clock.multiplier = 0;
  }
  function Flashback(flashback) {
    viewer.zoomTo(flashback);
  }
  Map3D.prototype.blockFLine = function() {
    for (var j = 0; j < this.viewer.entities._entities._array.length; j++) {
      var id = this.viewer.entities._entities._array[j]._id;
      var entity = this.viewer.entities.getById(id);
      if (entity) {
        entity.show = true;
      }
    }
  };
  Map3D.prototype.hideFLine = function() {
    if (startspace) {
      alert("\u6B63\u5728\u6F2B\u6E38,\u4E0D\u80FD\u9690\u85CF\u8DEF\u7EBF");
      return false;
    }
    for (var j = 0; j < this.viewer.entities._entities._array.length; j++) {
      var id = this.viewer.entities._entities._array[j]._id;
      var entity = this.viewer.entities.getById(id);
      if (entity) {
        entity.show = false;
      }
    }
  };
  Map3D.prototype.delFLine = function() {
    if (startspace) {
      alert("\u6B63\u5728\u6F2B\u6E38,\u4E0D\u80FD\u79FB\u9664");
      return false;
    }
    spacecruisedata = [];
    pointsArr = [];
    if (spacecruisedata.length == 0) {
      spacecruisenum = 0;
    }
    this.viewer.entities.removeAll();
  };
  Map3D.prototype.startDraw = function(attribute) {
    if (!attribute.config)
      ;
    this.dataSouce = new Cesium.CustomDataSource();
    this.viewer.dataSources.add(this.dataSource);
    this._maxPointNum = 2;
    var addattr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getShowPosition(time);
      }, false),
      ellipse: attr.style2Entity(attribute.style),
      attribute
    };
    addattr.polyline = {
      clampToGround: attribute.style.clampToGround,
      arcType: Cesium.ArcType.RHUMB,
      show: false
    };
    this.entity = this.dataSource.entities.add(addattr);
    return this.entity;
  };
  Map3D.prototype.setGlobalConfig = function(options) {
    const { viewer: viewer2 } = this;
    const { enableZoom, enableRotate, cursor } = options;
    if (enableRotate !== void 0)
      viewer2.scene.screenSpaceCameraController.enableRotate = enableRotate;
    if (enableZoom !== void 0)
      viewer2.scene.screenSpaceCameraController.enableZoom = enableZoom;
    if (cursor !== void 0)
      viewer2._container.style.cursor = cursor;
  };
  Map3D.prototype.screenToword = function(params) {
    const { viewer: viewer2 } = this;
    const scenePosition = new Cesium.Cartesian2(params.x, params.y);
    let longitude = 0;
    let latitude = 0;
    let height = 0;
    let position = viewer2.scene.pickPosition(scenePosition);
    if (!Cesium.defined(position)) {
      position = viewer2.camera.pickEllipsoid(scenePosition);
    }
    if (Cesium.defined(position)) {
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      longitude = Cesium.Math.toDegrees(cartographic.longitude);
      latitude = Cesium.Math.toDegrees(cartographic.latitude);
      height = cartographic.height > 0 ? cartographic.height : 0;
    }
    return {
      longitude,
      latitude,
      height
    };
  };
  Map3D.prototype.addS3MTilesLayer = function(...args) {
    return this.viewer.scene.open(...args);
  };
  Map3D.prototype.addDataSource = function(dataSource) {
    if (!Cesium.defined(dataSource)) {
      throw new Cesium.DeveloperError("dataSource is required.");
    }
    return this.viewer.dataSources.add(dataSource);
  };
  class Viewer1 extends cesium.Viewer {
    constructor(container, options) {
      super(container, __spreadValues({
        imageryProvider: new cesium.SingleTileImageryProvider({
          url: "./Cesium/Assets/Textures/globe_warm.jpg"
        }),
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        infoBox: false,
        timeline: false,
        fullscreenButton: false,
        creditContainer: document.createElement("div")
      }, options));
    }
    get camera() {
      return super.camera;
    }
    get entities() {
      return super.entities;
    }
  }
  window.gis = {
    Map3D,
    Service: TGisService
  };
  Object.defineProperty(exports, "ArcGisMapServerImageryProvider", {
    enumerable: true,
    get: () => cesium.ArcGisMapServerImageryProvider
  });
  Object.defineProperty(exports, "BillboardGraphics", {
    enumerable: true,
    get: () => cesium.BillboardGraphics
  });
  Object.defineProperty(exports, "Camera", {
    enumerable: true,
    get: () => cesium.Camera
  });
  Object.defineProperty(exports, "Cartesian2", {
    enumerable: true,
    get: () => cesium.Cartesian2
  });
  Object.defineProperty(exports, "Cartesian3", {
    enumerable: true,
    get: () => cesium.Cartesian3
  });
  Object.defineProperty(exports, "Cartographic", {
    enumerable: true,
    get: () => cesium.Cartographic
  });
  Object.defineProperty(exports, "Color", {
    enumerable: true,
    get: () => cesium.Color
  });
  Object.defineProperty(exports, "Entity", {
    enumerable: true,
    get: () => cesium.Entity
  });
  Object.defineProperty(exports, "EntityCollection", {
    enumerable: true,
    get: () => cesium.EntityCollection
  });
  Object.defineProperty(exports, "GeographicTilingScheme", {
    enumerable: true,
    get: () => cesium.GeographicTilingScheme
  });
  Object.defineProperty(exports, "JulianDate", {
    enumerable: true,
    get: () => cesium.JulianDate
  });
  Object.defineProperty(exports, "LabelGraphics", {
    enumerable: true,
    get: () => cesium.LabelGraphics
  });
  Object.defineProperty(exports, "LabelStyle", {
    enumerable: true,
    get: () => cesium.LabelStyle
  });
  Object.defineProperty(exports, "MaterialProperty", {
    enumerable: true,
    get: () => cesium.MaterialProperty
  });
  Object.defineProperty(exports, "PointGraphics", {
    enumerable: true,
    get: () => cesium.PointGraphics
  });
  Object.defineProperty(exports, "PolygonGraphics", {
    enumerable: true,
    get: () => cesium.PolygonGraphics
  });
  Object.defineProperty(exports, "PolygonHierarchy", {
    enumerable: true,
    get: () => cesium.PolygonHierarchy
  });
  Object.defineProperty(exports, "PolylineGraphics", {
    enumerable: true,
    get: () => cesium.PolylineGraphics
  });
  Object.defineProperty(exports, "Scene", {
    enumerable: true,
    get: () => cesium.Scene
  });
  Object.defineProperty(exports, "SingleTileImageryProvider", {
    enumerable: true,
    get: () => cesium.SingleTileImageryProvider
  });
  Object.defineProperty(exports, "UrlTemplateImageryProvider", {
    enumerable: true,
    get: () => cesium.UrlTemplateImageryProvider
  });
  Object.defineProperty(exports, "WebMercatorTilingScheme", {
    enumerable: true,
    get: () => cesium.WebMercatorTilingScheme
  });
  exports.BaseControl = BaseControl;
  exports.ControlCollection = ControlCollection;
  exports.CoordTransforms = CoordTransforms;
  exports.Format = Format;
  exports.GMLFormat = GMLFormat;
  exports.ImagerySplit = ImagerySplit;
  exports.Map3D = Map3D;
  exports.Position = Position$1;
  exports.SuperMapImageryProvider = SupermapImageryProvider;
  exports.TGisService = TGisService;
  exports.TianDiService = TianDiService;
  exports.TopolAnalysis = TopolAnalysis;
  exports.Viewer = Viewer1;
  exports.WebFeatureServiceImageryProvider = WebFeatureServiceImageryProvider;
  Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
  return exports;
}({}, Cesium);
