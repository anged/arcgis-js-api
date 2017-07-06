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
// See http://js.arcgis.com/3.21/esri/copyright.txt for details.

define(["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/json","dojo/i18n","dojo/has","dojo/Deferred","dojo/sniff","dojo/promise/all","dojox/html/entities","./lang","./kernel","./request","./tasks/query","./tasks/QueryTask","./tasks/RelationshipQuery","./tasks/StatisticDefinition","./renderers/arcadeUtils","dojo/i18n!dojo/cldr/nls/number"],function(e,t,i,r,s,a,n,o,l,d,f,h,u,c,p,m,_,y,F){var g=e(null,{declaredClass:"esri.PopupInfo",_reExprField:/^\s*expression\//i,_exprPrefix:"expression/",_relatedFieldPrefix:"relationships/",initialize:function(e,r){if(e){t.mixin(this,r),this.info=e,this.title=this.getTitle,this.content=this.getContent,this._exprCache=this._compileExpressions(this.info.expressionInfos);var s=this._fieldLabels={},a=this._fieldsMap={};this.info.fieldInfos&&i.forEach(this.info.fieldInfos,function(e){var t=e.fieldName.toLowerCase(),i=this._isExpressionField(t)?this.getExpressionInfo(t):null;s[t]=i?i.title:e.label,a[t]=e},this),this.titleHasRelatedFields=!(!this.info.title||-1===this.info.title.indexOf("{"+this._relatedFieldPrefix))}},toJson:function(){return r.fromJson(r.toJson(this.info))},getTitle:function(){},getContent:function(){},getFieldInfo:function(e){var t,r=this.info&&this.info.fieldInfos;return i.some(r,function(i){return i.fieldName===e&&(t=i),!!t}),t},getExpressionInfo:function(e){if(this._isExpressionField(e)){e=e.replace(this._reExprField,""),e=e.toLowerCase();var t;return i.some(this.info.expressionInfos,function(i){return i.name.toLowerCase()===e&&(t=i),!!t}),t}},getComponents:function(e){var r,s,a=this.info,o=new n;return a.fieldInfos&&(s=i.filter(a.fieldInfos,function(e){return-1!==e.fieldName.indexOf(this._relatedFieldPrefix)},this)),s&&s.length>0&&(r=this._getRelatedRecords({graphic:e,fieldsInfo:s})),r?r.always(t.hitch(this,function(){o.resolve(this._getPopupValues(e))})):o.resolve(this._getPopupValues(e)),o.promise},getAttachments:function(e){var t=e.getSourceLayer(),i=e.attributes;if(this.info.showAttachments&&t&&t.hasAttachments&&t.objectIdField){var r=i&&i[t.objectIdField];if(r)return t.queryAttachmentInfos(r)}},_isExpressionField:function(e){return this._reExprField.test(e)},_compileExpressions:function(e){var t={};return i.forEach(e,function(e){t[e.name]={compiledFunc:y.createFunction(e.expression)}}),t},_fetchAttributes:function(e){var r=t.clone(e.attributes)||{},s=this._exprPrefix,a=this._exprCache;return i.forEach(this.info.expressionInfos,function(t){var i=s+t.name,n=a[t.name],o=y.executeFunction(n&&n.compiledFunc,y.createExecContext(e,e._getViewInfo()));"string"==typeof o&&(o=d.encode(o)),r[i]=o}),r},_getPopupValues:function(e,r){var s,a,n,o,l,d=this.info,h=e.getSourceLayer(),u=this._fetchAttributes(e),c=t.clone(u),p=d.fieldInfos,m="",_="",y=h&&h._getDateOpts&&h._getDateOpts().properties;y=y&&y.slice(0);var F={dateFormat:{properties:y,formatter:"DateFormat"+this._insertOffset(this._dateFormats.shortDateShortTime)}};if(this._relatedInfo)for(o in this._relatedInfo)if(this._relatedInfo.hasOwnProperty(o)){var g=this._relatedInfo[o],I=this._relatedLayersInfo[o];g&&(i.forEach(g.relatedFeatures,function(e){for(l in e.attributes)if(e.attributes.hasOwnProperty(l)&&"esriRelCardinalityOneToOne"===I.relation.cardinality){var t=this._toRelatedFieldName([I.relation.id,l]);u[t]=c[t]=e.attributes[l]}},this),i.forEach(g.relatedStatsFeatures,function(e){for(l in e.attributes)if(e.attributes.hasOwnProperty(l)){var t=this._toRelatedFieldName([I.relation.id,l]);u[t]=c[t]=e.attributes[l]}},this))}if(p&&i.forEach(p,function(e){a=e.fieldName;var t=this._getLayerFieldInfo(h,a);t&&(a=e.fieldName=t.name);var r=c[a];if(c[a]=this._formatValue(r,a,F),y&&e.format&&e.format.dateFormat){var s=i.indexOf(y,a);s>-1&&y.splice(s,1)}},this),h){var L=h.types,v=h.typeIdField,b=v&&u[v];for(a in u)if(u.hasOwnProperty(a)&&-1===a.indexOf(this._relatedFieldPrefix)&&(n=u[a],f.isDefined(n))){var x=this._getDomainName(h,e,L,b,a,n);if(f.isDefined(x))c[a]=x;else if(a===v){var P=this._getTypeName(h,e,n);f.isDefined(P)&&(c[a]=P)}}}if(d.title&&(m=this._processFieldsInLinks(this._fixTokens(d.title,h),u),m=t.trim(f.substitute(c,m,F)||"")),r)return{title:m};d.description&&(_=this._processFieldsInLinks(this._fixTokens(d.description,h),u),_=t.trim(f.substitute(c,_,F)||"")),p&&(s=[],i.forEach(p,function(e){a=e.fieldName,a&&e.visible&&s.push([this._fieldLabels[a.toLowerCase()]||a,f.substitute(c,"${"+a+"}",F)||""])},this));var R,T;return d.mediaInfos&&(R=[],i.forEach(d.mediaInfos,function(e){switch(T=0,n=e.value,e.type){case"image":var r=n.sourceURL;r=r&&t.trim(f.substitute(u,this._fixTokens(r,h))),T=!!r;break;case"piechart":case"linechart":case"columnchart":case"barchart":var s,a=n.normalizeField;n.fields=i.map(n.fields,function(e){return s=this._getLayerFieldInfo(h,e),s?s.name:e},this),a&&(s=this._getLayerFieldInfo(h,a),n.normalizeField=s?s.name:a),T=i.some(n.fields,function(e){return f.isDefined(u[e])||-1!==e.indexOf(this._relatedFieldPrefix)&&this._relatedInfo},this);break;default:return}if(T){e=t.clone(e),n=e.value;var o=e.title?this._processFieldsInLinks(this._fixTokens(e.title,h),u):"",l=e.caption?this._processFieldsInLinks(this._fixTokens(e.caption,h),u):"";if(e.title=o?t.trim(f.substitute(c,o,F)||""):"",e.caption=l?t.trim(f.substitute(c,l,F)||""):"","image"===e.type)n.sourceURL=f.substitute(u,this._fixTokens(n.sourceURL,h)),n.linkURL&&(n.linkURL=t.trim(f.substitute(u,this._fixTokens(n.linkURL,h))||""));else{var d,p;i.forEach(n.fields,function(e,t){if(-1!==e.indexOf(this._relatedFieldPrefix))p=this._getRelatedChartInfos(e,n,u,F),p instanceof Array?n.fields=p:n.fields[t]=p;else{var i=u[e];i=void 0===i?null:i,d=u[n.normalizeField]||0,i&&d&&(i/=d),n.fields[t]={y:i,tooltip:(this._fieldLabels[e.toLowerCase()]||e)+":<br/>"+this._formatValue(i,e,F,!!d)}}},this)}R.push(e)}},this)),{title:m,description:_,hasDescription:!!d.description,fields:s&&s.length?s:null,mediaInfos:R&&R.length?R:null,formatted:c,editSummary:h&&h.getEditSummary?h.getEditSummary(e):""}},_getRelatedChartInfos:function(e,t,r,s){var a,n,o,l,d,h,u,c;return a=[],c=this._fromRelatedFieldName(e),h=c[0],n=this._relatedInfo[h],u=this._relatedLayersInfo[h],n&&i.forEach(n.relatedFeatures,function(i){var n,o,h=i.attributes;for(o in h)if(h.hasOwnProperty(o)&&o===c[1]){if(n={},d=h[o],t.normalizeField&&(l=-1!==t.normalizeField.indexOf(this._relatedFieldPrefix)?h[this._fromRelatedFieldName(t.normalizeField)[1]]:r[t.normalizeField]),d&&l&&(d/=l),t.tooltipField)if(-1!==t.tooltipField.indexOf(this._relatedFieldPrefix)){var u=this._fromRelatedFieldName(t.tooltipField)[1],p=f.isDefined(h[u])?h[u]:u;n.tooltip=p+":<br/>"+this._formatValue(d,u,s,!!l)}else n.tooltip=(this._fieldLabels[e.toLowerCase()]||e)+":<br/>"+this._formatValue(d,t.tooltipField,s,!!l);else n.tooltip=d;n.y=d,a.push(n)}},this),o="esriRelCardinalityOneToMany"===u.relation.cardinality||"esriRelCardinalityManyToMany"===u.relation.cardinality?a:a[0]},_dateFormats:{shortDate:"(datePattern: 'M/d/y', selector: 'date')",shortDateLE:"(datePattern: 'd/M/y', selector: 'date')",longMonthDayYear:"(datePattern: 'MMMM d, y', selector: 'date')",dayShortMonthYear:"(datePattern: 'd MMM y', selector: 'date')",longDate:"(datePattern: 'EEEE, MMMM d, y', selector: 'date')",shortDateShortTime:"(datePattern: 'M/d/y', timePattern: 'h:mm a', selector: 'date and time')",shortDateLEShortTime:"(datePattern: 'd/M/y', timePattern: 'h:mm a', selector: 'date and time')",shortDateShortTime24:"(datePattern: 'M/d/y', timePattern: 'H:mm', selector: 'date and time')",shortDateLEShortTime24:"(datePattern: 'd/M/y', timePattern: 'H:mm', selector: 'date and time')",shortDateLongTime:"(datePattern: 'M/d/y', timePattern: 'h:mm:ss a', selector: 'date and time')",shortDateLELongTime:"(datePattern: 'd/M/y', timePattern: 'h:mm:ss a', selector: 'date and time')",shortDateLongTime24:"(datePattern: 'M/d/y', timePattern: 'H:mm:ss', selector: 'date and time')",shortDateLELongTime24:"(datePattern: 'd/M/y', timePattern: 'H:mm:ss', selector: 'date and time')",longMonthYear:"(datePattern: 'MMMM y', selector: 'date')",shortMonthYear:"(datePattern: 'MMM y', selector: 'date')",year:"(datePattern: 'y', selector: 'date')"},_reHref:/href\s*=\s*\"([^\"]+)\"/gi,_reHrefApos:/href\s*=\s*\'([^\']+)\'/gi,_fixTokens:function(e,t){var i=this;return e.replace(/(\{([^\{\r\n]+)\})/g,function(e,r,s){var a=i._getLayerFieldInfo(t,s);return"$"+(a?"{"+a.name+"}":r)})},_encodeAttributes:function(e){var i,r,s,a=t.clone(e)||{};for(i in a)r=a[i],r&&"string"==typeof r&&(s=encodeURIComponent(r).replace(/\'/g,"&apos;"),a[i]=s);return a},_processFieldsInLinks:function(e,t){var i=this._encodeAttributes(t),r=this;return e&&(e=e.replace(this._reHref,function(e,s){return r._addValuesToHref(e,s,t,i)}).replace(this._reHrefApos,function(e,s){return r._addValuesToHref(e,s,t,i)})),e},_addValuesToHref:function(e,i,r,s){return i=i&&t.trim(i),f.substitute((i?0!==i.indexOf("${"):1)?s:r,e)},_getLayerFieldInfo:function(e,t){return e&&e.getField?e.getField(t):null},_formatValue:function(e,r,s,a){var n=this._fieldsMap[r.toLowerCase()],o=n&&n.format,l=-1!==i.indexOf(s.dateFormat.properties,r),d=!("number"!=typeof e||l||o&&o.dateFormat);if(!f.isDefined(e)||!n||!f.isDefined(o))return d?this._forceLTR(e):e;var h="",u=[],c=o.hasOwnProperty("places")||o.hasOwnProperty("digitSeparator"),p=o.hasOwnProperty("digitSeparator")?o.digitSeparator:!0;if(c&&!l)h="NumberFormat",u.push("places: "+(f.isDefined(o.places)&&(!a||o.places>0)?Number(o.places):"Infinity")),u.length&&(h+="("+u.join(",")+")");else{if(!o.dateFormat)return d?this._forceLTR(e):e;h="DateFormat"+this._insertOffset(this._dateFormats[o.dateFormat]||this._dateFormats.shortDateShortTime)}var m=this._applyFormatting(e,h,s);return c&&e.constructor.toString().indexOf("Array")>-1&&(m="",i.forEach(e,t.hitch(this,function(e,t){t&&(m+=" "),m+=this._applyFormatting(e,h,s)}))),c&&!p&&F.group&&(m=m.replace(new RegExp("\\"+F.group,"g"),"")),l&&(m='<span class="esriDateValue">'+m+"</span>"),d?this._forceLTR(m):m},_applyFormatting:function(e,t,i){return f.substitute({myKey:e},"${myKey:"+t+"}",i)||""},_forceLTR:function(e){var t=o("ie");return t&&10>=t?e:"<span class='esriNumericValue'>"+e+"</span>"},_insertOffset:function(e){return e&&(e=f.isDefined(this.utcOffset)?e.replace(/\)\s*$/,", utcOffset:"+this.utcOffset+")"):e),e},_getDomainName:function(e,t,i,r,s,a){var n=e.getDomain&&e.getDomain(s,{feature:t});return n&&n.codedValues?n.getName(a):null},_getTypeName:function(e,t,i){var r=e.getType&&e.getType(t);return r&&r.name},_getRelatedRecords:function(e){var i,r=e.graphic,s=new n;return this._relatedLayersInfo?this._queryRelatedLayers(r).then(t.hitch(this,function(e){this._setRelatedRecords(r,e),s.resolve(e)}),t.hitch(this,this._handlerErrorResponse,s)):this._getRelatedLayersInfo(e).then(t.hitch(this,function(e){for(i in e)e.hasOwnProperty(i)&&e[i]&&(this._relatedLayersInfo[i].relatedLayerInfo=e[i]);this._queryRelatedLayers(r).then(t.hitch(this,function(e){this._setRelatedRecords(r,e),s.resolve(e)}),t.hitch(this,this._handlerErrorResponse,s))}),t.hitch(this,this._handlerErrorResponse,s)),s.promise},_getRelatedLayersInfo:function(e){var t,r,s=e.graphic,a=e.fieldsInfo,n={};t=s.getSourceLayer(),this._relatedLayersInfo||(this._relatedLayersInfo={}),i.forEach(a,function(e){var r,s,a,n,o;r=this._fromRelatedFieldName(e.fieldName),s=r[0],a=r[1],s&&(this._relatedLayersInfo[s]||(i.some(t.relationships,function(e){return e.id==s?(o=e,!0):void 0}),o&&(this._relatedLayersInfo[s]={relation:o,relatedFields:[],outStatistics:[]})),this._relatedLayersInfo[s]&&(this._relatedLayersInfo[s].relatedFields.push(a),e.statisticType&&(n=new _,n.statisticType=e.statisticType,n.onStatisticField=a,n.outStatisticFieldName=a,this._relatedLayersInfo[s].outStatistics.push(n))))},this);for(r in this._relatedLayersInfo)if(this._relatedLayersInfo.hasOwnProperty(r)){var o,d;this._relatedLayersInfo[r]&&(o=this._relatedLayersInfo[r].relation,d=t.url.replace(/[0-9]+$/,o.relatedTableId),this._relatedLayersInfo[r].relatedLayerUrl=d,n[r]=u({url:d,content:{f:"json"},callbackParamName:"callback"}))}return l(n)},_queryRelatedLayers:function(e){var t,i={};for(t in this._relatedLayersInfo)this._relatedLayersInfo.hasOwnProperty(t)&&(i[t]=this._queryRelatedLayer({graphic:e,relatedInfo:this._relatedLayersInfo[t]}));return l(i)},_queryRelatedLayer:function(e){var r,s,a,o,d,f,h,u,m,_,y,F,g,I,L;return r=e.graphic,s=r.getSourceLayer(),a=s.url.match(/[0-9]+$/g)[0],F=e.relatedInfo,_=F.relatedLayerInfo,g=F.relatedLayerUrl,I=F.relation,i.some(_.relationships,function(e){return e.relatedTableId===parseInt(a,10)?(o=e,!0):void 0},this),o&&(d=new c,i.some(_.fields,function(e){return e.name===o.keyField?(u=-1!==i.indexOf(["esriFieldTypeSmallInteger","esriFieldTypeInteger","esriFieldTypeSingle","esriFieldTypeDouble"],e.type)?"number":"string",!0):void 0}),o.relationshipTableId&&o.keyFieldInRelationshipTable?(L=new n,this._queryRelatedRecords(r,o).then(t.hitch(this,function(e){var a,n;a=e[r.attributes[s.objectIdField]],n=i.map(a.features,function(e){return e.attributes[_.objectIdField]},this),F.outStatistics&&F.outStatistics.length>0&&_.supportsStatistics&&(m=new c,m.objectIds=n,m.outFields=d.outFields,m.outStatistics=F.outStatistics),m&&(f=new p(g),f.execute(m).then(t.hitch(this,function(e){var t=[];t.push(a),t.push(e),L.resolve(t)})))}))):(h="string"===u?o.keyField+"='"+r.attributes[I.keyField]+"'":o.keyField+"="+r.attributes[I.keyField],d.where=h,d.outFields=F.relatedFields,F.outStatistics&&F.outStatistics.length>0&&_.supportsStatistics&&(m=new c,m.where=d.where,m.outFields=d.outFields,m.outStatistics=F.outStatistics),f=new p(g),y=[],y.push(f.execute(d)),m&&y.push(f.execute(m)))),y?l(y):L?L.promise:void 0},_setRelatedRecords:function(e,t){this._relatedInfo=[];var i;for(i in t)if(t.hasOwnProperty(i)&&t[i]){var r=t[i];this._relatedInfo[i]={},this._relatedInfo[i].relatedFeatures=r[0].features,f.isDefined(r[1])&&(this._relatedInfo[i].relatedStatsFeatures=r[1].features)}},_handlerErrorResponse:function(e,t){e.reject(t)},_fromRelatedFieldName:function(e){var t,i=[];return-1!==e.indexOf(this._relatedFieldPrefix)&&(t=e.split("/"),i=t.slice(1)),i},_toRelatedFieldName:function(e){var t="";return e&&e.length>0&&(t=this._relatedFieldPrefix+e[0]+"/"+e[1]),t},_queryRelatedRecords:function(e,t){var i=e.getSourceLayer(),r=new m;return r.outFields=["*"],r.relationshipId=t.id,r.objectIds=[e.attributes[i.objectIdField]],i.queryRelatedFeatures(r)}});return a("extend-esri")&&(h.PopupInfo=h.PopupInfoTemplate=g),g});