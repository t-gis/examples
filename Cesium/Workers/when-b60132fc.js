/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.98
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(["exports"],function(O){"use strict";function B(n,r){return n??r}/**
      @license
      when.js - https://github.com/cujojs/when

      MIT License (c) copyright B Cavalier & J Hann

     * A lightweight CommonJS Promises/A and when() implementation
     * when is part of the cujo.js family of libraries (http://cujojs.com/)
     *
     * Licensed under the MIT License at:
     * http://www.opensource.org/licenses/mit-license.php
     *
     * @version 1.7.1
     */var C,J,T;function c(n,r,e,u){return j(n).then(r,e,u)}function j(n){var r,e,u;return n instanceof k?r=n:S(n)?(e=b(),n.then(function(t){e.resolve(t)},function(t){e.reject(t)},function(t){e.progress(t)}),r=e.promise):(u=n,r=new k(function(t){try{return j(t?t(u):u)}catch(i){return w(i)}})),r}function k(n){this.then=n}function w(n){return new k(function(r,e){try{return e?j(e(n)):w(n)}catch(u){return w(u)}})}function b(){var n,r,e,u,t,i;return n=new k(l),r=[],e=[],u=function(o,v,m){var s,g;return s=b(),g=typeof m=="function"?function(d){try{s.progress(m(d))}catch(M){s.progress(M)}}:function(d){s.progress(d)},r.push(function(d){d.then(o,v).then(s.resolve,s.reject,g)}),e.push(g),s.promise},t=function(o){return _(e,o),o},i=function(o){return o=j(o),u=o.then,i=j,t=E,_(r,o),e=r=T,o},{then:l,resolve:a,reject:f,progress:p,promise:n,resolver:{resolve:a,reject:f,progress:p}};function l(o,v,m){return u(o,v,m)}function a(o){return i(o)}function f(o){return i(w(o))}function p(o){return t(o)}}function S(n){return n&&typeof n.then=="function"}function V(n,r,e,u,t){return P(2,arguments),c(n,function(i){var l,a,f,p,o,v,m,s,g,d;if(g=i.length>>>0,l=Math.max(0,Math.min(r,g)),f=[],a=g-l+1,p=[],o=b(),l)for(s=o.progress,m=function(y){p.push(y),--a||(v=m=E,o.reject(p))},v=function(y){f.push(y),--l||(v=m=E,o.resolve(f))},d=0;d<g;++d)d in i&&c(i[d],z,M,s);else o.resolve(f);return o.then(e,u,t);function M(y){m(y)}function z(y){v(y)}})}function Y(n,r,e,u){return P(1,arguments),x(n,q).then(r,e,u)}function x(n,r){return c(n,function(e){var u,t,i,l,a,f;if(i=t=e.length>>>0,u=[],f=b(),i)for(l=function(p,o){c(p,r).then(function(v){u[o]=v,--i||f.resolve(u)},f.reject)},a=0;a<t;a++)a in e?l(e[a],a):--i;else f.resolve(u);return f.promise})}function _(n,r){for(var e,u=0;e=n[u++];)e(r)}function P(n,r){for(var e,u=r.length;u>n;)if((e=r[--u])!=null&&typeof e!="function")throw new Error("arg "+u+" must be a function")}function E(){}function q(n){return n}B.EMPTY_OBJECT=Object.freeze({}),c.defer=b,c.resolve=j,c.reject=function(n){return c(n,w)},c.join=function(){return x(arguments,q)},c.all=Y,c.map=x,c.reduce=function(n,r){var e=J.call(arguments,1);return c(n,function(u){var t;return t=u.length,e[0]=function(i,l,a){return c(i,function(f){return c(l,function(p){return r(f,p,a,t)})})},C.apply(u,e)})},c.any=function(n,r,e,u){return V(n,1,function(t){return r?r(t[0]):t[0]},e,u)},c.some=V,c.allSettled=function(n,r,e,u){return P(1,arguments),c(n,function(t){var i,l,a,f,p,o,v,m,s;for(v=t.length>>>0,m=t.length>>>0,i=[],l=[],o=(a=b()).progress,p=function(h){l.push(h),--m||(f=p=E,a.resolve(i))},f=function(h,F){i[F]=h,--m||(f=p=E,a.resolve(i))},s=0;s<v;++s)switch(s){case 0:c(t[s],M,g,o);break;case 1:c(t[s],z,g,o);break;case 2:c(t[s],y,g,o);break;case 3:c(t[s],A,g,o);break;case 4:c(t[s],D,g,o);break;default:c(t[s],d,g,o)}return a.then(r,e,u);function g(h){p(h)}function d(h){f(h,0)}function M(h){f(h,0)}function z(h){f(h,1)}function y(h){f(h,2)}function A(h){f(h,3)}function D(h){f(h,4)}})},c.chain=function(n,r,e){var u=arguments.length>2;return c(n,function(t){return t=u?e:t,r.resolve(t),t},function(t){return r.reject(t),w(t)},r.progress)},c.isPromise=S,k.prototype={always:function(n,r){return this.then(n,n,r)},otherwise:function(n){return this.then(T,n)},yield:function(n){return this.then(function(){return n})},spread:function(n){return this.then(function(r){return Y(r,function(e){return n.apply(T,e)})})}},J=[].slice,C=[].reduce||function(n){var r,e,u,t,i;if(i=0,t=(r=Object(this)).length>>>0,(e=arguments).length<=1)for(;;){if(i in r){u=r[i++];break}if(++i>=t)throw new TypeError}else u=e[1];for(;i<t;++i)i in r&&(u=n(u,r[i],i,r));return u},O.defaultValue=B,O.defined=function(n){return n!=null},O.when=c});
