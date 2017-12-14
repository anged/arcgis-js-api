// COPYRIGHT © 2017 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.6/esri/copyright.txt for details.

define(["require","exports","../../../../core/tsSupport/extendsHelper","../../../../core/tsSupport/generatorHelper","../../../../core/tsSupport/awaiterHelper","./Graphics3DGraphicElevationContext","./featureExpressionInfoUtils","../../webgl-engine/Stage","../../lib/glMatrix","../../support/aaBoundingBox"],function(e,t,i,s,n,o,r,a,u,l){function h(e,t,i){return i||(i=l.create()),l.setMin(i,e.getBBMin(t)),l.setMax(i,e.getBBMax(t)),i}var g=u.vec3d,d=u.mat4d,c=[0,0,0],p=function(){function e(t,i,s,n,r,a,u,l){this._addedToStage=!1,this.alignedTerrainElevation=0,this.needsElevationUpdates=!1,this.graphics3DSymbolLayer=t,this.uniqueMaterials=n,this.uniqueGeometries=s,this.uniqueTextures=r,this.stageObject=i,this.elevationAligner=a,this.elevationContext=new o(u),this.stage=null,this.stageLayer=null,this._visible=!1,this.visibilityMode=null!=l?l:e.VisibilityModes.HIDE_FACERANGE}return e.prototype.initialize=function(e,t){if(this.stageLayer=e,this.stage=t,this.uniqueMaterials)for(var i=0;i<this.uniqueMaterials.length;i++)t.add(a.ModelContentType.MATERIAL,this.uniqueMaterials[i]);if(this.uniqueGeometries)for(var i=0;i<this.uniqueGeometries.length;i++)t.add(a.ModelContentType.GEOMETRY,this.uniqueGeometries[i]);if(this.uniqueTextures)for(var i=0;i<this.uniqueTextures.length;i++)t.add(a.ModelContentType.TEXTURE,this.uniqueTextures[i]);t.add(a.ModelContentType.OBJECT,this.stageObject)},e.prototype.isDraped=function(){return!1},e.prototype.setVisibility=function(t){return null!=this.stage?this._visible!==t?(this._visible=t,this._visible?this._addedToStage?this.stageObject.unhideAllComponents():(this.stageLayer.addObject(this.stageObject),this._addedToStage=!0):this.visibilityMode===e.VisibilityModes.HIDE_FACERANGE?this.stageObject.hideAllComponents():(this.stageLayer.removeObject(this.stageObject),this._addedToStage=!1),!0):!1:void 0},e.prototype.destroy=function(){var e=this.stage;if(this.stageLayer){if(this.uniqueMaterials)for(var t=0;t<this.uniqueMaterials.length;t++)e.remove(a.ModelContentType.MATERIAL,this.uniqueMaterials[t].getId());if(this.uniqueGeometries)for(var t=0;t<this.uniqueGeometries.length;t++)e.remove(a.ModelContentType.GEOMETRY,this.uniqueGeometries[t].getId());if(this.uniqueTextures)for(var t=0;t<this.uniqueTextures.length;t++)e.remove(a.ModelContentType.TEXTURE,this.uniqueTextures[t].getId())}e.remove(a.ModelContentType.OBJECT,this.stageObject.getId()),this._addedToStage&&(this.stageLayer.removeObject(this.stageObject),this._addedToStage=!1),this._visible=!1,this.stageLayer=null,this.stage=null},e.prototype.alignWithElevation=function(e,t,i){if(this.elevationAligner){r.setContextFeature(this.elevationContext.featureExpressionInfoContext,i);var s=this.elevationAligner(this.stageObject,this.elevationContext,e,t);null!=s&&(this.alignedTerrainElevation=s)}},e.prototype.setDrawOrder=function(e,t,i){},e.prototype.getBSRadius=function(){return this.stageObject.getBSRadius()},e.prototype.getCenterObjectSpace=function(){return this.stageObject.getCenter(!0)},e.prototype.getBoundingBoxObjectSpace=function(e){return h(this.stageObject,!0,e)},e.prototype.getProjectedBoundingBox=function(e,t,i,o){return n(this,void 0,void 0,function(){var n,r,a,u,h,g,u,p,y,T;return s(this,function(s){switch(s.label){case 0:for(n=this.getBoundingBoxObjectSpace(i),r=b,a=l.isPoint(n)?1:r.length,u=0;a>u;u++)h=r[u],f[0]=n[h[0]],f[1]=n[h[1]],f[2]=n[h[2]],d.multiplyVec3(this.stageObject.objectTransformation,f),v[3*u+0]=f[0],v[3*u+1]=f[1],v[3*u+2]=f[2];if(!e(v,0,a))return[3,6];for(l.set(n,l.NEGATIVE_INFINITY),g=null,this.calculateRelativeScreenBounds&&(g=this.calculateRelativeScreenBounds()),u=0;3*a>u;u+=3){for(p=0;3>p;p++)n[p]=Math.min(n[p],v[u+p]),n[p+3]=Math.max(n[p+3],v[u+p]);g&&o.push({location:v.slice(u,u+3),screenSpaceBoundingRect:g})}if(!t)return[3,5];if(l.center(n,c),"absolute-height"===this.elevationContext.mode)return[3,5];y=void 0,s.label=1;case 1:return s.trys.push([1,3,,4]),[4,t.queryElevation(c[0],c[1])];case 2:return y=s.sent(),[3,4];case 3:return T=s.sent(),y=null,[3,4];case 4:null!=y&&l.offset(n,0,0,-this.alignedTerrainElevation+y),s.label=5;case 5:return[2,n];case 6:return[2,null]}})})},e.prototype.addHighlight=function(e,t){var i=this.stageObject.highlightAllComponents(t);e.addObject(this.stageObject,i)},e.prototype.removeHighlight=function(e){e.removeObject(this.stageObject)},e.VisibilityModes={REMOVE_OBJECT:0,HIDE_FACERANGE:1},e}(),v=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],f=g.create(),b=[[0,1,2],[3,1,2],[0,4,2],[3,4,2],[0,1,5],[3,1,5],[0,4,5],[3,4,5]];return p});