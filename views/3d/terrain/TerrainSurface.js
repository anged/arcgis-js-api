// COPYRIGHT © 2016 Esri
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
// See http://js.arcgis.com/4.0/esri/copyright.txt for details.

define(["../../../core/declare","../../../core/Accessoire","../../../core/arrayUtils","dojo/Evented","dojo/on","../lib/glMatrix","../support/eventUtils","../support/projectionUtils","../support/ResourceController","../support/PromiseLightweight","../../../geometry/support/webMercatorUtils","./TerrainRenderer","./OverlayManager","./SurfaceExtentHelper","./SurfaceTilingSchemeLogic","./TilingScheme","./terrainUtils","./TileUtils","./TerrainConst","./TileGeometryFactory","./SphericalTile","./PlanarTile","./TilemapOnlyTile","./MapTileAgent","./ElevationTileAgent","../support/PreallocArray","../support/ObjectPool","../support/aaBoundingRect","../support/mathUtils"],function(e,t,i,r,a,s,n,l,o,h,d,u,c,A,p,g,_,v,f,T,y,m,E,w,L,S,x,C,P){function I(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}var R=s.vec3d,U=s.vec4d,B=s.mat4d,V=_.weakAssert,D=64,O=12,M=1.2,b=80/180*Math.PI,q=f.TileUpdateTypes,N=U.create(),H=[0,0,0],Q=new Array(10),j={spatialReference:null,tile:null},k={spatialReference:null,extent:null},F={spatialReference:null,extent:null,scale:0},G=[-1/0,-1/0,1/0,1/0],Y=function(e){e.remove()},Z="data:image/png;base64,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",X=e([t,r],{classMetadata:{properties:{ready:{readOnly:!0,getter:function(){return!!this._rootTiles}},manifold:{readOnly:!0,getter:function(){return this._manifold}},tilingScheme:{readOnly:!0,getter:function(){return this._tilingScheme}},tilingSchemeLocked:{readOnly:!0,getter:function(){return this.tilingSchemeLogic.tilingSchemeLocked}},spatialReference:{readOnly:!0,dependsOn:["tilingScheme"],getter:function(){return this._tilingScheme?this._tilingScheme.spatialReference:null}},overlayManager:{value:null},wireframe:{value:!1},opacity:{value:1},cullBackFaces:{value:!1},renderOrder:{value:1},skirts:{value:!0},frontMostTransparent:{value:!1},tileBackground:{value:Z},extent:{}}},defaultTileBackground:Z,constructor:function(){for(this._rootTiles=null,this._iteratorPool=new x(2,v.IteratorPreorder),this._postorderIterator=new v.IteratorPostorder,this._topLevelTilemapOnlyTiles=new Array(f.TILEMAP_SIZE_EXP+1),e=0;e<this._topLevelTilemapOnlyTiles.length;e++)this._topLevelTilemapOnlyTiles[e]=new E([e-f.TILEMAP_SIZE_EXP,0,0]);this._tilingScheme=null,this._clippingExtent=null,this._dataExtent=null,this._rootExtent=[0,0,0,0],this.notifyChange("extent"),this._elevationBounds=[0,0],this.loaded=!1,this._frameUpdateLowerPrio=new S(500),this.maxTextureScale=1.2,this._stage=this._view._stage,this.visible=!1,this.suspended=!1,this._pendingUpdates=!1,this._lvPendingUpdates=!1,this._updateNextFrame=!1,this._curOverlayOpacity=1,this._curEyePos=R.create(),this._curSplitLimits=[0,0,0,0,0],this._curFrustumPlanes=new Array(6),this._viewProjectionMatrix=B.identity();for(var e=0;6>e;++e)this._curFrustumPlanes[e]=U.create();this.tilemapStats={tilemapRequestsSent:0,tilemapRequestsPending:0,tilemapRequestErrors:0,fullTilemaps:0,emptyTilemaps:0,tilesRequested:0,tileRequestsSent:0,tileRequestErrors:0,tilesNotPresent:0},this._layerViews=[[],[]],this._layerIndexByLayerViewId=[{},{}],this._basemapLayerViewHandles={},this._groupLayerViewHandles={},this._layerViewChangesHandle=null,this.hideSkirtsDistanceFromExtentMargin=M,this.hideSkirtsMinimumCameraTilt=b},normalizeCtorArgs:function(e,t){return this._view=e,this._manifold=t,this.TileClass="planar"===t?m:y,{}},initialize:function(){this._renderer=new u(this.manifold),this._renderer.loaded=this._setLoaded.bind(this),this._renderer.updateTileBackground(this.tileBackground),this._renderer.install(this._view._stage),this.overlayManager=new c(this,this._view);var e="spherical"===this.manifold?A.SurfaceExtentHelperGlobal:A.SurfaceExtentHelperLocal;this.extentHelper=new e({layers:this._view.map.allLayers,layerViews:this._view.allLayerViews,spatialReference:this._view.spatialReference}),this.tilingSchemeLogic=new p({layers:this._view.map.allLayers,extentHelper:this.extentHelper,manifold:this.manifold,viewSpatialReference:this._view.spatialReference}),this.tilingSchemeLogic.changeCallback=this._updateTilingSchemeAndExtent.bind(this),this._updateTilingSchemeAndExtent(),this._streamDataSupplier=this._view.resourceController.registerClient(this,o.ClientType.TERRAIN),this._idleWorkers={needsUpdate:this._needsIdleUpdate,idleFrame:this._idleUpdate},this._view.resourceController.registerFrameWorker(this._frameUpdate.bind(this)),this._view.resourceController.registerIdleFrameWorker(this,this._idleWorkers),this._viewChangeListenerHandles=[],this._viewChangeUpdate=this._viewChangeUpdate.bind(this),this._viewChangeListenerHandles.push(this._view.on("resize",this._viewChangeUpdate)),this._viewChangeListenerHandles.push(n.on(this._view,"navigation.currentViewChanged",this._viewChangeUpdate)),this._viewChangeListenerHandles.push(this._view.watch("qualitySettings.tiledSurface.lodBias",this._viewChangeUpdate)),this._layerViewChangesHandle=this._view.allLayerViews.on("change",this._handleLayerViewChanges.bind(this)),this._handleLayerViewChanges({added:this._view.allLayerViews.toArray(),removed:[],moved:[]}),this._clippingChangedHandle=this._view.watch("clippingArea",this._clippingChanged.bind(this)),this._updateClippingExtent()},destroy:function(){this._removeAllTiles(),this.tilingSchemeLogic.destroy(),this.tilingSchemeLogic=null,this.extentHelper.destroy(),this.extentHelper=null;for(var e in this._basemapLayerViewHandles)this._unregisterTiledLayerView(e);this._view.resourceController.deregisterFrameWorker(this),this._view.resourceController.deregisterIdleFrameWorker(this),this._view.resourceController.deregisterClient(this),this._viewChangeListenerHandles.forEach(Y);for(var t in this._groupLayerViewHandles)this._groupLayerViewHandles[t].forEach(Y);this._layerViewChangesHandle.remove(),this._clippingChangedHandle.remove(),this.overlayManager&&(this.overlayManager.destroy(),this.overlayManager=null),this._renderer.uninstall(this._stage),this._renderer=null,this._view=null,this._stage=null,this._streamDataSupplier=null},setVisibility:function(e){e!==this.visible&&(this.visible=e,this._renderer.setVisibility(e),this.setUpdatesDisabled(!e),e&&this._viewChangeUpdate())},isVisible:function(){return this.visible&&this.ready},setUpdatesDisabled:function(e){this.suspended=e,e||this._viewChangeUpdate()},getElevation:function(e){if(!this.ready)return null;var t=f.LayerClass.ELEVATION,i=this._rootTiles[0].layerInfo[t].length;return 0===i?null:Array.isArray(e)?this._getElevation(e):l.pointToVector(e,N,this.tilingScheme.spatialReference)?this._getElevation(N):(console.error("TerrainSurface.getElevation(): could not project given point to tiling scheme coordinate system"),null)},_getElevation:function(e){var t,i=f.LayerClass.ELEVATION,r=this._rootTiles[0].layerInfo[i].length;Q.length<r&&(Q.length=r);for(var a=0;a<this._rootTiles.length;a++){var s=this._rootTiles[a];if(v.isPosWithinTile(s,e))for(;s;){var n=s.layerInfo[i];for(t=0;r>t;t++)n[t].data&&(Q[t]=n[t].data.samplerData);if(!s.children[0])break;var l=0;e[0]>s.children[0].extent[2]&&(l+=1),e[1]<s.children[0].extent[1]&&(l+=2),s=s.children[l]}}var o=T.elevationSampler(e[0],e[1],Q);for(t=0;r>t;t++)Q[t]=void 0;return o},getElevationBounds:function(){return this._elevationBounds},getScale:function(e){if(this.tilingScheme){if(!l.pointToVector(e,N,this.spatialReference))return console.error("TerrainSurface.getElevation(): could not project given point to tiling scheme coordinate system"),null;if(this._rootTiles)for(var t=0;t<this._rootTiles.length;t++){var i=this._rootTiles[t];if(v.isPosWithinTile(i,N)){for(;i.children[0];){var r=0;N[0]>i.children[0].extent[2]&&(r+=1),N[1]<i.children[0].extent[1]&&(r+=2),i=i.children[r]}return this._getLodBiasCorrectedScale(i.lij[0])}}}return 1e100},queryVisibleScaleRange:function(e,t,i,r){var a=t?this._tilingScheme.levelAtScale(t):0,s=i?this._tilingScheme.levelAtScale(i):1/0,n=this._getLodBias();this._renderer.queryVisibleLevelRange(e,a+n,s+n,r)},_setLoaded:function(){this.loaded||(this.loaded=!0,this.emit("load"))},_updateTilingSchemeAndExtent:function(){var e=this.tilingSchemeLogic.extent,t=this.tilingSchemeLogic.tilingScheme,i=!1;e&&!C.equals(e,this._dataExtent)&&(i=!0,this._dataExtent?C.set(this._dataExtent,e):this._dataExtent=C.create(e)),t!=this._tilingScheme&&(V(t,"tiling scheme cannot be reset to undefined"),i=!0,this._tilingScheme&&this._removeAllTiles(),this._tilingScheme=t,this.notifyChange("tilingScheme"),this._updateClippingExtent(),t&&(this._updateTiledLayers(),this._renderer.setTileSize(t.pixelSize[0]),this.overlayManager.setSpatialReference(t.spatialReference,"spherical"===this.manifold))),this.tilingSchemeLocked!==this.tilingSchemeLogic.tilingSchemeLocked&&this.notifyChange("tilingSchemeLocked"),i&&this._updateRootTiles()},_acquireTile:function(e,t,i,r){var a=this.TileClass.Pool.acquire();return H[0]=e,H[1]=t,H[2]=i,a.init(H,r,this,this._tilingScheme),a},_releaseTile:function(e){e.dispose(),e.parent=null,e.parentSurface=null,this.TileClass.Pool.release(e)},_updateRootTiles:function(){var e=this._clippingExtent||this._dataExtent,t=this._tilingScheme;if(e&&t){var r=N,a=t.rootTilesInExtent(e,r,1/0);if(this._rootTiles){if(a.length>D)return void console.warn("Could not extend surface to encompass all layers because it would have resulted in too many root tiles.");var s=this._rootTiles.map(function(e){return e.lij}),n=i.difference(s,a,I);if(n.removed.length>0||n.added.length>0){var l=this._rootTiles.filter(function(e){var t=i.findIndex(n.removed,I.bind(null,e.lij));return t>-1?(this._purgeChildTiles(e),this._purgeTile(e),!1):!0}.bind(this));n.added.forEach(function(e){var t=this._acquireTile(0,e[1],e[2],null);l.push(t),this._loadTile(t)}.bind(this)),this._rootTiles=l,this._renderer.setRootTiles(this._rootTiles)}}else a.length>D&&(console.warn("Maximum number of root tiles exceeded, only a part of the map will be visible."),a=t.rootTilesInExtent(e,r,D)),this._rootTiles=a.map(function(e){var t=this._acquireTile(0,e[1],e[2],null);return this._loadTile(t),t}.bind(this)),this._renderer.setRootTiles(this._rootTiles);i.equals(r,this._rootExtent)||(this._rootExtent=U.create(r),this._hasFixedExtent()||this.notifyChange("extent")),this.setVisibility(!0),this._viewChangeUpdate(),this.notifyChange("ready")}},_viewChangeUpdate:function(){this._stage&&!this.suspended&&this._tilingScheme&&this.visible&&(this._updateViewDependentParameters(),this._updateOverlayOpacity(this._curEyePos),this._updateTiles(this._rootTiles),this.overlayManager&&this.overlayManager.setOverlayDirty())},_updateTiles:function(e){var t=this._iteratorPool.acquire();t.reset(e);for(var i=this._curSplitLimits,r=this._curFrustumPlanes,a=this._curEyePos,s=1/0,n=-1/0;!t.done;){var l=t.next();l.updateClippingStatus(this._clippingExtent);var o=l.updateVisibility(r,a),h=!0;if(o){l.updateScreenDepth(this._viewProjectionMatrix),l.renderData&&(s=Math.min(l.elevationBounds[0],s),n=Math.max(l.elevationBounds[1],n));var d=l.shouldSplit(i,a);d===q.SPLIT?(l.pendingUpdates&=~q.MERGE,l.renderData?(h=!1,l.pendingUpdates|=q.SPLIT,t.skip()):h=!1):(l.pendingUpdates&=~q.SPLIT,d===q.VSPLITMERGE&&l.updateAgents(f.LayerClass.ELEVATION),t.skip())}else t.skip();if(h&&!l.renderData){l.pendingUpdates|=q.MERGE,l.pendingUpdates&=~q.SPLIT;var u=this._iteratorPool.acquire();for(u.reset(l);!u.done;){var c=u.next();c.updateVisibility(r,a),c.visible&&c.updateScreenDepth(this._viewProjectionMatrix)}this._iteratorPool.release(u)}0!==l.pendingUpdates&&(this._pendingUpdates=!0)}this._iteratorPool.release(t),isFinite(s)&&isFinite(n)&&(this._elevationBounds[0]=s,this._elevationBounds[1]=n)},_viewParamSelector:{projectionMatrix:!0,fovX:!0,viewport:!0},_updateViewDependentParameters:function(){var e=this._view.navigation.currentCamera,t=Math.tan(.5*e.fovX),i=Math.tan(.5*e.fovY),r=this.tilingScheme.pixelSize,a=Math.pow(2,-this._getLodBias());this._curSplitLimits[0]=t,this._curSplitLimits[1]=r[0]/e.width*this.maxTextureScale*a,this._curSplitLimits[2]=i,this._curSplitLimits[3]=r[1]/e.height*this.maxTextureScale*a,this._curSplitLimits[4]=this.tilingScheme.getMaxLod(),e.copyFrustumPlanes(this._curFrustumPlanes),B.multiply(e.projectionMatrix,e.viewMatrix,this._viewProjectionMatrix),R.set(e.eye,this._curEyePos),_.autoUpdateSkirtsVisibility(this,this._curEyePos)},_setLayerViewsUpdating:function(){for(var e=0;e<f.LayerClass.LAYER_CLASS_COUNT;e++)for(var t=this._layerViews[e],i=0;i<t.length;i++){var r=t[i];r.suspended||(r.updating=this._pendingUpdates,r.updatingPercentage=this._pendingUpdates?100:0)}},_frameUpdateTraversal:function(e){if(!this.suspended){this._frameUpdateLowerPrio.clear();var t=this._renderer.numTileTexturesComposited,i=this._iteratorPool.acquire();i.reset(this._rootTiles);for(var r=!1,a=!1;!i.done&&(e.remaining()>1||!r)&&this._renderer.numTileTexturesComposited-t<O;){var s=i.next();s.pendingUpdates&q.MERGE?(this._mergeTile(s),s.pendingUpdates&=~q.MERGE,r=!0,i.skip()):s.pendingUpdates&q.SPLIT?(this._splitTile(s),s.pendingUpdates&=~q.SPLIT,r=!0,i.skip()):s.pendingUpdates>0&&this._frameUpdateLowerPrio.push(s),0!==s.pendingUpdates&&(a=!0)}return this._pendingUpdates=a||!i.done,this._iteratorPool.release(i),r}},_updateTileGeometry:function(e){this._renderer._updateTileGeometry(e),j.spatialReference=this.spatialReference,j.tile=e,a.emit(this,"elevation-change-tile",j)},_updateTileTexture:function(e){this._renderer.updateTileTexture(e)},_frameUpdate:function(e){if(this._rootTiles){for(var t=this._frameUpdateTraversal(e);(e.remaining()>1||!t)&&this._frameUpdateLowerPrio.length>0;){var i=this._frameUpdateLowerPrio.pop();i.pendingUpdates&q.DECODE_LERC?(this._decodeLERC(i),i.pendingUpdates&=~q.DECODE_LERC,t=!0):i.pendingUpdates&q.UPDATE_GEOMETRY?(this._renderer.updateTileGeometryNeedsUpdate(i),this._updateTileGeometry(i),t=!0,i.pendingUpdates&=~q.UPDATE_GEOMETRY):i.pendingUpdates&q.UPDATE_TEXTURE&&(this._updateTileTexture(i),i.pendingUpdates&=~q.UPDATE_TEXTURE,t=!0),0!==i.pendingUpdates&&(this._pendingUpdates=!0)}this._frameUpdateLowerPrio.length>0&&(this._pendingUpdates=!0),this._streamDataSupplier._loader.hasPendingDownloads()&&(this._pendingUpdates=!0),this._pendingUpdates!==this._lvPendingUpdates&&(this._pendingUpdates||20===++this._updateNextFrame)&&(this._setLayerViewsUpdating(),this._lvPendingUpdates=this._pendingUpdates,this._updateNextFrame=0)}},_needsIdleUpdate:function(){return this.isVisible()&&this.overlayManager&&this.overlayManager.overlaysNeedUpdate()},_idleUpdate:function(){this.overlayManager.updateOverlay(),this._updateOverlayOpacity(this._curEyePos)},_updateClippingExtent:function(){if(!this.spatialReference)return!1;var e=[],t=null;return l.extentToBoundingRect(this._view.clippingArea,e,this.spatialReference)&&(t=e),i.equals(t,this._clippingExtent)?!1:(this._clippingExtent=t,this.notifyChange("extent"),!0)},_clippingChanged:function(){this._updateClippingExtent()&&this._updateRootTiles()},_getLodBias:function(){return Math.round(this._view.qualitySettings.tiledSurface.lodBias)},_getLodBiasCorrectedScale:function(e){var t=this.tilingScheme.levels,i=P.clamp(e-this._getLodBias(),0,t.length-1);return t[i].scale},_cancelTilemapRequests:function(e){for(var t=0;t<f.LayerClass.LAYER_CLASS_COUNT;t++){var i=e.layerInfo[t];if(i)for(var r=0;r<i.length;r++){var a=i[r];a.tilemapRequest&&(a.tilemapRequest.cancel(),a.tilemapRequest=null)}}},_removeAllTiles:function(){this._rootTiles&&(this._rootTiles.forEach(function(e){this._purgeChildTiles(e),this._purgeTile(e)}.bind(this)),this._rootTiles=null,this.notifyChange("ready"));for(var e=0;e<this._topLevelTilemapOnlyTiles.length;e++){var t=this._topLevelTilemapOnlyTiles[e];this._cancelTilemapRequests(t)}this.setVisibility(!1)},_purgeChildTiles:function(e){var t=this._postorderIterator;for(t.reset(e);!t.done;){for(var i=t.next(),r=0;4>r;r++)i.children[r]=null;i!==e&&this._purgeTile(i)}},_purgeTile:function(e){e.unload(this._renderer),this._cancelTilemapRequests(e),e.parent=null,this._renderer.releaseTileTextures(e),this._releaseTile(e)},_splitTile:function(e){var t=e.lij[0]+1,i=2*e.lij[1],r=2*e.lij[2];e.children[0]=this._createTile(t,i,r,e),e.children[1]=this._createTile(t,i,r+1,e),e.children[2]=this._createTile(t,i+1,r,e),e.children[3]=this._createTile(t,i+1,r+1,e),e.unload(this._renderer),F.spatialReference=this.spatialReference,F.extent=e.extent,F.scale=this._getLodBiasCorrectedScale(t),a.emit(this,"scale-change",F)},_createTile:function(e,t,i,r){V(r,"_createTile sanity check");var a=this._acquireTile(e,t,i,r);if(a.updateClippingStatus(this._clippingExtent),a.updateVisibility(this._curFrustumPlanes,this._curEyePos),a.visible){a.updateScreenDepth(this._viewProjectionMatrix);var s=a.shouldSplit(this._curSplitLimits,this._curEyePos);s===q.SPLIT&&(a.pendingUpdates|=q.SPLIT,this._pendingUpdates=!0)}return this._loadTile(a),a},_mergeTile:function(e){V(!e.renderData,"_mergeTile sanity check"),this._loadTile(e),this._purgeChildTiles(e),F.spatialReference=this.spatialReference,F.extent=e.extent,F.scale=this._getLodBiasCorrectedScale(e.lij[0]),a.emit(this,"scale-change",F)},_loadTile:function(e){e.load(this._renderer),this.overlayManager&&this.overlayManager.hasOverlays()&&this.overlayManager.setOverlayParamsOfTile(e,e.renderData,this._curOverlayOpacity)},_decodeLERC:function(e){var t=f.LayerClass.ELEVATION,i=e.layerInfo[t];if(i)for(var r=0;r<i.length;r++){var s=i[r];if(s.pendingUpdates&=~q.DECODE_LERC,s.rawData){var n=e.createElevationDataFromLERC(s.rawData);if(s.rawData=null,n){s.data=n;var l=[n.bounds[0],n.bounds[1],e.lij[0]],o=this._iteratorPool.acquire();for(o.reset(e);!o.done;)o.next().setLayerElevationBounds(r,l);this._iteratorPool.release(o),e.dataArrived(r,t,n),this._updateTiles(e),k.spatialReference=this.spatialReference,k.extent=e.extent,a.emit(this,"elevation-change",k)}}}},_handleLayerViewChanges:function(e){var t=!1;e.added.forEach(function(e){var i=e.layer;_.isTiledLayerView(e)?(this._registerTiledLayer(i,e),i.get("loaded")&&(t=!0)):e.supportsDraping&&this.overlayManager&&this.overlayManager.registerLayerView(e)}.bind(this)),e.removed.forEach(function(e){_.isTiledLayerView(e)?(t=!0,this._unregisterTiledLayerView(e.id)):e.supportsDraping&&this.overlayManager&&this.overlayManager.unregisterLayerView(e)}.bind(this)),t=t||e.moved.filter(_.isTiledLayerView).length>0,t&&this._updateTiledLayers()},_registerTiledLayer:function(e,t){var i=[];i.push(t.watch("suspended",function(){this._updateTiledLayers()}.bind(this))),i.push(t.layer.watch("opacity",this._updateTileTextures.bind(this))),this._basemapLayerViewHandles[t.id]=i},_unregisterTiledLayerView:function(e){var t=this._basemapLayerViewHandles[e];if(t){for(var i=0;i<t.length;i++)t[i].remove();delete this._basemapLayerViewHandles[e]}},_updateTiledLayers:function(){if(this._tilingScheme){var e=this._view.allLayerViews,t=[[],[]],i=f.LayerClass,r=null,s=C.create(C.NEGATIVE_INFINITY),n=function(e){var a=e.layer;if(a&&e&&!e.suspended&&_.isTiledLayerView(e)){var n=a.fullExtent;if(n){if(!this._tilingScheme.compatibleWith(a.tileInfo))return void console.warn("Terrain: tiling scheme of layer "+a.id+" is incompatible with other tiled layers, will not be drawn");C.expand(s,n),_.isElevationLayerView(e)?t[i.ELEVATION].push(e):(1/0!==e.maxDataLevel&&(null===r||e.maxDataLevel>r)&&(r=e.maxDataLevel),t[i.MAP].push(e))}else console.warn("Terrain: Map or elevation layer does not have fullExtent: "+a.id)}}.bind(this);e.forEach(n,this);for(var l=0;l<i.LAYER_CLASS_COUNT;l++){var o=this._layerViews[l],h=t[l];h.reverse();var d=o.length!==h.length,u=h.length,c=new Array(u),A=new Array(o.length);this._layerIndexByLayerViewId[l]={};for(var p=0;u>p;p++){var g=h[p].id;this._layerIndexByLayerViewId[l][g]=p;var v=o.indexOf(h[p]);c[p]=v,p!==v&&(d=!0),v>-1&&(A[v]=p)}if(d){if(this._layerViews[l]=h,this._topLevelTilemapOnlyTiles.forEach(function(e){e.modifyLayers(A,c,l)}),this._rootTiles){var T=this._postorderIterator;for(T.reset(this._rootTiles);!T.done;)T.next().modifyLayers(A,c,l);for(T.reset(this._rootTiles);!T.done;){var y=T.next();y.restartAgents(l),l===i.ELEVATION&&y.updateElevationBounds()}this._updateTiles(this._rootTiles)}l===i.ELEVATION&&this.tilingScheme&&(k.spatialReference=this.tilingScheme.spatialReference,k.extent=G,a.emit(this,"elevation-change",k))}}this.tilingScheme.levels.length-1<r&&(this.tilingScheme.ensureMaxLod(r),this._viewChangeUpdate())}},_getLayerExtentUnion:function(e){var t=this._view.allLayerViews,i=C.create(C.NEGATIVE_INFINITY);return t.forEach(function(t){var r=t.layer,a=t.fullExtentInViewSpatialReference||r.fullExtent;a&&!a.spatialReference.equals(e)&&(a=d.canProject(a.spatialReference,e)?d.project(a,e):null),a&&C.expand(i,a)}),C.allFinite(i)?i:null},layerViewByIndex:function(e,t){return this._layerViews[t][e]},agentTypeByLayerIndex:function(e,t){return t===f.LayerClass.ELEVATION?L:w},numLayers:function(e){return this._layerViews[e].length},numTotalLayers:function(){return this._layerViews.reduce(function(e,t){return t.length+e},0)},_updateTileTextures:function(){var e=this._iteratorPool.acquire();for(e.reset(this._rootTiles);!e.done;)e.next().updateTexture();this._iteratorPool.release(e)},requestTileData:function(e,t,i){this.tilemapStats.tilesRequested++;var r=this.layerViewByIndex(t,i);if(r.layer.tileMap){var a=this.getTilemapTile(e),s=a.layerInfo[i][t];if(!s.tilemapData){var n=new h.Promise;return n.actualTileRequestPromise=null,s.tilemapRequest||(s.tilemapRequest=this.requestTilemapData(a,t,i,r)),s.tilemapRequest.then(function(){if(s.tilemapRequest=null,!n.isCancelled()){var t=this._layerIndexByLayerViewId[i][r.id];null!=t&&(a.tileDataAvailable(e,t,i)?(n.actualTileRequestPromise=this._requestTileData(e,t,i,r),n.actualTileRequestPromise.then(function(){n.resolve()})):(this.tilemapStats.tilesNotPresent++,this._dispatchDataEvent(e,"dataMissing",i,r,{notInTilemap:!0}),n.reject()))}}.bind(this)),n}if(!a.tileDataAvailable(e,t,i)){this.tilemapStats.tilesNotPresent++,this._dispatchDataEvent(e,"dataMissing",i,r,{notInTilemap:!0});var l=new h.Promise;return l.reject(),l}}return this._requestTileData(e,t,i,r)},_requestTileData:function(e,t,i,r){this.tilemapStats.tileRequestsSent++;var a,s=r.getTileUrl(e.lij[0],e.lij[1],e.lij[2]),n=this;return i===f.LayerClass.ELEVATION?(a=this._streamDataSupplier.request(s,"binary"),a.then(function(t,a){var s=n._layerIndexByLayerViewId[i][r.id];if(null!=s){var l=e.layerInfo[i][s];a.url=t,l.rawData=a,e.pendingUpdates|=q.DECODE_LERC,l.pendingUpdates|=q.DECODE_LERC,n._pendingUpdates=!0}else console.warn("TerrainSurface: received data from unknown layer %d %s",i,e.lij.toString())},function(t){n.tilemapStats.tileRequestErrors++,n._dispatchDataEvent(e,"dataMissing",i,r,t)})):(a=this._streamDataSupplier.request(s,"image"),a.then(function(t,a){n._dispatchDataEvent(e,"dataArrived",i,r,a)},function(t){n.tilemapStats.tileRequestErrors++,n._dispatchDataEvent(e,"dataMissing",i,r,t)})),a},requestTilemapData:function(e,t,i,r){var a,s=new h.Promise(function(){a.cancel()}),n=e.lij[0]+f.TILEMAP_SIZE_EXP,l=e.lij[1]<<f.TILEMAP_SIZE_EXP,o=e.lij[2]<<f.TILEMAP_SIZE_EXP;this.tilemapStats.tilemapRequestsSent++,this.tilemapStats.tilemapRequestsPending++;var d=this,u=1<<Math.min(f.TILEMAP_SIZE_EXP,n);a=r.layer.tileMap.getTileMap(n,l,o,u,u),a.then(function(a){d.tilemapStats.tilemapRequestsPending--;var h=a.location;a.valid===!0&&h&&h.top===l&&h.left===o&&h.width===u&&h.height===u?(t=this._layerIndexByLayerViewId[i][r.id],null!=t&&(e.layerInfo[i][t].tilemapData=a),s.resolve()):(console.warn("Unexpected tilemap response for %s/%d/%d/%d/%d/%d",r.id,n,l,o,u,u),c())}.bind(this),function(){c()});var c=function(){d.tilemapStats.tilemapRequestErrors++,s.resolve()};return s},getTilemapTile:function(e){var t=e.lij[0];return t>f.TILEMAP_SIZE_EXP?v.getTileNLevelsUp(e,f.TILEMAP_SIZE_EXP):this._topLevelTilemapOnlyTiles[t]},_dispatchDataEvent:function(e,t,i,r,a){var s=this._layerIndexByLayerViewId[i][r.id];null!=s?e[t](s,i,a):console.warn("TerrainSurface: received data from unknown layer")},cancelRequest:function(e){var t=e.actualTileRequestPromise;void 0!==t?(null!==t&&this._streamDataSupplier.cancelRequest(t),e.cancel()):this._streamDataSupplier.cancelRequest(e)},_updateTileOverlayParams:function(){if(this._rootTiles){var e=this._iteratorPool.acquire();for(e.reset(this._rootTiles);!e.done;){var t=e.next();t.renderData&&this.overlayManager&&this.overlayManager.setOverlayParamsOfTile(t,t.renderData,this._curOverlayOpacity)}this._iteratorPool.release(e),this._renderer.setNeedsRender()}},_updateOverlayOpacity:function(e){if(this.overlayManager){var t=this.overlayManager.updateOpacity(e);if(!isNaN(t)){if(t!==this._curOverlayOpacity&&this._rootTiles){var i=this._iteratorPool.acquire();for(i.reset(this._rootTiles);!i.done;){var r=i.next();r.renderData&&r.renderData.overlayTexId&&(r.renderData.overlayOpacity=t)}this._iteratorPool.release(i)}this._curOverlayOpacity=t,this._renderer.setNeedsRender()}}},getStats:function(){var e=0,t=0,i=0,r=this._iteratorPool.acquire();for(r.reset(this._rootTiles);!r.done;){var a=r.next();e++,a.renderData&&(t++,a.visible&&i++)}return this._iteratorPool.release(r),{numNodes:e,numLeaves:t,numVisible:i}},getTile:function(e){var t=e.split("/").map(JSON.parse);if(0===t[0])return this._rootTiles.forEach(function(e){return e.lij[1]===t[1]&&e.lij[2]===t[2]?e:void 0}),null;var i,r=t[1]>>t[0],a=t[2]>>t[0];if(this._rootTiles.some(function(e){return e.lij[1]===r&&e.lij[2]===a?(i=e,!0):!1}),i){for(var s=1<<t[0]-1;i.lij[0]<t[0];){var n=t[1]&s?2:0;if((t[2]&s)>0&&n++,!i.children[n])return console.log("Tile "+e+" doesn't exist, smallest ancestor is "+v.tile2str(i)),null;i=i.children[n],s>>=1}return V(i.lij[0]===t[0]&&i.lij[1]===t[1]&&i.lij[2]===t[2],"not the right tile?"),i}return null},setBorders:function(e){this._renderer.setBorders(e)},setDisableRendering:function(e){this._renderer.setDisableRendering(e)},_extentGetter:function(){return this._clippingExtent||this._rootExtent},_hasFixedExtent:function(){return!!this._clippingExtent},_wireframeSetter:function(e){return this._renderer.setWireframe(e),e},_opacitySetter:function(e){return this._renderer.setOpacity(e),e},_skirtsSetter:function(e){return this._renderer.setDrawSkirts(!!e),e},_cullBackFacesSetter:function(e){return this._renderer.setCullBackFaces(e),e},_renderOrderSetter:function(e){return this._renderer.setRenderOrder(e),e},_frontMostTransparentSetter:function(e){return this._renderer.setFrontMostTransparent(!!e),e},_tileBackgroundSetter:function(e){return e!==this.tileBackground&&this._renderer.updateTileBackground(e),e}});return X.checkUnsupported=function(e,t){var i=g.checkUnsupported(e);return i?i:t?X._checkNumRootTiles(e,t):null},X._checkNumRootTiles=function(e,t){var i=e.lods,r=i[0].resolution*Math.pow(2,i[0].level),a=[r*e.rows,r*e.cols],s=[e.origin.x,e.origin.y];if(t=[t.xmin,t.ymin,t.xmax,t.ymax],g.computeRowColExtent(t,a,s,N),(N[2]-N[0])*(N[3]-N[1])>D){var n=i[0].scale*Math.pow(2,i[0].level),l=Math.max((t[3]-t[1])/e.rows,(t[2]-t[0])/e.cols),o=l*n/r,h=Math.floor(Math.log(o)/Math.log(10));o=Math.ceil(o/Math.pow(10,h))*Math.pow(10,h);var d=new Error("Scale of level 0 of the tiling scheme (1:"+Math.floor(n).toLocaleString()+") is too large for the layer's extent. Suggested scale: 1:"+o.toLocaleString()+".");return d.name="terrainsurface:num-root-tiles",d}return null},X.MAX_ROOT_TILES=D,X
});