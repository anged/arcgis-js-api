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
// See http://js.arcgis.com/4.2/esri/copyright.txt for details.

define(["dojo/_base/lang","dojo/promise/all","../../support/GraphicsManager","../../../core/Accessor","../../../core/Promise","../../../core/Evented","../../../core/HandleRegistry","../../../geometry/support/scaleUtils"],function(e,t,i,a,s,r,n,h){var u=a.createSubclass([s,r],{declaredClass:"esri.layers.graphics.controllers.SnapshotController",constructor:function(){this._handles=new n,this._pendingQueries=new Map},initialize:function(){this.addResolvingPromise(t([this.layer,this.layerView])),this.then(this._init.bind(this))},destroy:function(){this.cancelQuery(),this._gManager&&(this._gManager.destroy(),this._gManager=null),this._handles.destroy(),this._handles=null,this._pendingQueries=null},_cancelErrorMsg:"SnapshotController: query cancelled",_featureResolution:{value:1,scale:3780},_gManager:null,_handles:null,_maxFeatures:{point:16e3,multipoint:8e3,polyline:4e3,polygon:4e3,multipatch:4e3},_source:null,_started:!1,properties:{_pendingQueries:null,updating:{value:!1,dependsOn:["_pendingQueries"],get:function(){return!!(this._pendingQueries&&this._pendingQueries.size>0)}},graphics:{value:null,set:function(e){var t=this._get("graphics");t!==e&&(this._handles.remove("graphics"),e&&(this._collectionChanged({added:e.toArray()}),this._handles.add(e.on("change",this._collectionChanged.bind(this)),"graphics")),this._set("graphics",e))}},extent:{},hasAllFeatures:!1,hasFeatures:!1,layer:null,layerView:null,maxPageSize:null,pageSize:null,paginationEnabled:!1},update:function(e){this.startup()},startup:function(){this._started||(this._started=!0,this._resolutionParams=this._getResolutionParams(),this._queryFeatures())},refresh:function(){this.isResolved()&&this._started&&this._queryFeatures()},cancelQuery:function(){this._pendingQueries&&(this._pendingQueries.forEach(function(e,t){e.isFulfilled()||e.cancel(new Error(this._cancelErrorMsg))}.bind(this)),this._pendingQueries.clear(),this.notifyChange("updating"))},_init:function(){var e=this.layer,t=e.advancedQueryCapabilities;this.paginationEnabled=!(!t||!t.supportsPagination),this._source=e.source,this.pageSize=null==this.maxPageSize?e.maxRecordCount:Math.min(e.maxRecordCount,this.maxPageSize),this._gManager=new i({graphics:this.graphics,objectIdField:e.objectIdField}),this._setupStateWatchers()},_getResolutionParams:function(){var e,t=this.layer,i=t.supportsCoordinatesQuantization;if("polyline"===t.geometryType||"polygon"===t.geometryType){var a=h.getUnitValue(this.layerView.view.spatialReference);if(null==a);else{var s=this._featureResolution.scale,r=this._featureResolution.value/a;s=t.maxScale?t.maxScale:t.minScale?Math.min(s,t.minScale):Math.min(s,h.getScale(this.layerView.view,t.fullExtent)),e=r/this._featureResolution.scale*s}}return e?{maxAllowableOffset:i?null:e,quantizationParameters:i?{mode:"view",originPosition:"upperLeft",tolerance:e,extent:t.fullExtent}:null}:null},_setupStateWatchers:function(){this._handles.add([this.watch("extent",this.refresh.bind(this)),this.layer.watch("definitionExpression",this.refresh.bind(this)),this.layer.on("edits",this._editsHandler.bind(this))])},_createQueryParams:function(){var t=this.layer,i=this.layerView,a=t.createQuery();return a.outSpatialReference=i.view.spatialReference,a.geometry=this.extent,e.mixin(a,this._resolutionParams),this.paginationEnabled&&(a.start=0,a.num=this.pageSize),a},_queryFeatures:function(){this.cancelQuery(),this.hasAllFeatures=this.hasFeatures=!1,this._gManager.beginPagedUpdate(),this.emit("query-start"),this._executeQuery(this._createQueryParams())},_executeQuery:function(e){var t=this._source.queryFeatures(e),i=this._gManager.createIntentToAdd();this._querySetup(i,t),t.then(this._processFeatureSet.bind(this,e,i)).otherwise(this._queryError.bind(this,i)).always(this._queryTeardown.bind(this,i))},_processFeatureSet:function(e,t,i){var a=i.exceededTransferLimit,s=i.features,r=this.layer.geometryType.toLowerCase().replace(/^esriGeometry/i,""),n=this._maxFeatures[r]||0,h=s?s.length:0,u=this._gManager.graphics.length+h,l=u>=n;if(l){var o=u-n;o&&s.splice(h-o,o)}var c=a&&this.paginationEnabled&&!l?this._queryNextPage(e):!1;return s&&this._gManager.addPage(s,t),this.hasFeatures=!0,c||(this._gManager.endPagedUpdate(),this.hasAllFeatures=!a,this.emit("query-end",{success:!0})),i},_queryNextPage:function(e){return e.start+=this.pageSize,this._executeQuery(e),!0},_queryError:function(e,t){t&&"cancel"===t.dojoType&&!this.hasFeatures?this._gManager.revertPagedUpdate():this._gManager.endPagedUpdate(),this.emit("query-end",{success:!1})},_querySetup:function(e,t){this._pendingQueries.set(e,t),this.notifyChange("updating")},_queryTeardown:function(e){this._gManager.removeIntent(e),this._pendingQueries["delete"](e),this.notifyChange("updating")},_collectionChanged:function(e){var t,i,a;if(a=e.added)for(t=0;i=a[t];t++)i.layer=this.layer;if(a=e.removed)for(t=0;i=a[t];t++)i.layer=null},_editsHandler:function(e){var t=function(e){return e.objectId},i=e.deletedFeatures.map(t);this._gManager["delete"](i);var a=e.addedFeatures.concat(e.updatedFeatures).map(t);if(a.length){var s=this._createQueryParams();s.objectIds=a;var r=this._source.queryFeatures(s),n=this._gManager.createIntentToAdd(a);this._querySetup(n,r),r.then(this._processRefetch.bind(this,n)).otherwise(this._refetchError.bind(this,n)).always(this._queryTeardown.bind(this,n))}},_processRefetch:function(e,t){var i=t.features;i&&this._gManager.add(i,e)},_refetchError:function(e,t){}});return u});