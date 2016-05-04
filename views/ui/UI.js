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

define(["../../core/Accessoire","../../core/HandleRegistry","../../core/watchUtils","./Component","dojo/_base/lang","dojo/dom-class","dojo/dom-construct","dojo/dom-style"],function(t,n,i,e,o,r,a,s){var c={left:0,top:0,bottom:0,right:0},d={bottom:30,top:15,right:15,left:15},h="manual",u={ui:"esri-ui",corner:"esri-ui-corner",innerContainer:"esri-ui-inner-container",manualContainer:"esri-ui-manual-container",cornerContainer:"esri-ui-corner-container",topLeft:"esri-ui-top-left",topRight:"esri-ui-top-right",bottomLeft:"esri-ui-bottom-left",bottomRight:"esri-ui-bottom-right"};return t.createSubclass({classMetadata:{properties:{height:{readOnly:!0,dependsOn:["view.height"]},width:{readOnly:!0,dependsOn:["view.width"]}}},declaredClass:"esri.views.ui.UI",constructor:function(){this._components=[],this._handles=new n,this._initContainers()},getDefaults:function(){return o.mixin(this.inherited(arguments),{padding:d})},initialize:function(){this._handles.add(i.init(this,"view.padding, container",this._applyViewPadding.bind(this)),i.init(this,"padding",this._applyUIPadding.bind(this)))},destroy:function(){this.container=null,this._components.forEach(function(t){t.destroy()}),this._components.length=0,this._handles.destroy()},_cornerNameToContainerLookup:null,_positionNameToContainerLookup:null,_components:null,_handles:null,container:null,_containerSetter:function(t,n){return t===n?t:(t&&(r.add(t,u.ui),this._attachContainers(t)),n&&(r.remove(n,u.ui),s.set(n,{top:"",bottom:"",left:"",right:""}),a.empty(n)),t)},_heightGetter:function(){var t=this.get("view.height")||0;if(0===t)return t;var n=this._getViewPadding(),i=n.top+n.bottom;return Math.max(t-i,0)},_paddingSetter:function(t){return"number"==typeof t?{bottom:t,top:t,right:t,left:t}:o.mixin({},d,t)},view:null,_widthGetter:function(){var t=this.get("view.width")||0;if(0===t)return t;var n=this._getViewPadding(),i=n.left+n.right;return Math.max(t-i,0)},add:function(t,n){var i;return Array.isArray(t)?void t.forEach(function(t){this.add(t,n)},this):(n&&"object"==typeof n&&(i=n.index,n=n.position),void(!t||n&&!this._isValidPosition(n)||(t.isInstanceOf&&t.isInstanceOf(e)||(t=new e({node:t})),this._place({component:t,position:n,index:i}),this._components.push(t))))},remove:function(t){if(t){if(Array.isArray(t))return t.map(this.remove,this);var n=this.find(t);if(n){var i=this._components.indexOf(n);return n.node.parentNode&&n.node.parentNode.removeChild(n.node),this._components.splice(i,1)[0]}}},empty:function(t){return Array.isArray(t)?t.map(function(t){return this.empty(t).reduce(function(t,n){return t.concat(n)})},this):(t=t||h,t===h?Array.prototype.slice.call(this._manualContainer.children).filter(function(t){return!r.contains(t,u.corner)},this).map(this.remove,this):this._isValidPosition(t)?Array.prototype.slice.call(this._cornerNameToContainerLookup[t].children).map(this.remove,this):void 0)},move:function(t,n){if(!n||this._isValidPosition(n)){var i=this.remove(t);i&&this.add(i,n)}},find:function(t){return t?t.isInstanceOf&&t.isInstanceOf(e)?this._findByComponent(t):"string"==typeof t?this._findById(t):this._findByNode(t.domNode||t):null},_getViewPadding:function(){return this.get("view.padding")||c},_attachContainers:function(t){a.place(this._innerContainer,t),a.place(this._manualContainer,t)},_initContainers:function(){var t,n,i,e,r=a.create("div",{className:u.innerContainer+" "+u.cornerContainer}),s=a.create("div",{className:u.innerContainer+" "+u.manualContainer});t=a.create("div",{className:u.topLeft+" "+u.corner},r),n=a.create("div",{className:u.topRight+" "+u.corner},r),i=a.create("div",{className:u.bottomLeft+" "+u.corner},r),e=a.create("div",{className:u.bottomRight+" "+u.corner},r),this._innerContainer=r,this._manualContainer=s,this._cornerNameToContainerLookup={"top-left":t,"top-right":n,"bottom-left":i,"bottom-right":e},this._positionNameToContainerLookup=o.mixin({manual:s},this._cornerNameToContainerLookup)},_isValidPosition:function(t){return!!this._positionNameToContainerLookup[t]},_place:function(t){var n,i,e,o,r,a=t.component,s=t.position||h,c=t.index,d=this._positionNameToContainerLookup[s],u=c>-1,l="bottom-right"===s;return u?(e=d.children,(o=0===c)?(n=l?"last":"first",void this._placeComponent(a,d,n)):(r=c>=e.length)?(n=l?"first":"last",void this._placeComponent(a,d,n)):(n=l?"after":"before",c=l?e.length-1-c:c,i=e[c],void this._placeComponent(a,i,n))):(n=l?"first":"last",void this._placeComponent(a,d,n))},_placeComponent:function(t,n,i){return t.widget?(t.widget.placeAt(n,i),void t.widget.startup()):void a.place(t.node,n,i)},_applyViewPadding:function(){var t=this.container;t&&s.set(t,this._toPxPosition(this._getViewPadding()))},_applyUIPadding:function(){var t=this._innerContainer;t&&s.set(this._innerContainer,this._toPxPosition(this.padding))},_toPxPosition:function(t){return{top:this._toPxUnit(t.top),left:this._toPxUnit(t.left),right:this._toPxUnit(t.right),bottom:this._toPxUnit(t.bottom)}},_toPxUnit:function(t){return 0===t?0:t+"px"},_findByComponent:function(t){var n,i=null;return this._components.some(function(e){return n=e===t,n&&(i=e),n}),i},_findById:function(t){var n,i=null;return this._components.some(function(e){return n=e.id===t,n&&(i=e),n}),i},_findByNode:function(t){var n,i=null;return this._components.some(function(e){return n=e.node===t,n&&(i=e),n}),i}})});