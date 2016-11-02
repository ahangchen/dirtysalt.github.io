/* Copyright (c) 2006, Yahoo! Inc. All rights reserved.Code licensed under the BSD License: http://developer.yahoo.net/yui/license.txt Version: 0.11.4*/ if(typeof YAHOO=="undefined"){YAHOO={};}YAHOO.namespace=function(ns){if(!ns||!ns.length){return null;}var _2=ns.split(".");var _3=YAHOO;for(var i=(_2[0]=="YAHOO")?1:0;i<_2.length;++i){_3[_2[i]]=_3[_2[i]]||{};_3=_3[_2[i]];}return _3;};YAHOO.log=function(_5,_6,_7){var l=YAHOO.widget.Logger;if(l&&l.log){return l.log(_5,_6,_7);}else{return false;}};YAHOO.extend=function(_9,_10){var f=function(){};f.prototype=_10.prototype;_9.prototype=new f();_9.prototype.constructor=_9;_9.superclass=_10.prototype;if(_10.prototype.constructor==Object.prototype.constructor){_10.prototype.constructor=_10;}};YAHOO.namespace("util");YAHOO.namespace("widget");YAHOO.namespace("example");

/* Copyright (c) 2006, Yahoo! Inc. All rights reserved.  Code licensed under the BSD License: http://developer.yahoo.net/yui/license.txt Version: 0.11.3 */ YAHOO.util.Dom=function(){var ua=navigator.userAgent.toLowerCase();var isOpera=(ua.indexOf('opera')>-1);var isSafari=(ua.indexOf('safari')>-1);var isIE=(window.ActiveXObject);var id_counter=0;var util=YAHOO.util;var property_cache={};var toCamel=function(property){var convert=function(prop){var test=/(-[a-z])/i.exec(prop);return prop.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());};while(property.indexOf('-')>-1){property=convert(property);}return property;};var toHyphen=function(property){if(property.indexOf('-')>-1){return property;}var converted='';for(var i=0,len=property.length;i<len;++i){if(property.charAt(i)==property.charAt(i).toUpperCase()){converted=converted+'-'+property.charAt(i).toLowerCase();}else{converted=converted+property.charAt(i);}}return converted;};var cacheConvertedProperties=function(property){property_cache[property]={camel:toCamel(property),hyphen:toHyphen(property)};};return{get:function(el){if(!el){return null;}if(typeof el!='string'&&!(el instanceof Array)){return el;}if(typeof el=='string'){return document.getElementById(el);}else{var collection=[];for(var i=0,len=el.length;i<len;++i){collection[collection.length]=util.Dom.get(el[i]);}return collection;}return null;},getStyle:function(el,property){var f=function(el){var value=null;var dv=document.defaultView;if(!property_cache[property]){cacheConvertedProperties(property);}var camel=property_cache[property]['camel'];var hyphen=property_cache[property]['hyphen'];if(property=='opacity'&&el.filters){value=1;try{value=el.filters.item('DXImageTransform.Microsoft.Alpha').opacity/100;}catch(e){try{value=el.filters.item('alpha').opacity/100;}catch(e){}}}else if(el.style[camel]){value=el.style[camel];}else if(isIE&&el.currentStyle&&el.currentStyle[camel]){value=el.currentStyle[camel];}else if(dv&&dv.getComputedStyle){var computed=dv.getComputedStyle(el,'');if(computed&&computed.getPropertyValue(hyphen)){value=computed.getPropertyValue(hyphen);}}return value;};return util.Dom.batch(el,f,util.Dom,true);},setStyle:function(el,property,val){if(!property_cache[property]){cacheConvertedProperties(property);}var camel=property_cache[property]['camel'];var f=function(el){switch(property){case'opacity':if(isIE&&typeof el.style.filter=='string'){el.style.filter='alpha(opacity='+val*100+')';if(!el.currentStyle||!el.currentStyle.hasLayout){el.style.zoom=1;}}else{el.style.opacity=val;el.style['-moz-opacity']=val;el.style['-khtml-opacity']=val;}break;default:el.style[camel]=val;}};util.Dom.batch(el,f,util.Dom,true);},getXY:function(el){var f=function(el){if(el.offsetParent===null||this.getStyle(el,'display')=='none'){return false;}var parentNode=null;var pos=[];var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var doc=document;if(!this.inDocument(el)&&parent.document!=document){doc=parent.document;if(!this.isAncestor(doc.documentElement,el)){return false;}}var scrollTop=Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);var scrollLeft=Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);return[box.left+scrollLeft,box.top+scrollTop];}else{pos=[el.offsetLeft,el.offsetTop];parentNode=el.offsetParent;if(parentNode!=el){while(parentNode){pos[0]+=parentNode.offsetLeft;pos[1]+=parentNode.offsetTop;parentNode=parentNode.offsetParent;}}if(isSafari&&this.getStyle(el,'position')=='absolute'){pos[0]-=document.body.offsetLeft;pos[1]-=document.body.offsetTop;}}if(el.parentNode){parentNode=el.parentNode;}else{parentNode=null;}while(parentNode&&parentNode.tagName.toUpperCase()!='BODY'&&parentNode.tagName.toUpperCase()!='HTML'){if(util.Dom.getStyle(parentNode,'display')!='inline'){pos[0]-=parentNode.scrollLeft;pos[1]-=parentNode.scrollTop;}if(parentNode.parentNode){parentNode=parentNode.parentNode;}else{parentNode=null;}}return pos;};return util.Dom.batch(el,f,util.Dom,true);},getX:function(el){var f=function(el){return util.Dom.getXY(el)[0];};return util.Dom.batch(el,f,util.Dom,true);},getY:function(el){var f=function(el){return util.Dom.getXY(el)[1];};return util.Dom.batch(el,f,util.Dom,true);},setXY:function(el,pos,noRetry){var f=function(el){var style_pos=this.getStyle(el,'position');if(style_pos=='static'){this.setStyle(el,'position','relative');style_pos='relative';}var pageXY=this.getXY(el);if(pageXY===false){return false;}var delta=[parseInt(this.getStyle(el,'left'),10),parseInt(this.getStyle(el,'top'),10)];if(isNaN(delta[0])){delta[0]=(style_pos=='relative')?0:el.offsetLeft;}if(isNaN(delta[1])){delta[1]=(style_pos=='relative')?0:el.offsetTop;}if(pos[0]!==null){el.style.left=pos[0]-pageXY[0]+delta[0]+'px';}if(pos[1]!==null){el.style.top=pos[1]-pageXY[1]+delta[1]+'px';}var newXY=this.getXY(el);if(!noRetry&&(newXY[0]!=pos[0]||newXY[1]!=pos[1])){this.setXY(el,pos,true);}};util.Dom.batch(el,f,util.Dom,true);},setX:function(el,x){util.Dom.setXY(el,[x,null]);},setY:function(el,y){util.Dom.setXY(el,[null,y]);},getRegion:function(el){var f=function(el){var region=new YAHOO.util.Region.getRegion(el);return region;};return util.Dom.batch(el,f,util.Dom,true);},getClientWidth:function(){return util.Dom.getViewportWidth();},getClientHeight:function(){return util.Dom.getViewportHeight();},getElementsByClassName:function(className,tag,root){var method=function(el){return util.Dom.hasClass(el,className)};return util.Dom.getElementsBy(method,tag,root);},hasClass:function(el,className){var re=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)');var f=function(el){return re.test(el['className']);};return util.Dom.batch(el,f,util.Dom,true);},addClass:function(el,className){var f=function(el){if(this.hasClass(el,className)){return;}el['className']=[el['className'],className].join(' ');};util.Dom.batch(el,f,util.Dom,true);},removeClass:function(el,className){var re=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)','g');var f=function(el){if(!this.hasClass(el,className)){return;}var c=el['className'];el['className']=c.replace(re,' ');if(this.hasClass(el,className)){this.removeClass(el,className);}};util.Dom.batch(el,f,util.Dom,true);},replaceClass:function(el,oldClassName,newClassName){if(oldClassName===newClassName){return false;};var re=new RegExp('(?:^|\\s+)'+oldClassName+'(?:\\s+|$)','g');var f=function(el){if(!this.hasClass(el,oldClassName)){this.addClass(el,newClassName);return;}el['className']=el['className'].replace(re,' '+newClassName+' ');if(this.hasClass(el,oldClassName)){this.replaceClass(el,oldClassName,newClassName);}};util.Dom.batch(el,f,util.Dom,true);},generateId:function(el,prefix){prefix=prefix||'yui-gen';el=el||{};var f=function(el){if(el){el=util.Dom.get(el);}else{el={};}if(!el.id){el.id=prefix+id_counter++;}return el.id;};return util.Dom.batch(el,f,util.Dom,true);},isAncestor:function(haystack,needle){haystack=util.Dom.get(haystack);if(!haystack||!needle){return false;}var f=function(needle){if(haystack.contains&&!isSafari){return haystack.contains(needle);}else if(haystack.compareDocumentPosition){return!!(haystack.compareDocumentPosition(needle)&16);}else{var parent=needle.parentNode;while(parent){if(parent==haystack){return true;}else if(!parent.tagName||parent.tagName.toUpperCase()=='HTML'){return false;}parent=parent.parentNode;}return false;}};return util.Dom.batch(needle,f,util.Dom,true);},inDocument:function(el){var f=function(el){return this.isAncestor(document.documentElement,el);};return util.Dom.batch(el,f,util.Dom,true);},getElementsBy:function(method,tag,root){tag=tag||'*';root=util.Dom.get(root)||document;var nodes=[];var elements=root.getElementsByTagName(tag);if(!elements.length&&(tag=='*'&&root.all)){elements=root.all;}for(var i=0,len=elements.length;i<len;++i){if(method(elements[i])){nodes[nodes.length]=elements[i];}}return nodes;},batch:function(el,method,o,override){var id=el;el=util.Dom.get(el);var scope=(override)?o:window;if(!el||el.tagName||!el.length){if(!el){return false;}return method.call(scope,el,o);}var collection=[];for(var i=0,len=el.length;i<len;++i){if(!el[i]){id=id[i];}collection[collection.length]=method.call(scope,el[i],o);}return collection;},getDocumentHeight:function(){var scrollHeight=-1,windowHeight=-1,bodyHeight=-1;var marginTop=parseInt(util.Dom.getStyle(document.body,'marginTop'),10);var marginBottom=parseInt(util.Dom.getStyle(document.body,'marginBottom'),10);var mode=document.compatMode;if((mode||isIE)&&!isOpera){switch(mode){case'CSS1Compat':scrollHeight=((window.innerHeight&&window.scrollMaxY)?window.innerHeight+window.scrollMaxY:-1);windowHeight=[document.documentElement.clientHeight,self.innerHeight||-1].sort(function(a,b){return(a-b);})[1];bodyHeight=document.body.offsetHeight+marginTop+marginBottom;break;default:scrollHeight=document.body.scrollHeight;bodyHeight=document.body.clientHeight;}}else{scrollHeight=document.documentElement.scrollHeight;windowHeight=self.innerHeight;bodyHeight=document.documentElement.clientHeight;}var h=[scrollHeight,windowHeight,bodyHeight].sort(function(a,b){return(a-b);});return h[2];},getDocumentWidth:function(){var docWidth=-1,bodyWidth=-1,winWidth=-1;var marginRight=parseInt(util.Dom.getStyle(document.body,'marginRight'),10);var marginLeft=parseInt(util.Dom.getStyle(document.body,'marginLeft'),10);var mode=document.compatMode;if(mode||isIE){switch(mode){case'CSS1Compat':docWidth=document.documentElement.clientWidth;bodyWidth=document.body.offsetWidth+marginLeft+marginRight;break;default:bodyWidth=document.body.clientWidth;docWidth=document.body.scrollWidth;break;}}else{docWidth=document.documentElement.clientWidth;bodyWidth=document.body.offsetWidth+marginLeft+marginRight;}var w=Math.max(docWidth,bodyWidth);return w;},getViewportHeight:function(){var height=-1;var mode=document.compatMode;if((mode||isIE)&&!isOpera){switch(mode){case'CSS1Compat':height=document.documentElement.clientHeight;break;default:height=document.body.clientHeight;}}else{height=self.innerHeight;}return height;},getViewportWidth:function(){var width=-1;var mode=document.compatMode;if(mode||isIE){switch(mode){case'CSS1Compat':width=document.documentElement.clientWidth;break;default:width=document.body.clientWidth;}}else{width=self.innerWidth;}return width;}};}();YAHOO.util.Region=function(t,r,b,l){this.top=t;this[1]=t;this.right=r;this.bottom=b;this.left=l;this[0]=l;};YAHOO.util.Region.prototype.contains=function(region){return(region.left>=this.left&&region.right<=this.right&&region.top>=this.top&&region.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(region){var t=Math.max(this.top,region.top);var r=Math.min(this.right,region.right);var b=Math.min(this.bottom,region.bottom);var l=Math.max(this.left,region.left);if(b>=t&&r>=l){return new YAHOO.util.Region(t,r,b,l);}else{return null;}};YAHOO.util.Region.prototype.union=function(region){var t=Math.min(this.top,region.top);var r=Math.max(this.right,region.right);var b=Math.max(this.bottom,region.bottom);var l=Math.min(this.left,region.left);return new YAHOO.util.Region(t,r,b,l);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");};YAHOO.util.Region.getRegion=function(el){var p=YAHOO.util.Dom.getXY(el);var t=p[1];var r=p[0]+el.offsetWidth;var b=p[1]+el.offsetHeight;var l=p[0];return new YAHOO.util.Region(t,r,b,l);};YAHOO.util.Point=function(x,y){if(x instanceof Array){y=x[1];x=x[0];}this.x=this.right=this.left=this[0]=x;this.y=this.top=this.bottom=this[1]=y;};YAHOO.util.Point.prototype=new YAHOO.util.Region();

/* Copyright (c) 2006, Yahoo! Inc. All rights reserved. Code licensed under the BSD License:http://developer.yahoo.net/yui/license.txt Version: 0.11.4*/ YAHOO.util.CustomEvent=function(_1,_2,_3){this.type=_1;this.scope=_2||window;this.silent=_3;this.subscribers=[];if(!this.silent){}};YAHOO.util.CustomEvent.prototype={subscribe:function(fn,_5,_6){this.subscribers.push(new YAHOO.util.Subscriber(fn,_5,_6));},unsubscribe:function(fn,_7){var _8=false;for(var i=0,len=this.subscribers.length;i<len;++i){var s=this.subscribers[i];if(s&&s.contains(fn,_7)){this._delete(i);_8=true;}}return _8;},fire:function(){var len=this.subscribers.length;if(!len&&this.silent){return;}var _12=[];for(var i=0;i<arguments.length;++i){_12.push(arguments[i]);}if(!this.silent){}for(i=0;i<len;++i){var s=this.subscribers[i];if(s){if(!this.silent){}var _13=(s.override)?s.obj:this.scope;s.fn.call(_13,this.type,_12,s.obj);}}},unsubscribeAll:function(){for(var i=0,len=this.subscribers.length;i<len;++i){this._delete(len-1-i);}},_delete:function(_14){var s=this.subscribers[_14];if(s){delete s.fn;delete s.obj;}this.subscribers.splice(_14,1);},toString:function(){return "CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;}};YAHOO.util.Subscriber=function(fn,obj,_16){this.fn=fn;this.obj=obj||null;this.override=(_16);};YAHOO.util.Subscriber.prototype.contains=function(fn,obj){return (this.fn==fn&&this.obj==obj);};YAHOO.util.Subscriber.prototype.toString=function(){return "Subscriber { obj: "+(this.obj||"")+", override: "+(this.override||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var _17=false;var _18=[];var _19=[];var _20=[];var _21=[];var _22=[];var _23=0;var _24=[];var _25=[];var _26=0;return {POLL_RETRYS:200,POLL_INTERVAL:50,EL:0,TYPE:1,FN:2,WFN:3,SCOPE:3,ADJ_SCOPE:4,isSafari:(/Safari|Konqueror|KHTML/gi).test(navigator.userAgent),isIE:(!this.isSafari&&!navigator.userAgent.match(/opera/gi)&&navigator.userAgent.match(/msie/gi)),addDelayedListener:function(el,_28,fn,_29,_30){_19[_19.length]=[el,_28,fn,_29,_30];if(_17){_23=this.POLL_RETRYS;this.startTimeout(0);}},startTimeout:function(_31){var i=(_31||_31===0)?_31:this.POLL_INTERVAL;var _32=this;var _33=function(){_32._tryPreloadAttach();};this.timeout=setTimeout(_33,i);},onAvailable:function(_34,_35,_36,_37){_24.push({id:_34,fn:_35,obj:_36,override:_37});_23=this.POLL_RETRYS;this.startTimeout(0);},addListener:function(el,_38,fn,_39,_40){if(!fn||!fn.call){return false;}if(this._isValidCollection(el)){var ok=true;for(var i=0,len=el.length;i<len;++i){ok=(this.on(el[i],_38,fn,_39,_40)&&ok);}return ok;}else{if(typeof el=="string"){var oEl=this.getEl(el);if(_17&&oEl){el=oEl;}else{this.addDelayedListener(el,_38,fn,_39,_40);return true;}}}if(!el){return false;}if("unload"==_38&&_39!==this){_20[_20.length]=[el,_38,fn,_39,_40];return true;}var _43=(_40)?_39:el;var _44=function(e){return fn.call(_43,YAHOO.util.Event.getEvent(e),_39);};var li=[el,_38,fn,_44,_43];var _47=_18.length;_18[_47]=li;if(this.useLegacyEvent(el,_38)){var _48=this.getLegacyIndex(el,_38);if(_48==-1||el!=_21[_48][0]){_48=_21.length;_25[el.id+_38]=_48;_21[_48]=[el,_38,el["on"+_38]];_22[_48]=[];el["on"+_38]=function(e){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),_48);};}_22[_48].push(li);}else{if(el.addEventListener){el.addEventListener(_38,_44,false);}else{if(el.attachEvent){el.attachEvent("on"+_38,_44);}}}return true;},fireLegacyEvent:function(e,_49){var ok=true;var le=_22[_49];for(var i=0,len=le.length;i<len;++i){var li=le[i];if(li&&li[this.WFN]){var _51=li[this.ADJ_SCOPE];var ret=li[this.WFN].call(_51,e);ok=(ok&&ret);}}return ok;},getLegacyIndex:function(el,_53){var key=this.generateId(el)+_53;if(typeof _25[key]=="undefined"){return -1;}else{return _25[key];}},useLegacyEvent:function(el,_55){if(!el.addEventListener&&!el.attachEvent){return true;}else{if(this.isSafari){if("click"==_55||"dblclick"==_55){return true;}}}return false;},removeListener:function(el,_56,fn,_57){if(!fn||!fn.call){return false;}var i,len;if(typeof el=="string"){el=this.getEl(el);}else{if(this._isValidCollection(el)){var ok=true;for(i=0,len=el.length;i<len;++i){ok=(this.removeListener(el[i],_56,fn)&&ok);}return ok;}}if("unload"==_56){for(i=0,len=_20.length;i<len;i++){var li=_20[i];if(li&&li[0]==el&&li[1]==_56&&li[2]==fn){_20.splice(i,1);return true;}}return false;}var _58=null;if("undefined"==typeof _57){_57=this._getCacheIndex(el,_56,fn);}if(_57>=0){_58=_18[_57];}if(!el||!_58){return false;}if(this.useLegacyEvent(el,_56)){var _59=this.getLegacyIndex(el,_56);var _60=_22[_59];if(_60){for(i=0,len=_60.length;i<len;++i){li=_60[i];if(li&&li[this.EL]==el&&li[this.TYPE]==_56&&li[this.FN]==fn){_60.splice(i,1);}}}}else{if(el.removeEventListener){el.removeEventListener(_56,_58[this.WFN],false);}else{if(el.detachEvent){el.detachEvent("on"+_56,_58[this.WFN]);}}}delete _18[_57][this.WFN];delete _18[_57][this.FN];_18.splice(_57,1);return true;},getTarget:function(ev,_62){var t=ev.target||ev.srcElement;return this.resolveTextNode(t);},resolveTextNode:function(_64){if(_64&&_64.nodeName&&"#TEXT"==_64.nodeName.toUpperCase()){return _64.parentNode;}else{return _64;}},getPageX:function(ev){var x=ev.pageX;if(!x&&0!==x){x=ev.clientX||0;if(this.isIE){x+=this._getScrollLeft();}}return x;},getPageY:function(ev){var y=ev.pageY;if(!y&&0!==y){y=ev.clientY||0;if(this.isIE){y+=this._getScrollTop();}}return y;},getXY:function(ev){return [this.getPageX(ev),this.getPageY(ev)];},getRelatedTarget:function(ev){var t=ev.relatedTarget;if(!t){if(ev.type=="mouseout"){t=ev.toElement;}else{if(ev.type=="mouseover"){t=ev.fromElement;}}}return this.resolveTextNode(t);},getTime:function(ev){if(!ev.time){var t=new Date().getTime();try{ev.time=t;}catch(e){return t;}}return ev.time;},stopEvent:function(ev){this.stopPropagation(ev);this.preventDefault(ev);},stopPropagation:function(ev){if(ev.stopPropagation){ev.stopPropagation();}else{ev.cancelBubble=true;}},preventDefault:function(ev){if(ev.preventDefault){ev.preventDefault();}else{ev.returnValue=false;}},getEvent:function(e){var ev=e||window.event;if(!ev){var c=this.getEvent.caller;while(c){ev=c.arguments[0];if(ev&&Event==ev.constructor){break;}c=c.caller;}}return ev;},getCharCode:function(ev){return ev.charCode||((ev.type=="keypress")?ev.keyCode:0);},_getCacheIndex:function(el,_68,fn){for(var i=0,len=_18.length;i<len;++i){var li=_18[i];if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==_68){return i;}}return -1;},generateId:function(el){var id=el.id;if(!id){id="yuievtautoid-"+_26;++_26;el.id=id;}return id;},_isValidCollection:function(o){return (o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");},elCache:{},getEl:function(id){return document.getElementById(id);},clearCache:function(){},_load:function(e){_17=true;var EU=YAHOO.util.Event;EU._simpleRemove(window,"load",EU._load);},_tryPreloadAttach:function(){if(this.locked){return false;}this.locked=true;var _72=!_17;if(!_72){_72=(_23>0);}var _73=[];for(var i=0,len=_19.length;i<len;++i){var d=_19[i];if(d){var el=this.getEl(d[this.EL]);if(el){this.on(el,d[this.TYPE],d[this.FN],d[this.SCOPE],d[this.ADJ_SCOPE]);delete _19[i];}else{_73.push(d);}}}_19=_73;var _75=[];for(i=0,len=_24.length;i<len;++i){var _76=_24[i];if(_76){el=this.getEl(_76.id);if(el){var _77=(_76.override)?_76.obj:el;_76.fn.call(_77,_76.obj);delete _24[i];}else{_75.push(_76);}}}_23=(_73.length===0&&_75.length===0)?0:_23-1;if(_72){this.startTimeout();}this.locked=false;return true;},purgeElement:function(el,_78,_79){var _80=this.getListeners(el,_79);if(_80){for(var i=0,len=_80.length;i<len;++i){var l=_80[i];this.removeListener(el,l.type,l.fn);}}if(_78&&el&&el.childNodes){for(i=0,len=el.childNodes.length;i<len;++i){this.purgeElement(el.childNodes[i],_78,_79);}}},getListeners:function(el,_82){var _83=[];if(_18&&_18.length>0){for(var i=0,len=_18.length;i<len;++i){var l=_18[i];if(l&&l[this.EL]===el&&(!_82||_82===l[this.TYPE])){_83.push({type:l[this.TYPE],fn:l[this.FN],obj:l[this.SCOPE],adjust:l[this.ADJ_SCOPE],index:i});}}}return (_83.length)?_83:null;},_unload:function(e){var EU=YAHOO.util.Event;for(var i=0,len=_20.length;i<len;++i){var l=_20[i];if(l){var _84=(l[EU.ADJ_SCOPE])?l[EU.SCOPE]:window;l[EU.FN].call(_84,EU.getEvent(e),l[EU.SCOPE]);delete _20[i];l=null;}}if(_18&&_18.length>0){var j=_18.length;while(j){var _86=j-1;l=_18[_86];if(l){EU.removeListener(l[EU.EL],l[EU.TYPE],l[EU.FN],_86);}l=null;j=j-1;}EU.clearCache();}for(i=0,len=_21.length;i<len;++i){delete _21[i][0];delete _21[i];}EU._simpleRemove(window,"unload",EU._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var dd=document.documentElement,db=document.body;if(dd&&(dd.scrollTop||dd.scrollLeft)){return [dd.scrollTop,dd.scrollLeft];}else{if(db){return [db.scrollTop,db.scrollLeft];}else{return [0,0];}}},_simpleAdd:function(el,_88,fn,_89){if(el.addEventListener){el.addEventListener(_88,fn,(_89));}else{if(el.attachEvent){el.attachEvent("on"+_88,fn);}}},_simpleRemove:function(el,_90,fn,_91){if(el.removeEventListener){el.removeEventListener(_90,fn,(_91));}else{if(el.detachEvent){el.detachEvent("on"+_90,fn);}}}};}();YAHOO.util.Event.on=YAHOO.util.Event.addListener;if(document&&document.body){YAHOO.util.Event._load();}else{YAHOO.util.Event._simpleAdd(window,"load",YAHOO.util.Event._load);}YAHOO.util.Event._simpleAdd(window,"unload",YAHOO.util.Event._unload);YAHOO.util.Event._tryPreloadAttach();}

/* Copyright (c) 2006, Yahoo! Inc. All rights reserved. Code licensed under the BSD License:http://developer.yahoo.net/yui/license.txt Version: 0.11.4 */
YAHOO.util.DragDrop=function(id,_2,_3){if(id){this.init(id,_2,_3);}};YAHOO.util.DragDrop.prototype={id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,b4StartDrag:function(x,y){},startDrag:function(x,y){},b4Drag:function(e){},onDrag:function(e){},onDragEnter:function(e,id){},b4DragOver:function(e){},onDragOver:function(e,id){},b4DragOut:function(e){},onDragOut:function(e,id){},b4DragDrop:function(e){},onDragDrop:function(e,id){},b4EndDrag:function(e){},endDrag:function(e){},b4MouseDown:function(e){},onMouseDown:function(e){},onMouseUp:function(e){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=YAHOO.util.Dom.get(this.id);}return this._domRef;},getDragEl:function(){return YAHOO.util.Dom.get(this.dragElId);},init:function(id,_7,_8){this.initTarget(id,_7,_8);YAHOO.util.Event.addListener(this.id,"mousedown",this.handleMouseDown,this,true);},initTarget:function(id,_9,_10){this.config=_10||{};this.DDM=YAHOO.util.DDM;this.groups={};this.id=id;this.addToGroup((_9)?_9:"default");this.handleElId=id;YAHOO.util.Event.onAvailable(id,this.handleOnAvailable,this,true);this.setDragElId(id);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(_11,_12,_13,_14){if(!_12&&0!==_12){this.padding=[_11,_11,_11,_11];}else{if(!_13&&0!==_13){this.padding=[_11,_12,_11,_12];}else{this.padding=[_11,_12,_13,_14];}}},setInitPosition:function(_15,_16){var el=this.getEl();if(!this.DDM.verifyEl(el)){return;}var dx=_15||0;var dy=_16||0;var p=YAHOO.util.Dom.getXY(el);this.initPageX=p[0]-dx;this.initPageY=p[1]-dy;this.lastPageX=p[0];this.lastPageY=p[1];this.setStartPosition(p);},setStartPosition:function(pos){var p=pos||YAHOO.util.Dom.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=p[0];this.startPageY=p[1];},addToGroup:function(_22){this.groups[_22]=true;this.DDM.regDragDrop(this,_22);},removeFromGroup:function(_23){if(this.groups[_23]){delete this.groups[_23];}this.DDM.removeDDFromGroup(this,_23);},setDragElId:function(id){this.dragElId=id;},setHandleElId:function(id){this.handleElId=id;this.DDM.regHandle(this.id,id);},setOuterHandleElId:function(id){YAHOO.util.Event.addListener(id,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(id);},unreg:function(){YAHOO.util.Event.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return (this.DDM.isLocked()||this.locked);},handleMouseDown:function(e,oDD){var EU=YAHOO.util.Event;var _26=e.which||e.button;if(this.primaryButtonOnly&&_26>1){return;}if(this.isLocked()){return;}this.DDM.refreshCache(this.groups);var pt=new YAHOO.util.Point(EU.getPageX(e),EU.getPageY(e));if(!this.DDM.isOverTarget(pt,this)){}else{var _28=EU.getTarget(e);if(this.isValidHandleChild(_28)&&(this.id==this.handleElId||this.DDM.handleWasClicked(_28,this.id))){this.setStartPosition();this.b4MouseDown(e);this.onMouseDown(e);this.DDM.handleMouseDown(e,this);this.DDM.stopEvent(e);}}},addInvalidHandleType:function(_29){var _30=_29.toUpperCase();this.invalidHandleTypes[_30]=_30;},addInvalidHandleId:function(id){this.invalidHandleIds[id]=id;},addInvalidHandleClass:function(_31){this.invalidHandleClasses.push(_31);},removeInvalidHandleType:function(_32){var _33=_32.toUpperCase();delete this.invalidHandleTypes[_33];},removeInvalidHandleId:function(id){delete this.invalidHandleIds[id];},removeInvalidHandleClass:function(_34){for(var i=0,len=this.invalidHandleClasses.length;i<len;++i){if(this.invalidHandleClasses[i]==_34){delete this.invalidHandleClasses[i];}}},isValidHandleChild:function(_36){var _37=true;var _38;try{_38=_36.nodeName.toUpperCase();}catch(e){_38=_36.nodeName;}_37=_37&&!this.invalidHandleTypes[_38];_37=_37&&!this.invalidHandleIds[_36.id];for(var i=0,len=this.invalidHandleClasses.length;_37&&i<len;++i){_37=!YAHOO.util.Dom.hasClass(_36,this.invalidHandleClasses[i]);}return _37;},setXTicks:function(_39,_40){this.xTicks=[];this.xTickSize=_40;var _41={};for(var i=this.initPageX;i>=this.minX;i=i-_40){if(!_41[i]){this.xTicks[this.xTicks.length]=i;_41[i]=true;}}for(i=this.initPageX;i<=this.maxX;i=i+_40){if(!_41[i]){this.xTicks[this.xTicks.length]=i;_41[i]=true;}}this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(_42,_43){this.yTicks=[];this.yTickSize=_43;var _44={};for(var i=this.initPageY;i>=this.minY;i=i-_43){if(!_44[i]){this.yTicks[this.yTicks.length]=i;_44[i]=true;}}for(i=this.initPageY;i<=this.maxY;i=i+_43){if(!_44[i]){this.yTicks[this.yTicks.length]=i;_44[i]=true;}}this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(_45,_46,_47){this.leftConstraint=_45;this.rightConstraint=_46;this.minX=this.initPageX-_45;this.maxX=this.initPageX+_46;if(_47){this.setXTicks(this.initPageX,_47);}this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(iUp,_49,_50){this.topConstraint=iUp;this.bottomConstraint=_49;this.minY=this.initPageY-iUp;this.maxY=this.initPageY+_49;if(_50){this.setYTicks(this.initPageY,_50);}this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var dx=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var dy=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(dx,dy);}else{this.setInitPosition();}if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(val,_52){if(!_52){return val;}else{if(_52[0]>=val){return _52[0];}else{for(var i=0,len=_52.length;i<len;++i){var _53=i+1;if(_52[_53]&&_52[_53]>=val){var _54=val-_52[i];var _55=_52[_53]-val;return (_55>_54)?_52[i]:_52[_53];}}return _52[_52.length-1];}}},toString:function(){return ("DragDrop "+this.id);}};if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=new function(){this.ids={};this.handleIds={};this.dragCurrent=null;this.dragOvers={};this.deltaX=0;this.deltaY=0;this.preventDefault=true;this.stopPropagation=true;this.initalized=false;this.locked=false;this.init=function(){this.initialized=true;};this.POINT=0;this.INTERSECT=1;this.mode=this.POINT;this._execOnAll=function(_56,_57){for(var i in this.ids){for(var j in this.ids[i]){var oDD=this.ids[i][j];if(!this.isTypeOfDD(oDD)){continue;}oDD[_56].apply(oDD,_57);}}};this._onLoad=function(){this.init();var EU=YAHOO.util.Event;EU.on(document,"mouseup",this.handleMouseUp,this,true);EU.on(document,"mousemove",this.handleMouseMove,this,true);EU.on(window,"unload",this._onUnload,this,true);EU.on(window,"resize",this._onResize,this,true);};this._onResize=function(e){this._execOnAll("resetConstraints",[]);};this.lock=function(){this.locked=true;};this.unlock=function(){this.locked=false;};this.isLocked=function(){return this.locked;};this.locationCache={};this.useCache=true;this.clickPixelThresh=3;this.clickTimeThresh=1000;this.dragThreshMet=false;this.clickTimeout=null;this.startX=0;this.startY=0;this.regDragDrop=function(oDD,_59){if(!this.initialized){this.init();}if(!this.ids[_59]){this.ids[_59]={};}this.ids[_59][oDD.id]=oDD;};this.removeDDFromGroup=function(oDD,_60){if(!this.ids[_60]){this.ids[_60]={};}var obj=this.ids[_60];if(obj&&obj[oDD.id]){delete obj[oDD.id];}};this._remove=function(oDD){for(var g in oDD.groups){if(g&&this.ids[g][oDD.id]){delete this.ids[g][oDD.id];}}delete this.handleIds[oDD.id];};this.regHandle=function(_63,_64){if(!this.handleIds[_63]){this.handleIds[_63]={};}this.handleIds[_63][_64]=_64;};this.isDragDrop=function(id){return (this.getDDById(id))?true:false;};this.getRelated=function(_65,_66){var _67=[];for(var i in _65.groups){for(j in this.ids[i]){var dd=this.ids[i][j];if(!this.isTypeOfDD(dd)){continue;}if(!_66||dd.isTarget){_67[_67.length]=dd;}}}return _67;};this.isLegalTarget=function(oDD,_69){var _70=this.getRelated(oDD,true);for(var i=0,len=_70.length;i<len;++i){if(_70[i].id==_69.id){return true;}}return false;};this.isTypeOfDD=function(oDD){return (oDD&&oDD.__ygDragDrop);};this.isHandle=function(_71,_72){return (this.handleIds[_71]&&this.handleIds[_71][_72]);};this.getDDById=function(id){for(var i in this.ids){if(this.ids[i][id]){return this.ids[i][id];}}return null;};this.handleMouseDown=function(e,oDD){this.currentTarget=YAHOO.util.Event.getTarget(e);this.dragCurrent=oDD;var el=oDD.getEl();this.startX=YAHOO.util.Event.getPageX(e);this.startY=YAHOO.util.Event.getPageY(e);this.deltaX=this.startX-el.offsetLeft;this.deltaY=this.startY-el.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var DDM=YAHOO.util.DDM;DDM.startDrag(DDM.startX,DDM.startY);},this.clickTimeThresh);};this.startDrag=function(x,y){clearTimeout(this.clickTimeout);if(this.dragCurrent){this.dragCurrent.b4StartDrag(x,y);this.dragCurrent.startDrag(x,y);}this.dragThreshMet=true;};this.handleMouseUp=function(e){if(!this.dragCurrent){return;}clearTimeout(this.clickTimeout);if(this.dragThreshMet){this.fireEvents(e,true);}else{}this.stopDrag(e);this.stopEvent(e);};this.stopEvent=function(e){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(e);}if(this.preventDefault){YAHOO.util.Event.preventDefault(e);}};this.stopDrag=function(e){if(this.dragCurrent){if(this.dragThreshMet){this.dragCurrent.b4EndDrag(e);this.dragCurrent.endDrag(e);}this.dragCurrent.onMouseUp(e);}this.dragCurrent=null;this.dragOvers={};};this.handleMouseMove=function(e){if(!this.dragCurrent){return true;}if(YAHOO.util.Event.isIE&&!e.button){this.stopEvent(e);return this.handleMouseUp(e);}if(!this.dragThreshMet){var _74=Math.abs(this.startX-YAHOO.util.Event.getPageX(e));var _75=Math.abs(this.startY-YAHOO.util.Event.getPageY(e));if(_74>this.clickPixelThresh||_75>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}if(this.dragThreshMet){this.dragCurrent.b4Drag(e);this.dragCurrent.onDrag(e);this.fireEvents(e,false);}this.stopEvent(e);return true;};this.fireEvents=function(e,_76){var dc=this.dragCurrent;if(!dc||dc.isLocked()){return;}var x=YAHOO.util.Event.getPageX(e);var y=YAHOO.util.Event.getPageY(e);var pt=new YAHOO.util.Point(x,y);var _78=[];var _79=[];var _80=[];var _81=[];var _82=[];for(var i in this.dragOvers){var ddo=this.dragOvers[i];if(!this.isTypeOfDD(ddo)){continue;}if(!this.isOverTarget(pt,ddo,this.mode)){_79.push(ddo);}_78[i]=true;delete this.dragOvers[i];}for(var _84 in dc.groups){if("string"!=typeof _84){continue;}for(i in this.ids[_84]){var oDD=this.ids[_84][i];if(!this.isTypeOfDD(oDD)){continue;}if(oDD.isTarget&&!oDD.isLocked()&&oDD!=dc){if(this.isOverTarget(pt,oDD,this.mode)){if(_76){_81.push(oDD);}else{if(!_78[oDD.id]){_82.push(oDD);}else{_80.push(oDD);}this.dragOvers[oDD.id]=oDD;}}}}}if(this.mode){if(_79.length){dc.b4DragOut(e,_79);dc.onDragOut(e,_79);}if(_82.length){dc.onDragEnter(e,_82);}if(_80.length){dc.b4DragOver(e,_80);dc.onDragOver(e,_80);}if(_81.length){dc.b4DragDrop(e,_81);dc.onDragDrop(e,_81);}}else{var len=0;for(i=0,len=_79.length;i<len;++i){dc.b4DragOut(e,_79[i].id);dc.onDragOut(e,_79[i].id);}for(i=0,len=_82.length;i<len;++i){dc.onDragEnter(e,_82[i].id);}for(i=0,len=_80.length;i<len;++i){dc.b4DragOver(e,_80[i].id);dc.onDragOver(e,_80[i].id);}for(i=0,len=_81.length;i<len;++i){dc.b4DragDrop(e,_81[i].id);dc.onDragDrop(e,_81[i].id);}}};this.getBestMatch=function(dds){var _87=null;var len=dds.length;if(len==1){_87=dds[0];}else{for(var i=0;i<len;++i){var dd=dds[i];if(dd.cursorIsOver){_87=dd;break;}else{if(!_87||_87.overlap.getArea()<dd.overlap.getArea()){_87=dd;}}}}return _87;};this.refreshCache=function(_88){for(var _89 in _88){if("string"!=typeof _89){continue;}for(var i in this.ids[_89]){var oDD=this.ids[_89][i];if(this.isTypeOfDD(oDD)){var loc=this.getLocation(oDD);if(loc){this.locationCache[oDD.id]=loc;}else{delete this.locationCache[oDD.id];}}}}};this.verifyEl=function(el){try{if(el){var _91=el.offsetParent;if(_91){return true;}}}catch(e){}return false;};this.getLocation=function(oDD){if(!this.isTypeOfDD(oDD)){return null;}var el=oDD.getEl(),pos,x1,x2,y1,y2,t,r,b,l;try{pos=YAHOO.util.Dom.getXY(el);}catch(e){}if(!pos){return null;}x1=pos[0];x2=x1+el.offsetWidth;y1=pos[1];y2=y1+el.offsetHeight;t=y1-oDD.padding[0];r=x2+oDD.padding[1];b=y2+oDD.padding[2];l=x1-oDD.padding[3];return new YAHOO.util.Region(t,r,b,l);};this.isOverTarget=function(pt,_92,_93){var loc=this.locationCache[_92.id];if(!loc||!this.useCache){loc=this.getLocation(_92);this.locationCache[_92.id]=loc;}if(!loc){return false;}_92.cursorIsOver=loc.contains(pt);var dc=this.dragCurrent;if(!dc||!dc.getTargetCoord||(!_93&&!dc.constrainX&&!dc.constrainY)){return _92.cursorIsOver;}_92.overlap=null;var pos=dc.getTargetCoord(pt.x,pt.y);var el=dc.getDragEl();var _94=new YAHOO.util.Region(pos.y,pos.x+el.offsetWidth,pos.y+el.offsetHeight,pos.x);var _95=_94.intersect(loc);if(_95){_92.overlap=_95;return (_93)?true:_92.cursorIsOver;}else{return false;}};this._onUnload=function(e,me){this.unregAll();};this.unregAll=function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}this._execOnAll("unreg",[]);for(i in this.elementCache){delete this.elementCache[i];}this.elementCache={};this.ids={};};this.elementCache={};this.getElWrapper=function(id){var _97=this.elementCache[id];if(!_97||!_97.el){_97=this.elementCache[id]=new this.ElementWrapper(YAHOO.util.Dom.get(id));}return _97;};this.getElement=function(id){return YAHOO.util.Dom.get(id);};this.getCss=function(id){var el=YAHOO.util.Dom.get(id);return (el)?el.style:null;};this.ElementWrapper=function(el){this.el=el||null;this.id=this.el&&el.id;this.css=this.el&&el.style;};this.getPosX=function(el){return YAHOO.util.Dom.getX(el);};this.getPosY=function(el){return YAHOO.util.Dom.getY(el);};this.swapNode=function(n1,n2){if(n1.swapNode){n1.swapNode(n2);}else{var p=n2.parentNode;var s=n2.nextSibling;if(s==n1){p.insertBefore(n1,n2);}else{if(n2==n1.nextSibling){p.insertBefore(n2,n1);}else{n1.parentNode.replaceChild(n2,n1);p.insertBefore(n1,s);}}}};this.getScroll=function(){var t,l;if(document.documentElement&&document.documentElement.scrollTop){t=document.documentElement.scrollTop;l=document.documentElement.scrollLeft;}else{if(document.body){t=document.body.scrollTop;l=document.body.scrollLeft;}}return {top:t,left:l};};this.getStyle=function(el,_102){return YAHOO.util.Dom.getStyle(el,_102);};this.getScrollTop=function(){return this.getScroll().top;};this.getScrollLeft=function(){return this.getScroll().left;};this.moveToEl=function(_103,_104){var _105=YAHOO.util.Dom.getXY(_104);YAHOO.util.Dom.setXY(_103,_105);};this.getClientHeight=function(){return YAHOO.util.Dom.getClientHeight();};this.getClientWidth=function(){return YAHOO.util.Dom.getClientWidth();};this.numericSort=function(a,b){return (a-b);};this._timeoutCount=0;this._addListeners=function(){var DDM=YAHOO.util.DDM;if(YAHOO.util.Event&&document){DDM._onLoad();}else{if(DDM._timeoutCount>2000){}else{setTimeout(DDM._addListeners,10);if(document&&document.body){DDM._timeoutCount+=1;}}}};this.handleWasClicked=function(node,id){if(this.isHandle(id,node.id)){return true;}else{var p=node.parentNode;while(p){if(this.isHandle(id,p.id)){return true;}else{p=p.parentNode;}}}return false;};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}YAHOO.util.DD=function(id,_109,_110){if(id){this.init(id,_109,_110);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop);YAHOO.util.DD.prototype.scroll=true;YAHOO.util.DD.prototype.autoOffset=function(_111,_112){var x=_111-this.startPageX;var y=_112-this.startPageY;this.setDelta(x,y);};YAHOO.util.DD.prototype.setDelta=function(_113,_114){this.deltaX=_113;this.deltaY=_114;};YAHOO.util.DD.prototype.setDragElPos=function(_115,_116){var el=this.getDragEl();this.alignElWithMouse(el,_115,_116);};YAHOO.util.DD.prototype.alignElWithMouse=function(el,_117,_118){var _119=this.getTargetCoord(_117,_118);if(!this.deltaSetXY){var _120=[_119.x,_119.y];YAHOO.util.Dom.setXY(el,_120);var _121=parseInt(YAHOO.util.Dom.getStyle(el,"left"),10);var _122=parseInt(YAHOO.util.Dom.getStyle(el,"top"),10);this.deltaSetXY=[_121-_119.x,_122-_119.y];}else{YAHOO.util.Dom.setStyle(el,"left",(_119.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(el,"top",(_119.y+this.deltaSetXY[1])+"px");}this.cachePosition(_119.x,_119.y);this.autoScroll(_119.x,_119.y,el.offsetHeight,el.offsetWidth);};YAHOO.util.DD.prototype.cachePosition=function(_123,_124){if(_123){this.lastPageX=_123;this.lastPageY=_124;}else{var _125=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=_125[0];this.lastPageY=_125[1];}};YAHOO.util.DD.prototype.autoScroll=function(x,y,h,w){if(this.scroll){var _128=this.DDM.getClientHeight();var _129=this.DDM.getClientWidth();var st=this.DDM.getScrollTop();var sl=this.DDM.getScrollLeft();var bot=h+y;var _133=w+x;var _134=(_128+st-y-this.deltaY);var _135=(_129+sl-x-this.deltaX);var _136=40;var _137=(document.all)?80:30;if(bot>_128&&_134<_136){window.scrollTo(sl,st+_137);}if(y<st&&st>0&&y-st<_136){window.scrollTo(sl,st-_137);}if(_133>_129&&_135<_136){window.scrollTo(sl+_137,st);}if(x<sl&&sl>0&&x-sl<_136){window.scrollTo(sl-_137,st);}}};YAHOO.util.DD.prototype.getTargetCoord=function(_138,_139){var x=_138-this.deltaX;var y=_139-this.deltaY;if(this.constrainX){if(x<this.minX){x=this.minX;}if(x>this.maxX){x=this.maxX;}}if(this.constrainY){if(y<this.minY){y=this.minY;}if(y>this.maxY){y=this.maxY;}}x=this.getTick(x,this.xTicks);y=this.getTick(y,this.yTicks);return {x:x,y:y};};YAHOO.util.DD.prototype.applyConfig=function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);};YAHOO.util.DD.prototype.b4MouseDown=function(e){this.autoOffset(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));};YAHOO.util.DD.prototype.b4Drag=function(e){this.setDragElPos(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));};YAHOO.util.DD.prototype.toString=function(){return ("DD "+this.id);};YAHOO.util.DDProxy=function(id,_140,_141){if(id){this.init(id,_140,_141);this.initFrame();}};YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD);YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.util.DDProxy.prototype.resizeFrame=true;YAHOO.util.DDProxy.prototype.centerFrame=false;YAHOO.util.DDProxy.prototype.createFrame=function(){var self=this;var body=document.body;if(!body||!body.firstChild){setTimeout(function(){self.createFrame();},50);return;}var div=this.getDragEl();if(!div){div=document.createElement("div");div.id=this.dragElId;var s=div.style;s.position="absolute";s.visibility="hidden";s.cursor="move";s.border="2px solid #aaa";s.zIndex=999;body.insertBefore(div,body.firstChild);}};YAHOO.util.DDProxy.prototype.initFrame=function(){this.createFrame();};YAHOO.util.DDProxy.prototype.applyConfig=function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);};YAHOO.util.DDProxy.prototype.showFrame=function(_145,_146){var el=this.getEl();var _147=this.getDragEl();var s=_147.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(s.width,10)/2),Math.round(parseInt(s.height,10)/2));}this.setDragElPos(_145,_146);YAHOO.util.Dom.setStyle(_147,"visibility","visible");};YAHOO.util.DDProxy.prototype._resizeProxy=function(){if(this.resizeFrame){var DOM=YAHOO.util.Dom;var el=this.getEl();var _149=this.getDragEl();var bt=parseInt(DOM.getStyle(_149,"borderTopWidth"),10);var br=parseInt(DOM.getStyle(_149,"borderRightWidth"),10);var bb=parseInt(DOM.getStyle(_149,"borderBottomWidth"),10);var bl=parseInt(DOM.getStyle(_149,"borderLeftWidth"),10);if(isNaN(bt)){bt=0;}if(isNaN(br)){br=0;}if(isNaN(bb)){bb=0;}if(isNaN(bl)){bl=0;}var _154=Math.max(0,el.offsetWidth-br-bl);var _155=Math.max(0,el.offsetHeight-bt-bb);DOM.setStyle(_149,"width",_154+"px");DOM.setStyle(_149,"height",_155+"px");}};YAHOO.util.DDProxy.prototype.b4MouseDown=function(e){var x=YAHOO.util.Event.getPageX(e);var y=YAHOO.util.Event.getPageY(e);this.autoOffset(x,y);this.setDragElPos(x,y);};YAHOO.util.DDProxy.prototype.b4StartDrag=function(x,y){this.showFrame(x,y);};YAHOO.util.DDProxy.prototype.b4EndDrag=function(e){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");};YAHOO.util.DDProxy.prototype.endDrag=function(e){var DOM=YAHOO.util.Dom;var lel=this.getEl();var del=this.getDragEl();DOM.setStyle(del,"visibility","");DOM.setStyle(lel,"visibility","hidden");YAHOO.util.DDM.moveToEl(lel,del);DOM.setStyle(del,"visibility","hidden");DOM.setStyle(lel,"visibility","");};YAHOO.util.DDProxy.prototype.toString=function(){return ("DDProxy "+this.id);};YAHOO.util.DDTarget=function(id,_158,_159){if(id){this.initTarget(id,_158,_159);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop);YAHOO.util.DDTarget.prototype.toString=function(){return ("DDTarget "+this.id);};

/* Copyright (c) 2006, Yahoo! Inc. All rights reserved.  Code licensed under the BSD License: http://developer.yahoo.net/yui/license.txt Version: 0.11.3 */
YAHOO.util.Connect={_msxml_progid:['MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'],_http_header:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:'application/x-www-form-urlencoded',_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,setProgId:function(id)
{this._msxml_progid.unshift(id);},setDefaultPostHeader:function(b)
{this._use_default_post_header=b;},setPollingInterval:function(i)
{if(typeof i=='number'&&isFinite(i)){this._polling_interval=i;}},createXhrObject:function(transactionId)
{var obj,http;try
{http=new XMLHttpRequest();obj={conn:http,tId:transactionId};}
catch(e)
{for(var i=0;i<this._msxml_progid.length;++i){try
{http=new ActiveXObject(this._msxml_progid[i]);obj={conn:http,tId:transactionId};break;}
catch(e){}}}
finally
{return obj;}},getConnectionObject:function()
{var o;var tId=this._transaction_id;try
{o=this.createXhrObject(tId);if(o){this._transaction_id++;}}
catch(e){}
finally
{return o;}},asyncRequest:function(method,uri,callback,postData)
{var o=this.getConnectionObject();if(!o){return null;}
else{if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(o.tId,callback,uri);this.releaseObject(o);return;}
if(method=='GET'){uri+="?"+this._sFormData;}
else if(method=='POST'){postData=(postData?this._sFormData+"&"+postData:this._sFormData);}
this._sFormData='';}
o.conn.open(method,uri,true);if(this._isFormSubmit||(postData&&this._use_default_post_header)){this.initHeader('Content-Type',this._default_post_header);if(this._isFormSubmit){this._isFormSubmit=false;}}
if(this._has_http_headers){this.setHeader(o);}
this.handleReadyState(o,callback);o.conn.send(postData?postData:null);return o;}},handleReadyState:function(o,callback)
{var oConn=this;if(callback&&callback.timeout){this._timeOut[o.tId]=window.setTimeout(function(){oConn.abort(o,callback,true);},callback.timeout);}
this._poll[o.tId]=window.setInterval(function(){if(o.conn&&o.conn.readyState==4){window.clearInterval(oConn._poll[o.tId]);delete oConn._poll[o.tId];if(callback&&callback.timeout){delete oConn._timeOut[o.tId];}
oConn.handleTransactionResponse(o,callback);}},this._polling_interval);},handleTransactionResponse:function(o,callback,isAbort)
{if(!callback){this.releaseObject(o);return;}
var httpStatus,responseObject;try
{if(o.conn.status!==undefined&&o.conn.status!=0){httpStatus=o.conn.status;}
else{httpStatus=13030;}}
catch(e){httpStatus=13030;}
if(httpStatus>=200&&httpStatus<300){try
{responseObject=this.createResponseObject(o,callback.argument);if(callback.success){if(!callback.scope){callback.success(responseObject);}
else{callback.success.apply(callback.scope,[responseObject]);}}}
catch(e){}}
else{try
{switch(httpStatus){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:responseObject=this.createExceptionObject(o.tId,callback.argument,(isAbort?isAbort:false));if(callback.failure){if(!callback.scope){callback.failure(responseObject);}
else{callback.failure.apply(callback.scope,[responseObject]);}}
break;default:responseObject=this.createResponseObject(o,callback.argument);if(callback.failure){if(!callback.scope){callback.failure(responseObject);}
else{callback.failure.apply(callback.scope,[responseObject]);}}}}
catch(e){}}
this.releaseObject(o);responseObject=null;},createResponseObject:function(o,callbackArg)
{var obj={};var headerObj={};try
{var headerStr=o.conn.getAllResponseHeaders();var header=headerStr.split('\n');for(var i=0;i<header.length;i++){var delimitPos=header[i].indexOf(':');if(delimitPos!=-1){headerObj[header[i].substring(0,delimitPos)]=header[i].substring(delimitPos+2);}}}
catch(e){}
obj.tId=o.tId;obj.status=o.conn.status;obj.statusText=o.conn.statusText;obj.getResponseHeader=headerObj;obj.getAllResponseHeaders=headerStr;obj.responseText=o.conn.responseText;obj.responseXML=o.conn.responseXML;if(typeof callbackArg!==undefined){obj.argument=callbackArg;}
return obj;},createExceptionObject:function(tId,callbackArg,isAbort)
{var COMM_CODE=0;var COMM_ERROR='communication failure';var ABORT_CODE=-1;var ABORT_ERROR='transaction aborted';var obj={};obj.tId=tId;if(isAbort){obj.status=ABORT_CODE;obj.statusText=ABORT_ERROR;}
else{obj.status=COMM_CODE;obj.statusText=COMM_ERROR;}
if(callbackArg){obj.argument=callbackArg;}
return obj;},initHeader:function(label,value)
{if(this._http_header[label]===undefined){this._http_header[label]=value;}
else{this._http_header[label]=value+","+this._http_header[label];}
this._has_http_headers=true;},setHeader:function(o)
{for(var prop in this._http_header){if(this._http_header.hasOwnProperty(prop)){o.conn.setRequestHeader(prop,this._http_header[prop]);}}
delete this._http_header;this._http_header={};this._has_http_headers=false;},setForm:function(formId,isUpload,secureUri)
{this._sFormData='';if(typeof formId=='string'){var oForm=(document.getElementById(formId)||document.forms[formId]);}
else if(typeof formId=='object'){var oForm=formId;}
else{return;}
if(isUpload){this.createFrame(secureUri?secureUri:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=oForm;return;}
var oElement,oName,oValue,oDisabled;var hasSubmit=false;for(var i=0;i<oForm.elements.length;i++){oElement=oForm.elements[i];oDisabled=oForm.elements[i].disabled;oName=oForm.elements[i].name;oValue=oForm.elements[i].value;if(!oDisabled&&oName)
{switch(oElement.type)
{case'select-one':case'select-multiple':for(var j=0;j<oElement.options.length;j++){if(oElement.options[j].selected){if(window.ActiveXObject){this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oElement.options[j].attributes['value'].specified?oElement.options[j].value:oElement.options[j].text)+'&';}
else{this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oElement.options[j].hasAttribute('value')?oElement.options[j].value:oElement.options[j].text)+'&';}}}
break;case'radio':case'checkbox':if(oElement.checked){this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oValue)+'&';}
break;case'file':case undefined:case'reset':case'button':break;case'submit':if(hasSubmit==false){this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oValue)+'&';hasSubmit=true;}
break;default:this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oValue)+'&';break;}}}
this._isFormSubmit=true;this._sFormData=this._sFormData.substr(0,this._sFormData.length-1);},createFrame:function(secureUri){var frameId='yuiIO'+this._transaction_id;if(window.ActiveXObject){var io=document.createElement('<IFRAME id="'+frameId+'" name="'+frameId+'">');if(typeof secureUri=='boolean'){io.src='javascript:false';}
else{io.src=secureUri;}}
else{var io=document.createElement('IFRAME');io.id=frameId;io.name=frameId;}
io.style.position='absolute';io.style.top='-1000px';io.style.left='-1000px';document.body.appendChild(io);},uploadFile:function(id,callback,uri){var frameId='yuiIO'+id;var io=document.getElementById(frameId);this._formNode.action=uri;this._formNode.enctype='multipart/form-data';this._formNode.method='POST';this._formNode.target=frameId;this._formNode.submit();this._formNode=null;this._isFileUpload=false;this._isFormSubmit=false;var uploadCallback=function()
{var obj={};obj.tId=id;obj.responseText=io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;obj.responseXML=io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;obj.argument=callback.argument;if(callback.upload){if(!callback.scope){callback.upload(obj);}
else{callback.upload.apply(callback.scope,[obj]);}}
if(YAHOO.util.Event){YAHOO.util.Event.removeListener(io,"load",uploadCallback);}
else if(window.ActiveXObject){io.detachEvent('onload',uploadCallback);}
else{io.removeEventListener('load',uploadCallback,false);}
setTimeout(function(){document.body.removeChild(io);},100);};if(YAHOO.util.Event){YAHOO.util.Event.addListener(io,"load",uploadCallback);}
else if(window.ActiveXObject){io.attachEvent('onload',uploadCallback);}
else{io.addEventListener('load',uploadCallback,false);}},abort:function(o,callback,isTimeout)
{if(this.isCallInProgress(o)){o.conn.abort();window.clearInterval(this._poll[o.tId]);delete this._poll[o.tId];if(isTimeout){delete this._timeOut[o.tId];}
this.handleTransactionResponse(o,callback,true);return true;}
else{return false;}},isCallInProgress:function(o)
{if(o.conn){return o.conn.readyState!=4&&o.conn.readyState!=0;}
else{return false;}},releaseObject:function(o)
{o.conn=null;o=null;}};


/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 *
 * This code is licensed under BSD license.
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.namespace('ext');YAHOO.namespace('ext.util');YAHOO.ext.Strict=(document.compatMode=='CSS1Compat');Function.prototype.createCallback=function(){var args=arguments;var method=this;return function(){return method.apply(window,args);}};Function.prototype.createDelegate=function(obj,args,appendArgs){var method=this;return function(){var callargs=args||arguments;if(appendArgs){callargs=Array.prototype.concat.apply(arguments,args);}
return method.apply(obj||window,callargs);}};Function.prototype.createSequence=function(fcn,scope){if(typeof fcn!='function'){return this;}
var method=this;return function(){var retval=method.apply(this||window,arguments);fcn.apply(scope||this||window,arguments);return retval;}};Function.prototype.createInterceptor=function(fcn,scope){if(typeof fcn!='function'){return this;}
var method=this;return function(){fcn.target=this;fcn.method=method;if(fcn.apply(scope||this||window,arguments)===false)
return;return method.apply(this||window,arguments);;}};YAHOO.ext.util.Browser=new function(){var ua=navigator.userAgent.toLowerCase();this.isOpera=(ua.indexOf('opera')>-1);this.isSafari=(ua.indexOf('webkit')>-1);this.isIE=(window.ActiveXObject);this.isIE7=(ua.indexOf('msie 7')>-1);this.isGecko=!this.isSafari&&(ua.indexOf('gecko')>-1);}();YAHOO.util.CustomEvent.prototype.fireDirect=function(){var len=this.subscribers.length;for(var i=0;i<len;++i){var s=this.subscribers[i];if(s){var scope=(s.override)?s.obj:this.scope;if(s.fn.apply(scope,arguments)===false){return false;}}}
return true;};YAHOO.extendX=function(subclass,superclass,overrides){YAHOO.extend(subclass,superclass);subclass.override=function(o){YAHOO.override(subclass,o);};subclass.prototype.override=function(o){for(var method in o){this[method]=o[method];}};if(overrides){subclass.override(overrides);}};YAHOO.override=function(origclass,overrides){if(overrides){var p=origclass.prototype;for(var method in overrides){p[method]=overrides[method];}}};YAHOO.ext.util.Bench=function(){this.timers={};this.lastKey=null;};YAHOO.ext.util.Bench.prototype={start:function(key){this.lastKey=key;this.timers[key]={};this.timers[key].startTime=new Date().getTime();},stop:function(key){key=key||this.lastKey;this.timers[key].endTime=new Date().getTime();},getElapsed:function(key){key=key||this.lastKey;return this.timers[key].endTime-this.timers[key].startTime;},toString:function(html){var results="Results: \n";for(var key in this.timers){if(typeof this.timers[key]!='function'){results+=key+":\t"+(this.getElapsed(key)/1000)+" seconds\n";}}
if(html){results=results.replace("\n",'<br>');}
return results;},show:function(){alert(this.toString());}};YAHOO.ext.util.DelayedTask=function(fn,scope,args){var timeoutId=null;this.delay=function(delay,newFn,newScope,newArgs){if(timeoutId){clearTimeout(timeoutId);}
fn=newFn||fn;scope=newScope||scope;args=newArgs||args;timeoutId=setTimeout(fn.createDelegate(scope,args),delay);};this.cancel=function(){if(timeoutId){clearTimeout(timeoutId);timeoutId=null;}};};YAHOO.ext.util.Observable=function(){};YAHOO.ext.util.Observable.prototype={fireEvent:function(){var ce=this.events[arguments[0].toLowerCase()];ce.fireDirect.apply(ce,Array.prototype.slice.call(arguments,1));},addListener:function(eventName,fn,scope,override){eventName=eventName.toLowerCase();if(!this.events[eventName]){throw'You are trying to listen for an event that does not exist: "'+eventName+'".';}
this.events[eventName].subscribe(fn,scope,override);},delayedListener:function(eventName,fn,scope,delay){var newFn=function(){setTimeout(fn.createDelegate(scope,arguments),delay||1);}
this.addListener(eventName,newFn);return newFn;},removeListener:function(eventName,fn,scope){this.events[eventName.toLowerCase()].unsubscribe(fn,scope);}};YAHOO.ext.util.Observable.prototype.on=YAHOO.ext.util.Observable.prototype.addListener;YAHOO.ext.util.Config={apply:function(obj,config){if(config){for(var prop in config){obj[prop]=config[prop];}}}};YAHOO.ext.util.CSS=new function(){var rules=null;var toCamel=function(property){var convert=function(prop){var test=/(-[a-z])/i.exec(prop);return prop.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());};while(property.indexOf('-')>-1){property=convert(property);}
return property;};this.getRules=function(refreshCache){if(rules==null||refreshCache){rules={};var ds=document.styleSheets;for(var i=0,len=ds.length;i<len;i++){try{var ss=ds[i];var ssRules=ss.cssRules||ss.rules;for(var j=ssRules.length-1;j>=0;--j){rules[ssRules[j].selectorText]=ssRules[j];}}catch(e){}}}
return rules;};this.getRule=function(selector,refreshCache){var rs=this.getRules(refreshCache);if(!(selector instanceof Array)){return rs[selector];}
for(var i=0;i<selector.length;i++){if(rs[selector[i]]){return rs[selector[i]];}}
return null;};this.updateRule=function(selector,property,value){if(!(selector instanceof Array)){var rule=this.getRule(selector);if(rule){rule.style[property]=value;return true;}}else{for(var i=0;i<selector.length;i++){if(this.updateRule(selector[i],property,value)){return true;}}}
return false;};this.apply=function(el,selector){if(!(selector instanceof Array)){var rule=this.getRule(selector);if(rule){var s=rule.style;for(var key in s){if(typeof s[key]!='function'){if(s[key]&&String(s[key]).indexOf(':')<0&&s[key]!='false'){try{el.style[key]=s[key];}catch(e){}}}}
return true;}}else{for(var i=0;i<selector.length;i++){if(this.apply(el,selector[i])){return true;}}}
return false;};this.applyFirst=function(el,id,selector){var selectors=['#'+id+' '+selector,selector];return this.apply(el,selectors);};this.revert=function(el,selector){if(!(selector instanceof Array)){var rule=this.getRule(selector);if(rule){for(key in rule.style){if(rule.style[key]&&String(rule.style[key]).indexOf(':')<0&&rule.style[key]!='false'){try{el.style[key]='';}catch(e){}}}
return true;}}else{for(var i=0;i<selector.length;i++){if(this.revert(el,selector[i])){return true;}}}
return false;};this.revertFirst=function(el,id,selector){var selectors=['#'+id+' '+selector,selector];return this.revert(el,selectors);};}();Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(format){if(Date.formatFunctions[format]==null){Date.createNewFormat(format);}
var func=Date.formatFunctions[format];return this[func]();};Date.prototype.format=Date.prototype.dateFormat;Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function(){return ";var special=false;var ch='';for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}
else if(special){special=false;code+="'"+String.escape(ch)+"' + ";}
else{code+=Date.getFormatCode(ch);}}
eval(code.substring(0,code.length-3)+";}");};Date.getFormatCode=function(character){switch(character){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(character)+"' + ";};};Date.parseDate=function(input,format){if(Date.parseFunctions[format]==null){Date.createParser(format);}
var func=Date.parseFunctions[format];return Date[func](input);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input){\n"
+"var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n"
+"var d = new Date();\n"
+"y = d.getFullYear();\n"
+"m = d.getMonth();\n"
+"d = d.getDate();\n"
+"var results = input.match(Date.parseRegexes["+regexNum+"]);\n"
+"if (results && results.length > 0) {"
var regex="";var special=false;var ch='';for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}
else if(special){special=false;regex+=String.escape(ch);}
else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}
code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
+"{return new Date(y, m, d, h, i, s);}\n"
+"else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
+"{return new Date(y, m, d, h, i);}\n"
+"else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
+"{return new Date(y, m, d, h);}\n"
+"else if (y > 0 && m >= 0 && d > 0)\n"
+"{return new Date(y, m, d);}\n"
+"else if (y > 0 && m >= 0)\n"
+"{return new Date(y, m);}\n"
+"else if (y > 0)\n"
+"{return new Date(y);}\n"
+"}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$");eval(code);};Date.formatCodeToRegex=function(character,currentGroup){switch(character){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+currentGroup+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:0,c:null,s:"(?:\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+currentGroup+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+currentGroup+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+currentGroup+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+currentGroup+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+currentGroup+"], 10);\n"
+"y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+currentGroup+"] == 'am') {\n"
+"if (h == 12) { h = 0; }\n"
+"} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+currentGroup+"] == 'AM') {\n"
+"if (h == 12) { h = 0; }\n"
+"} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+currentGroup+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+currentGroup+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+currentGroup+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(character)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")
+String.leftPad(Math.floor(this.getTimezoneOffset()/60),2,"0")
+String.leftPad(this.getTimezoneOffset()%60,2,"0");};Date.prototype.getDayOfYear=function(){var num=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var i=0;i<this.getMonth();++i){num+=Date.daysInMonth[i];}
return num+this.getDate()-1;};Date.prototype.getWeekOfYear=function(){var now=this.getDayOfYear()+(4-this.getDay());var jan1=new Date(this.getFullYear(),0,1);var then=(7-jan1.getDay()+4);document.write(then);return String.leftPad(((now-then)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var year=this.getFullYear();return((year&3)==0&&(year%100||(year%400==0&&year)));};Date.prototype.getFirstDayOfMonth=function(){var day=(this.getDay()-(this.getDate()-1))%7;return(day<0)?(day+7):day;};Date.prototype.getLastDayOfMonth=function(){var day=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(day<0)?(day+7):day;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};if(!String.escape){String.escape=function(string){return string.replace(/('|\\)/g,"\\$1");};};String.leftPad=function(val,size,ch){var result=new String(val);if(ch==null){ch=" ";}
while(result.length<size){result=ch+result;}
return result;};if(!Object.dump){Object.dump=function(o){var s="\n{";for(var k in o){if(typeof o[k]!='function'){s+="\n\t"+k+': '+o[k]+',';}}
if(s.length>3){s=s.substring(0,s.length-1);}
s+="\n}";return s;}}
Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};

YAHOO.ext.DomHelper=new function(){var d=document;this.useDom=false;function applyStyles(el,styles){if(styles){var D=YAHOO.util.Dom;var re=/\s?(.*?)\:(.*?);/g;var matches;while((matches=re.exec(styles))!=null){D.setStyle(el,matches[1],matches[2]);}}}
function createHtml(o){var b='';b+='<'+o.tag;for(var attr in o){if(attr=='tag'||attr=='children'||attr=='html'||typeof o[attr]=='function')continue;if(attr=='cls'){b+=' class="'+o['cls']+'"';}else{b+=' '+attr+'="'+o[attr]+'"';}}
b+='>';if(o.children){for(var i=0,len=o.children.length;i<len;i++){b+=createHtml(o.children[i],b);}}
if(o.html){b+=o.html;}
b+='</'+o.tag+'>';return b;}
function createDom(o,parentNode){var el=d.createElement(o.tag);var useSet=el.setAttribute?true:false;for(var attr in o){if(attr=='tag'||attr=='children'||attr=='html'||attr=='style'||typeof o[attr]=='function')continue;if(attr=='cls'){el.className=o['cls'];}else{if(useSet)el.setAttribute(attr,o[attr]);else el[attr]=o[attr];}}
applyStyles(el,o.style);if(o.children){for(var i=0,len=o.children.length;i<len;i++){createDom(o.children[i],el);}}
if(o.html){el.innerHTML=o.html;}
if(parentNode){parentNode.appendChild(el);}
return el;}
this.insertHtml=function(where,el,html){if(el.insertAdjacentHTML){if(where=='beforeBegin'){el.insertAdjacentHTML(where,html);return el.previousSibling;}else if(where=='afterBegin'){el.insertAdjacentHTML(where,html);return el.firstChild;}else if(where=='beforeEnd'){el.insertAdjacentHTML(where,html);return el.lastChild;}else if(where=='afterEnd'){el.insertAdjacentHTML(where,html);return el.nextSibling;}
throw'Illegal insertion point -> "'+where+'"';}
var range=el.ownerDocument.createRange();var frag;if(where=='beforeBegin'){range.setStartBefore(el);frag=range.createContextualFragment(html);el.parentNode.insertBefore(frag,el);return el.previousSibling;}else if(where=='afterBegin'){range.selectNodeContents(el);range.collapse(true);frag=range.createContextualFragment(html);el.insertBefore(frag,el.firstChild);return el.firstChild;}else if(where=='beforeEnd'){range.selectNodeContents(el);range.collapse(false);frag=range.createContextualFragment(html);el.appendChild(frag);return el.lastChild;}else if(where=='afterEnd'){range.setStartAfter(el);frag=range.createContextualFragment(html);el.parentNode.insertBefore(frag,el.nextSibling);return el.nextSibling;}else{throw'Illegal insertion point -> "'+where+'"';}};this.insertBefore=function(el,o,returnElement){el=YAHOO.util.Dom.get(el);var newNode;if(this.useDom){newNode=createDom(o,null);el.parentNode.insertBefore(newNode,el);}else{var html=createHtml(o);newNode=this.insertHtml('beforeBegin',el,html);}
return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;};this.insertAfter=function(el,o,returnElement){el=YAHOO.util.Dom.get(el);var newNode;if(this.useDom){newNode=createDom(o,null);el.parentNode.insertBefore(newNode,el.nextSibling);}else{var html=createHtml(o);newNode=this.insertHtml('afterEnd',el,html);}
return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;};this.append=function(el,o,returnElement){el=YAHOO.util.Dom.get(el);var newNode;if(this.useDom){newNode=createDom(o,null);el.appendChild(newNode);}else{var html=createHtml(o);newNode=this.insertHtml('beforeEnd',el,html);}
return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;};this.overwrite=function(el,o,returnElement){el=YAHOO.util.Dom.get(el);el.innerHTML=createHtml(o);return returnElement?YAHOO.ext.Element.get(el.firstChild,true):el.firstChild;};this.createTemplate=function(o){var html=createHtml(o);return new YAHOO.ext.DomHelper.Template(html);};}();YAHOO.ext.DomHelper.Template=function(html){this.html=html;this.re=/\{(\w+)\}/g;};YAHOO.ext.DomHelper.Template.prototype={applyTemplate:function(values){if(this.compiled){return this.compiled(values);}
var empty='';var fn=function(match,index){if(typeof values[index]!='undefined'){return values[index];}else{return empty;}}
return this.html.replace(this.re,fn);},compile:function(){var html=this.html;var re=/\{(\w+)\}/g;var body=[];body.push("this.compiled = function(values){ return ");var result;var lastMatchEnd=0;while((result=re.exec(html))!=null){body.push("'",html.substring(lastMatchEnd,result.index),"' + ");body.push("values[",html.substring(result.index+1,re.lastIndex-1),"] + ");lastMatchEnd=re.lastIndex;}
body.push("'",html.substr(lastMatchEnd),"';};");eval(body.join(''));},insertBefore:function(el,values,returnElement){el=YAHOO.util.Dom.get(el);var newNode=YAHOO.ext.DomHelper.insertHtml('beforeBegin',el,this.applyTemplate(values));return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;},insertAfter:function(el,values,returnElement){el=YAHOO.util.Dom.get(el);var newNode=YAHOO.ext.DomHelper.insertHtml('afterEnd',el,this.applyTemplate(values));return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;},append:function(el,values,returnElement){el=YAHOO.util.Dom.get(el);var newNode=YAHOO.ext.DomHelper.insertHtml('beforeEnd',el,this.applyTemplate(values));return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;},overwrite:function(el,values,returnElement){el=YAHOO.util.Dom.get(el);el.innerHTML='';var newNode=YAHOO.ext.DomHelper.insertHtml('beforeEnd',el,this.applyTemplate(values));return returnElement?YAHOO.ext.Element.get(newNode,true):newNode;}};

YAHOO.ext.Element=function(elementId,forceNew){var dom=YAHOO.util.Dom.get(elementId);if(!dom){return;}
if(!forceNew&&YAHOO.ext.Element.cache[dom.id]){return YAHOO.ext.Element.cache[dom.id];}
this.dom=dom;this.id=this.dom.id;this.visibilityMode=YAHOO.ext.Element.VISIBILITY;this.originalDisplay=YAHOO.util.Dom.getStyle(this.dom,'display');if(!this.originalDisplay||this.originalDisplay=='none'){this.originalDisplay='';}
this.defaultUnit='px';this.originalClip=YAHOO.util.Dom.getStyle(this.dom,'overflow');this.onVisibilityChanged=new YAHOO.util.CustomEvent('visibilityChanged');this.onMoved=new YAHOO.util.CustomEvent('moved');this.onResized=new YAHOO.util.CustomEvent('resized');this.visibilityDelegate=this.fireVisibilityChanged.createDelegate(this);this.resizedDelegate=this.fireResized.createDelegate(this);this.movedDelegate=this.fireMoved.createDelegate(this);}
YAHOO.ext.Element.prototype={fireMoved:function(){this.onMoved.fireDirect(this,this.getX(),this.getY());},fireVisibilityChanged:function(){this.onVisibilityChanged.fireDirect(this,this.isVisible());},fireResized:function(){this.onResized.fireDirect(this,this.getWidth(),this.getHeight());},setVisibilityMode:function(visMode){this.visibilityMode=visMode;},enableDisplayMode:function(){this.setVisibilityMode(YAHOO.ext.Element.DISPLAY)},animate:function(args,duration,onComplete,easing,animType){this.anim(args,duration,onComplete,easing,animType);},anim:function(args,duration,onComplete,easing,animType){animType=animType||YAHOO.util.Anim;var anim=new animType(this.dom,args,duration||.35,easing||YAHOO.util.Easing.easeBoth);if(onComplete){if(!(onComplete instanceof Array)){anim.onComplete.subscribe(onComplete);}else{for(var i=0;i<onComplete.length;i++){var fn=onComplete[i];if(fn)anim.onComplete.subscribe(fn);}}}
anim.animate();},isVisible:function(deep){var vis=YAHOO.util.Dom.getStyle(this.dom,'visibility')!='hidden'&&YAHOO.util.Dom.getStyle(this.dom,'display')!='none';if(!deep||!vis){return vis;}
var p=this.dom.parentNode;while(p&&p.tagName.toLowerCase()!='body'){if(YAHOO.util.Dom.getStyle(p,'visibility')=='hidden'||YAHOO.util.Dom.getStyle(p,'display')=='none'){return false;}
p=p.parentNode;}
return true;},setVisible:function(visible,animate,duration,onComplete,easing){if(!animate||!YAHOO.util.Anim){if(this.visibilityMode==YAHOO.ext.Element.DISPLAY){this.setDisplayed(visible);}else{YAHOO.util.Dom.setStyle(this.dom,'visibility',visible?'visible':'hidden');}
this.fireVisibilityChanged();}else{YAHOO.util.Dom.setStyle(this.dom,'visibility','visible');if(this.visibilityMode==YAHOO.ext.Element.DISPLAY){this.setDisplayed(true);}
var args={opacity:{from:(visible?0:1),to:(visible?1:0)}};var anim=new YAHOO.util.Anim(this.dom,args,duration||.35,easing||(visible?YAHOO.util.Easing.easeIn:YAHOO.util.Easing.easeOut));anim.onComplete.subscribe((function(){if(this.visibilityMode==YAHOO.ext.Element.DISPLAY){this.setDisplayed(visible);}else{YAHOO.util.Dom.setStyle(this.dom,'visibility',visible?'visible':'hidden');}
this.fireVisibilityChanged();}).createDelegate(this));if(onComplete){anim.onComplete.subscribe(onComplete);}
anim.animate();}},isDisplayed:function(){return YAHOO.util.Dom.getStyle(this.dom,'display')!='none';},toggle:function(animate,duration,onComplete,easing){this.setVisible(!this.isVisible(),animate,duration,onComplete,easing);},setDisplayed:function(value){YAHOO.util.Dom.setStyle(this.dom,'display',value?this.originalDisplay:'none');},focus:function(){try{this.dom.focus();}catch(e){}},addClass:function(className){YAHOO.util.Dom.addClass(this.dom,className);},radioClass:function(className){var siblings=this.dom.parentNode.childNodes;for(var i=0;i<siblings.length;i++){var s=siblings[i];if(s.nodeType==1){YAHOO.util.Dom.removeClass(s,className);}}
YAHOO.util.Dom.addClass(this.dom,className);},removeClass:function(className){YAHOO.util.Dom.removeClass(this.dom,className);},toggleClass:function(className){if(YAHOO.util.Dom.hasClass(this.dom,className)){YAHOO.util.Dom.removeClass(this.dom,className);}else{YAHOO.util.Dom.addClass(this.dom,className);}},hasClass:function(className){return YAHOO.util.Dom.hasClass(this.dom,className);},replaceClass:function(oldClassName,newClassName){YAHOO.util.Dom.replaceClass(this.dom,oldClassName,newClassName);},getStyle:function(name){return YAHOO.util.Dom.getStyle(this.dom,name);},setStyle:function(name,value){YAHOO.util.Dom.setStyle(this.dom,name,value);},getX:function(){return YAHOO.util.Dom.getX(this.dom);},getY:function(){return YAHOO.util.Dom.getY(this.dom);},getXY:function(){return YAHOO.util.Dom.getXY(this.dom);},setX:function(x){YAHOO.util.Dom.setX(this.dom,x);this.fireMoved();},setY:function(y){YAHOO.util.Dom.setY(this.dom,y);this.fireMoved();},setLeft:function(left){YAHOO.util.Dom.setStyle(this.dom,'left',this.addUnits(left));this.fireMoved();},setTop:function(top){YAHOO.util.Dom.setStyle(this.dom,'top',this.addUnits(top));this.fireMoved();},setRight:function(right){YAHOO.util.Dom.setStyle(this.dom,'right',this.addUnits(right));this.fireMoved();},setBottom:function(bottom){YAHOO.util.Dom.setStyle(this.dom,'bottom',this.addUnits(bottom));this.fireMoved();},setXY:function(pos,animate,duration,onComplete,easing){if(!animate||!YAHOO.util.Anim){YAHOO.util.Dom.setXY(this.dom,pos);this.fireMoved();}else{this.anim({points:{to:pos}},duration,[onComplete,this.movedDelegate],easing,YAHOO.util.Motion);}},setLocation:function(x,y,animate,duration,onComplete,easing){this.setXY([x,y],animate,duration,onComplete,easing);},moveTo:function(x,y,animate,duration,onComplete,easing){this.setXY([x,y],animate,duration,onComplete,easing);},getRegion:function(){return YAHOO.util.Dom.getRegion(this.dom);},getHeight:function(){return this.dom.offsetHeight;},getWidth:function(){return this.dom.offsetWidth;},getSize:function(){return{width:this.getWidth(),height:this.getHeight()};},adjustWidth:function(width){if(this.autoBoxAdjust&&typeof width=='number'&&!this.isBorderBox()){width-=(this.getBorderWidth('lr')+this.getPadding('lr'));}
return width;},adjustHeight:function(height){if(this.autoBoxAdjust&&typeof height=='number'&&!this.isBorderBox()){height-=(this.getBorderWidth('tb')+this.getPadding('tb'));}
return height;},setWidth:function(width,animate,duration,onComplete,easing){width=this.adjustWidth(width);if(!animate||!YAHOO.util.Anim){YAHOO.util.Dom.setStyle(this.dom,'width',this.addUnits(width));this.fireResized();}else{this.anim({width:{to:width}},duration,[onComplete,this.resizedDelegate],easing||(width>this.getWidth()?YAHOO.util.Easing.easeOut:YAHOO.util.Easing.easeIn));}},setHeight:function(height,animate,duration,onComplete,easing){height=this.adjustHeight(height);if(!animate||!YAHOO.util.Anim){YAHOO.util.Dom.setStyle(this.dom,'height',this.addUnits(height));this.fireResized();}else{this.anim({height:{to:height}},duration,[onComplete,this.resizedDelegate],easing||(height>this.getHeight()?YAHOO.util.Easing.easeOut:YAHOO.util.Easing.easeIn));}},setSize:function(width,height,animate,duration,onComplete,easing){if(!animate||!YAHOO.util.Anim){this.setWidth(width);this.setHeight(height);this.fireResized();}else{width=this.adjustWidth(width);height=this.adjustHeight(height);this.anim({width:{to:width},height:{to:height}},duration,[onComplete,this.resizedDelegate],easing);}},setBounds:function(x,y,width,height,animate,duration,onComplete,easing){if(!animate||!YAHOO.util.Anim){this.setWidth(width);this.setHeight(height);this.setLocation(x,y);this.fireResized();this.fireMoved();}else{width=this.adjustWidth(width);height=this.adjustHeight(height);this.anim({points:{to:[x,y]},width:{to:width},height:{to:height}},duration,[onComplete,this.movedDelegate],easing,YAHOO.util.Motion);}},setRegion:function(region,animate,duration,onComplete,easing){this.setBounds(region.left,region.top,region.right-region.left,region.bottom-region.top,animate,duration,onComplete,easing);},addListener:function(eventName,handler,scope,override){YAHOO.util.Event.addListener(this.dom,eventName,handler,scope,override);},addHandler:function(eventName,stopPropagation,handler,scope,override){var fn=YAHOO.ext.Element.createStopHandler(stopPropagation,handler,scope,override);YAHOO.util.Event.addListener(this.dom,eventName,fn);},on:function(eventName,handler,scope,override){YAHOO.util.Event.addListener(this.dom,eventName,handler,scope,override);},addManagedListener:function(eventName,fn,scope,override){return YAHOO.ext.EventManager.on(this.dom,eventName,fn,scope,override);},mon:function(eventName,fn,scope,override){return YAHOO.ext.EventManager.on(this.dom,eventName,fn,scope,override);},removeListener:function(eventName,handler){YAHOO.util.Event.removeListener(this.dom,eventName,handler);},removeAllListeners:function(){YAHOO.util.Event.purgeElement(this.dom);},setOpacity:function(opacity,animate,duration,onComplete,easing){if(!animate||!YAHOO.util.Anim){YAHOO.util.Dom.setStyle(this.dom,'opacity',opacity);}else{this.anim({opacity:{to:opacity}},duration,onComplete,easing);}},getLeft:function(){return this.getX();},getRight:function(){return this.getX()+this.getWidth();},getTop:function(){return this.getY();},getBottom:function(){return this.getY()+this.getHeight();},setAbsolutePositioned:function(zIndex){this.setStyle('position','absolute');if(zIndex){this.setStyle('z-index',zIndex);}},setRelativePositioned:function(zIndex){this.setStyle('position','relative');if(zIndex){this.setStyle('z-index',zIndex);}},clearPositioning:function(){this.setStyle('position','');this.setStyle('left','');this.setStyle('right','');this.setStyle('top','');this.setStyle('bottom','');},getPositioning:function(){return{'position':this.getStyle('position'),'left':this.getStyle('left'),'right':this.getStyle('right'),'top':this.getStyle('top'),'bottom':this.getStyle('bottom')};},getBorderWidth:function(side){var width=0;var b=YAHOO.ext.Element.borders;for(var s in b){if(typeof b[s]!='function'){if(side.indexOf(s)!==-1){var w=parseInt(this.getStyle(b[s]),10);if(!isNaN(w))width+=w;}}}
return width;},getPadding:function(side){var pad=0;var b=YAHOO.ext.Element.paddings;for(var s in b){if(typeof s[b]!='function'){if(side.indexOf(s)!==-1){var w=parseInt(this.getStyle(b[s]),10);if(!isNaN(w))pad+=w;}}}
return pad;},setPositioning:function(positionCfg){this.setStyle('position',positionCfg.position);this.setStyle('left',positionCfg.left);this.setStyle('right',positionCfg.right);this.setStyle('top',positionCfg.top);this.setStyle('bottom',positionCfg.bottom);},move:function(direction,distance,animate,duration,onComplete,easing){var xy=this.getXY();direction=direction.toLowerCase();switch(direction){case'left':this.moveTo(xy[0]-distance,xy[1],animate,duration,onComplete,easing);return;case'right':this.moveTo(xy[0]+distance,xy[1],animate,duration,onComplete,easing);return;case'up':this.moveTo(xy[0],xy[1]-distance,animate,duration,onComplete,easing);return;case'down':this.moveTo(xy[0],xy[1]+distance,animate,duration,onComplete,easing);return;}},clip:function(){this.setStyle('overflow','hidden');},unclip:function(){this.setStyle('overflow',this.originalClip);},alignTo:function(element,position,offsets,animate,duration,onComplete,easing){var otherEl=getEl(element);if(!otherEl){return;}
offsets=offsets||[0,0];var r=otherEl.getRegion();position=position.toLowerCase();switch(position){case'bl':this.moveTo(r.left+offsets[0],r.bottom+offsets[1],animate,duration,onComplete,easing);return;case'br':this.moveTo(r.right+offsets[0],r.bottom+offsets[1],animate,duration,onComplete,easing);return;case'tl':this.moveTo(r.left+offsets[0],r.top+offsets[1],animate,duration,onComplete,easing);return;case'tr':this.moveTo(r.right+offsets[0],r.top+offsets[1],animate,duration,onComplete,easing);return;}},clearOpacity:function(){if(window.ActiveXObject){this.dom.style.filter='';}else{this.dom.style.opacity='';this.dom.style['-moz-opacity']='';this.dom.style['-khtml-opacity']='';}},hide:function(animate,duration,onComplete,easing){this.setVisible(false,animate,duration,onComplete,easing);},show:function(animate,duration,onComplete,easing){this.setVisible(true,animate,duration,onComplete,easing);},addUnits:function(size){if(typeof size=='number'||!YAHOO.ext.Element.unitPattern.test(size)){return size+this.defaultUnit;}
return size;},beginMeasure:function(){var p=this.dom;if(p.offsetWidth||p.offsetHeight){return;}
var changed=[];var p=this.dom;while(p&&p.tagName.toLowerCase()!='body'){if(YAHOO.util.Dom.getStyle(p,'display')=='none'){changed.push({el:p,visibility:YAHOO.util.Dom.getStyle(p,'visibility')});p.style.visibility='hidden';p.style.display='block';}
p=p.parentNode;}
this._measureChanged=changed;},endMeasure:function(){var changed=this._measureChanged;if(changed){for(var i=0,len=changed.length;i<len;i++){var r=changed[i];r.el.style.visibility=r.visibility;r.el.style.display='none';}
this._measureChanged=null;}},update:function(html,loadScripts){this.dom.innerHTML=html;if(!loadScripts)return;var dom=this.dom;var _parseScripts=function(){var s=this.dom.getElementsByTagName("script");var docHead=document.getElementsByTagName("head")[0];if(s.length==0){var re=/(?:<script.*(?:src=[\"\'](.*)[\"\']).*>.*<\/script>)|(?:<script.*>([\S\s]*?)<\/script>)/ig;var match;while(match=re.exec(html)){var s0=document.createElement("script");if(match[1])
s0.src=match[1];else if(match[2])
s0.text=match[2];else
continue;docHead.appendChild(s0);}}else{for(var i=0;i<s.length;i++){var s0=document.createElement("script");s0.type=s[i].type;if(s[i].text){s0.text=s[i].text;}else{s0.src=s[i].src;}
docHead.appendChild(s0);}}}
setTimeout(_parseScripts,10);},getUpdateManager:function(){if(!this.updateManager){this.updateManager=new YAHOO.ext.UpdateManager(this);}
return this.updateManager;},getCenterXY:function(offsetScroll){var centerX=Math.round((YAHOO.util.Dom.getViewportWidth()-this.getWidth())/2);var centerY=Math.round((YAHOO.util.Dom.getViewportHeight()-this.getHeight())/2);if(!offsetScroll){return[centerX,centerY];}else{var scrollX=document.documentElement.scrollLeft||document.body.scrollLeft||0;var scrollY=document.documentElement.scrollTop||document.body.scrollTop||0;return[centerX+scrollX,centerY+scrollY];}},getChildrenByTagName:function(tagName){var children=this.dom.getElementsByTagName(tagName);var len=children.length;var ce=[len];for(var i=0;i<len;++i){ce[i]=YAHOO.ext.Element.get(children[i],true);}
return ce;},getChildrenByClassName:function(className,tagName){var children=YAHOO.util.Dom.getElementsByClassName(className,tagName,this.dom);var len=children.length;var ce=[len];for(var i=0;i<len;++i){ce[i]=YAHOO.ext.Element.get(children[i],true);}
return ce;},isBorderBox:function(){var el=this.dom;var b=YAHOO.ext.util.Browser;var strict=YAHOO.ext.Strict;return((b.isIE&&!b.isIE7)||(b.isIE7&&!strict&&el.style.boxSizing!='content-box')||(b.isGecko&&YAHOO.util.Dom.getStyle(el,"-moz-box-sizing")=='border-box')||(!b.isSafari&&YAHOO.util.Dom.getStyle(el,"box-sizing")=='border-box'));},getBox:function(contentBox){var xy=this.getXY();var el=this.dom;var w=el.offsetWidth;var h=el.offsetHeight;if(!contentBox){return{x:xy[0],y:xy[1],width:w,height:h};}else{var l=this.getBorderWidth('l')+this.getPadding('l');var r=this.getBorderWidth('r')+this.getPadding('r');var t=this.getBorderWidth('t')+this.getPadding('t');var b=this.getBorderWidth('b')+this.getPadding('b');return{x:xy[0]+l,y:xy[1]+t,width:w-(l+r),height:h-(t+b)};}},setBox:function(box,adjust,animate,duration,onComplete,easing){var w=box.width,h=box.height;if((adjust&&!this.autoBoxAdjust)&&!this.isBorderBox()){w-=(this.getBorderWidth('lr')+this.getPadding('lr'));h-=(this.getBorderWidth('tb')+this.getPadding('tb'));}
this.setBounds(box.x,box.y,w,h,animate,duration,onComplete,easing);},repaint:function(){var dom=this.dom;YAHOO.util.Dom.addClass(dom,'yui-ext-repaint');setTimeout(function(){YAHOO.util.Dom.removeClass(dom,'yui-ext-repaint');},1);}};YAHOO.ext.Element.prototype.autoBoxAdjust=true;YAHOO.ext.Element.unitPattern=/\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;YAHOO.ext.Element.VISIBILITY=1;YAHOO.ext.Element.DISPLAY=2;YAHOO.ext.Element.borders={l:'border-left-width',r:'border-right-width',t:'border-top-width',b:'border-bottom-width'};YAHOO.ext.Element.paddings={l:'padding-left',r:'padding-right',t:'padding-top',b:'padding-bottom'};YAHOO.ext.Element.createStopHandler=function(stopPropagation,handler,scope,override){return function(e){if(e){if(stopPropagation){YAHOO.util.Event.stopEvent(e);}else{YAHOO.util.Event.preventDefault(e);}}
handler.call(override&&scope?scope:window,e,scope);};};YAHOO.ext.Element.cache={};YAHOO.ext.Element.get=function(el,autoGenerateId){if(!el){return null;}
if(el instanceof YAHOO.ext.Element){el.dom=YAHOO.util.Dom.get(el.id);YAHOO.ext.Element.cache[el.id]=el;return el;}
var key=el;if(typeof el!='string'){if(!el.id&&!autoGenerateId){return null;}
YAHOO.util.Dom.generateId(el,'elgen-');key=el.id;}
var element=YAHOO.ext.Element.cache[key];if(!element){element=new YAHOO.ext.Element(key);YAHOO.ext.Element.cache[key]=element;}else{element.dom=YAHOO.util.Dom.get(key);}
return element;};var getEl=YAHOO.ext.Element.get;YAHOO.util.Event.addListener(window,'unload',function(){YAHOO.ext.Element.cache=null;});

YAHOO.ext.EventManager=new function(){var docReadyEvent;var docReadyProcId;var docReadyState=false;this.ieDeferSrc="javascript:false";var fireDocReady=function(){if(!docReadyState){docReadyState=true;if(docReadyProcId){clearInterval(docReadyProcId);}
if(docReadyEvent){docReadyEvent.fire();}}};var initDocReady=function(){docReadyEvent=new YAHOO.util.CustomEvent('documentready');if(document.addEventListener){YAHOO.util.Event.on(document,"DOMContentLoaded",fireDocReady);}else if(YAHOO.ext.util.Browser.isIE){document.write('<s'+'cript id="ie-deferred-loader" defer="defer" src="'+
YAHOO.ext.EventManager.ieDeferSrc+'"></s'+'cript>');YAHOO.util.Event.on('ie-deferred-loader','readystatechange',function(){if(this.readyState=='complete'){fireDocReady();}});}else if(YAHOO.ext.util.Browser.isSafari){docReadyProcId=setInterval(function(){var rs=document.readyState;if(rs=='loaded'||rs=='complete'){fireDocReady();}},10);}
YAHOO.util.Event.on(window,'load',fireDocReady);};this.wrap=function(fn,scope,override){var wrappedFn=function(e){YAHOO.ext.EventObject.setEvent(e);fn.call(override?scope||window:window,YAHOO.ext.EventObject,scope);};return wrappedFn;};this.addListener=function(element,eventName,fn,scope,override){var wrappedFn=this.wrap(fn,scope,override);YAHOO.util.Event.addListener(element,eventName,wrappedFn);return wrappedFn;};this.removeListener=function(element,eventName,wrappedFn){return YAHOO.util.Event.removeListener(element,eventName,wrappedFn);};this.on=function(element,eventName,fn,scope,override){var wrappedFn=this.wrap(fn,scope,override);YAHOO.util.Event.addListener(element,eventName,wrappedFn);return wrappedFn;};this.onDocumentReady=function(fn,scope,override){if(!docReadyEvent){initDocReady();}
docReadyEvent.subscribe(fn,scope,override);}};YAHOO.ext.EventObject=new function(){this.browserEvent=null;this.button=-1;this.shiftKey=false;this.ctrlKey=false;this.altKey=false;this.BACKSPACE=8;this.TAB=9;this.RETURN=13;this.ESC=27;this.SPACE=32;this.PAGEUP=33;this.PAGEDOWN=34;this.END=35;this.HOME=36;this.LEFT=37;this.UP=38;this.RIGHT=39;this.DOWN=40;this.DELETE=46;this.F5=116;this.setEvent=function(e){this.browserEvent=e;if(e){this.button=e.button;this.shiftKey=e.shiftKey;this.ctrlKey=e.ctrlKey;this.altKey=e.altKey;}else{this.button=-1;this.shiftKey=false;this.ctrlKey=false;this.altKey=false;}};this.stopEvent=function(){if(this.browserEvent){YAHOO.util.Event.stopEvent(this.browserEvent);}};this.preventDefault=function(){if(this.browserEvent){YAHOO.util.Event.preventDefault(this.browserEvent);}};this.isNavKeyPress=function(){return(this.browserEvent.keyCode&&this.browserEvent.keyCode>=33&&this.browserEvent.keyCode<=40);};this.stopPropagation=function(){if(this.browserEvent){YAHOO.util.Event.stopPropagation(this.browserEvent);}};this.getCharCode=function(){if(this.browserEvent){return YAHOO.util.Event.getCharCode(this.browserEvent);}
return null;};this.getPageX=function(){if(this.browserEvent){return YAHOO.util.Event.getPageX(this.browserEvent);}
return null;};this.getPageY=function(){if(this.browserEvent){return YAHOO.util.Event.getPageY(this.browserEvent);}
return null;};this.getTime=function(){if(this.browserEvent){return YAHOO.util.Event.getTime(this.browserEvent);}
return null;};this.getXY=function(){if(this.browserEvent){return YAHOO.util.Event.getXY(this.browserEvent);}
return[];};this.getTarget=function(){if(this.browserEvent){return YAHOO.util.Event.getTarget(this.browserEvent);}
return null;};this.findTarget=function(className,tagName){if(tagName)tagName=tagName.toLowerCase();if(this.browserEvent){function isMatch(el){if(!el){return false;}
if(className&&!YAHOO.util.Dom.hasClass(el,className)){return false;}
if(tagName&&el.tagName.toLowerCase()!=tagName){return false;}
return true;};var t=this.getTarget();if(!t||isMatch(t)){return t;}
var p=t.parentNode;while(p&&p.tagName.toUpperCase()!='BODY'){if(isMatch(p)){return p;}
p=p.parentNode;}}
return null;};this.getRelatedTarget=function(){if(this.browserEvent){return YAHOO.util.Event.getRelatedTarget(this.browserEvent);}
return null;};this.getWheelDelta=function(){var e=this.browserEvent;var delta=0;if(e.wheelDelta){delta=e.wheelDelta/120;if(window.opera)delta=-delta;}else if(e.detail){delta=-e.detail/3;}
return delta;};this.hasModifier=function(){return this.ctrlKey||this.altKey||this.shiftKey;};}();

YAHOO.ext.UpdateManager=function(el,forceNew){el=YAHOO.ext.Element.get(el);if(!forceNew&&el.updateManager){return el.updateManager;}
this.el=el;this.defaultUrl=null;this.beforeUpdate=new YAHOO.util.CustomEvent('UpdateManager.beforeUpdate');this.onUpdate=new YAHOO.util.CustomEvent('UpdateManager.onUpdate');this.onFailure=new YAHOO.util.CustomEvent('UpdateManager.onFailure');this.sslBlankUrl=YAHOO.ext.UpdateManager.defaults.sslBlankUrl;this.disableCaching=YAHOO.ext.UpdateManager.defaults.disableCaching;this.indicatorText=YAHOO.ext.UpdateManager.defaults.indicatorText;this.showLoadIndicator=YAHOO.ext.UpdateManager.defaults.showLoadIndicator;this.timeout=YAHOO.ext.UpdateManager.defaults.timeout;this.loadScripts=YAHOO.ext.UpdateManager.defaults.loadScripts;this.transaction=null;this.autoRefreshProcId=null;this.refreshDelegate=this.refresh.createDelegate(this);this.updateDelegate=this.update.createDelegate(this);this.formUpdateDelegate=this.formUpdate.createDelegate(this);this.successDelegate=this.processSuccess.createDelegate(this);this.failureDelegate=this.processFailure.createDelegate(this);this.renderer=new YAHOO.ext.UpdateManager.BasicRenderer();};YAHOO.ext.UpdateManager.prototype={getEl:function(){return this.el;},update:function(url,params,callback,discardUrl){if(this.beforeUpdate.fireDirect(this.el,url,params)!==false){this.showLoading();if(!discardUrl){this.defaultUrl=url;}
if(typeof url=='function'){url=url();}
if(params&&typeof params!='string'){var buf=[];for(var key in params){if(typeof params[key]!='function'){buf.push(encodeURIComponent(key),'=',encodeURIComponent(params[key]),'&');}}
delete buf[buf.length-1];params=buf.join('');}
var callback={success:this.successDelegate,failure:this.failureDelegate,timeout:(this.timeout*1000),argument:{'url':url,'form':null,'callback':callback,'params':params}};var method=params?'POST':'GET';if(method=='GET'){url=this.prepareUrl(url);}
this.transaction=YAHOO.util.Connect.asyncRequest(method,url,callback,params);}},formUpdate:function(form,url,reset,callback){if(this.beforeUpdate.fireDirect(this.el,form,url)!==false){this.showLoading();formEl=YAHOO.util.Dom.get(form);if(typeof url=='function'){url=url();}
url=url||formEl.action;var callback={success:this.successDelegate,failure:this.failureDelegate,timeout:(this.timeout*1000),argument:{'url':url,'form':form,'callback':callback,'reset':reset}};var isUpload=false;var enctype=formEl.getAttribute('enctype');if(enctype&&enctype.toLowerCase()=='multipart/form-data'){isUpload=true;}
YAHOO.util.Connect.setForm(form,isUpload,this.sslBlankUrl);this.transaction=YAHOO.util.Connect.asyncRequest('POST',url,callback);}},refresh:function(callback){if(this.defaultUrl==null){return;}
this.update(this.defaultUrl,null,callback,true);},startAutoRefresh:function(interval,url,params,callback,refreshNow){if(refreshNow){this.update(url||this.defaultUrl,params,callback,true);}
if(this.autoRefreshProcId){clearInterval(this.autoRefreshProcId);}
this.autoRefreshProcId=setInterval(this.update.createDelegate(this,[url||this.defaultUrl,params,callback,true]),interval*1000);},stopAutoRefresh:function(){if(this.autoRefreshProcId){clearInterval(this.autoRefreshProcId);}},showLoading:function(){if(this.showLoadIndicator){this.el.update(this.indicatorText);}},prepareUrl:function(url){if(this.disableCaching){var append='_dc='+(new Date().getTime());if(url.indexOf('?')!==-1){url+='&'+append;}else{url+='?'+append;}}
return url;},processSuccess:function(response){this.transaction=null;this.renderer.render(this.el,response,this);if(response.argument.form&&response.argument.reset){try{response.argument.form.reset();}catch(e){}}
this.onUpdate.fireDirect(this.el,response);if(typeof response.argument.callback=='function'){response.argument.callback(this.el,true);}},processFailure:function(response){this.transaction=null;this.onFailure.fireDirect(this.el,response);if(typeof response.argument.callback=='function'){response.argument.callback(this.el,false);}},setRenderer:function(renderer){this.renderer=renderer;},getRenderer:function(){return this.renderer;},setDefaultUrl:function(defaultUrl){this.defaultUrl=defaultUrl;},abort:function(){if(this.transaction){YAHOO.util.Connect.abort(this.transaction);}},isUpdating:function(){if(this.transaction){return YAHOO.util.Connect.isCallInProgress(this.transaction);}
return false;}};YAHOO.ext.UpdateManager.update=function(el,url,params,options){var um=getEl(el,true).getUpdateManager();YAHOO.ext.util.Config.apply(um,options);um.update(url,params,options.callback);}
YAHOO.ext.UpdateManager.BasicRenderer=function(){};YAHOO.ext.UpdateManager.BasicRenderer.prototype={render:function(el,response,updateManager){el.update(response.responseText,updateManager.loadScripts);}};YAHOO.ext.UpdateManager.defaults={};YAHOO.ext.UpdateManager.defaults.timeout=30;YAHOO.ext.UpdateManager.defaults.loadScripts=false;YAHOO.ext.UpdateManager.defaults.sslBlankUrl='about:blank';YAHOO.ext.UpdateManager.defaults.disableCaching=false;YAHOO.ext.UpdateManager.defaults.showLoadIndicator=true;YAHOO.ext.UpdateManager.defaults.indicatorText='<div class="loading-indicator">Loading...</div>';

YAHOO.namespace('ext.state');YAHOO.ext.state.Provider=function(){YAHOO.ext.state.Provider.superclass.constructor.call(this);this.events={'statechange':new YAHOO.util.CustomEvent('statechange')};this.state={};};YAHOO.extendX(YAHOO.ext.state.Provider,YAHOO.ext.util.Observable,{get:function(name){return this.state[name];},clear:function(name){delete this.state[name];this.fireEvent('statechange',this,name,null);},set:function(name,value){this.state[name]=value;this.fireEvent('statechange',this,name,value);}});YAHOO.ext.state.Manager=new function(){var provider=new YAHOO.ext.state.Provider();return{setProvider:function(stateProvider){provider=stateProvider;},get:function(key){return provider.get(key);},set:function(key,value){provider.set(key,value);},clear:function(key){provider.clear(key);},getProvider:function(){return provider;}};}();YAHOO.ext.state.CookieProvider=function(config){YAHOO.ext.state.CookieProvider.superclass.constructor.call(this);this.path='/';this.expires=new Date(new Date().getTime()+(1000*60*60*24*7));this.domain=null;this.secure=false;YAHOO.ext.util.Config.apply(this,config);this.state=this.readCookies();};YAHOO.extendX(YAHOO.ext.state.CookieProvider,YAHOO.ext.state.Provider,{set:function(name,value){if(typeof value=='undefined'||value===null){this.clear(name);return;}
this.setCookie(name,value);YAHOO.ext.state.CookieProvider.superclass.set.call(this,name,value);},clear:function(name){this.clearCookie(name);YAHOO.ext.state.CookieProvider.superclass.clear.call(this,name);},readCookies:function(){var cookies={};var c=document.cookie+';';var re=/\s?(.*?)=(.*?);/g;var matches;while((matches=re.exec(c))!=null){var name=matches[1];var value=matches[2];if(name&&name.substring(0,3)=='ys-'){cookies[name.substr(3)]=this.decodeValue(value);}}
return cookies;},decodeValue:function(cookie){var re=/^(a|n|d|b|s|o)\:(.*)$/;var matches=re.exec(unescape(cookie));if(!matches||!matches[1])return;var type=matches[1];var v=matches[2];switch(type){case'n':return parseFloat(v);case'd':return new Date(Date.parse(v));case'b':return(v=='1');case'a':var all=[];var values=v.split('^');for(var i=0,len=values.length;i<len;i++){all.push(this.decodeValue(values[i]))}
return all;case'o':var all={};var values=v.split('^');for(var i=0,len=values.length;i<len;i++){var kv=values[i].split('=');all[kv[0]]=this.decodeValue(kv[1]);}
return all;default:return v;}},encodeValue:function(v){var enc;if(typeof v=='number'){enc='n:'+v;}else if(typeof v=='boolean'){enc='b:'+(v?'1':'0');}else if(v instanceof Date){enc='d:'+v.toGMTString();}else if(v instanceof Array){var flat='';for(var i=0,len=v.length;i<len;i++){flat+=this.encodeValue(v[i]);if(i!=len-1)flat+='^';}
enc='a:'+flat;}else if(typeof v=='object'){var flat='';for(var key in v){if(typeof v[key]!='function'){flat+=key+'='+this.encodeValue(v[key])+'^';}}
enc='o:'+flat.substring(0,flat.length-1);}else{enc='s:'+v;}
return escape(enc);},setCookie:function(name,value){document.cookie="ys-"+name+"="+this.encodeValue(value)+
((this.expires==null)?"":("; expires="+this.expires.toGMTString()))+
((this.path==null)?"":("; path="+this.path))+
((this.domain==null)?"":("; domain="+this.domain))+
((this.secure==true)?"; secure":"");},clearCookie:function(name){document.cookie="ys-"+name+"=null; expires=Thu, 01-Jan-70 00:00:01 GMT"+
((this.path==null)?"":("; path="+this.path))+
((this.domain==null)?"":("; domain="+this.domain))+
((this.secure==true)?"; secure":"");}});


/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 *
 * This code is licensed under BSD license.
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.TabPanel=function(container,onBottom){this.el=getEl(container);if(onBottom){this.bodyEl=getEl(this.createBody(this.el.dom));this.el.addClass('ytabs-bottom');}
this.stripWrap=getEl(this.createStrip(this.el.dom));this.stripEl=getEl(this.createStripList(this.stripWrap.dom));if(!onBottom){this.bodyEl=getEl(this.createBody(this.el.dom));}
this.items={};this.active=null;this.onTabChange=new YAHOO.util.CustomEvent('TabItem.onTabChange');this.activateDelegate=this.activate.createDelegate(this);}
YAHOO.ext.TabPanel.prototype={addTab:function(id,text,content){var item=new YAHOO.ext.TabPanelItem(this,id,text);this.addTabItem(item);if(content){item.setContent(content);}
return item;},getTab:function(id){return this.items[id];},addTabItem:function(item){this.items[item.id]=item;},removeTab:function(id){var tab=this.items[id];if(tab&&this.active==tab){for(var key in this.items){if(typeof this.items[key]!='function'&&this.items[key]!=tab){this.items[key].activate();break;}}}
this.stripEl.dom.removeChild(tab.onEl.dom);this.stripEl.dom.removeChild(tab.offEl.dom);this.bodyEl.dom.removeChild(tab.bodyEl.dom);delete this.items[id];},disableTab:function(id){var tab=this.items[id];if(tab&&this.active!=tab){tab.disable();}},enableTab:function(id){var tab=this.items[id];tab.enable();},activate:function(id){var tab=this.items[id];if(!tab.disabled){if(this.active){this.active.hide();}
this.active=this.items[id];this.active.show();this.onTabChange.fireDirect(this,this.active);}},getActiveTab:function(){return this.active;}};YAHOO.ext.TabPanelItem=function(tabPanel,id,text){this.tabPanel=tabPanel;this.id=id;this.disabled=false;this.text=text;this.loaded=false;this.bodyEl=getEl(tabPanel.createItemBody(tabPanel.bodyEl.dom,id));this.bodyEl.originalDisplay='block';this.bodyEl.setStyle('display','none');this.bodyEl.enableDisplayMode();var stripElements=tabPanel.createStripElements(tabPanel.stripEl.dom,text);this.onEl=getEl(stripElements.on,true);this.offEl=getEl(stripElements.off,true);this.onEl.originalDisplay='inline';this.onEl.enableDisplayMode();this.offEl.originalDisplay='inline';this.offEl.enableDisplayMode();this.offEl.on('click',tabPanel.activateDelegate.createCallback(id));this.onActivate=new YAHOO.util.CustomEvent('TabItem.onActivate');this.onDeactivate=new YAHOO.util.CustomEvent('TabItem.onDeactivate');};YAHOO.ext.TabPanelItem.prototype={show:function(){this.onEl.show();this.offEl.hide();this.bodyEl.show();this.onActivate.fireDirect(this.tabPanel,this);},setText:function(text){this.onEl.dom.firstChild.firstChild.firstChild.innerHTML=text;this.offEl.dom.firstChild.firstChild.innerHTML=text;},activate:function(){this.tabPanel.activate(this.id);},hide:function(){this.onEl.hide();this.offEl.show();this.bodyEl.hide();this.onDeactivate.fireDirect(this.tabPanel,this);},disable:function(){if(this.tabPanel.active!=this){this.disabled=true;this.offEl.addClass('disabled');this.offEl.dom.title='disabled';}},enable:function(){this.disabled=false;this.offEl.removeClass('disabled');this.offEl.dom.title='';},setContent:function(content){this.bodyEl.update(content);},getUpdateManager:function(){return this.bodyEl.getUpdateManager();},setUrl:function(url,params,loadOnce){this.onActivate.subscribe(this._handleRefresh.createDelegate(this,[url,params,loadOnce]));},_handleRefresh:function(url,params,loadOnce){if(!loadOnce||!this.loaded){var updater=this.bodyEl.getUpdateManager();updater.update(url,params,this._setLoaded.createDelegate(this));}},_setLoaded:function(){this.loaded=true;}};YAHOO.ext.TabPanel.prototype.createStrip=function(container){var strip=document.createElement('div');YAHOO.util.Dom.addClass(strip,'tabset');container.appendChild(strip);var stripInner=document.createElement('div');YAHOO.util.Dom.generateId(stripInner,'tab-strip');YAHOO.util.Dom.addClass(stripInner,'hd');strip.appendChild(stripInner);return stripInner;};YAHOO.ext.TabPanel.prototype.createStripList=function(strip){var list=document.createElement('ul');YAHOO.util.Dom.generateId(list,'tab-strip-list');strip.appendChild(list);return list;};YAHOO.ext.TabPanel.prototype.createBody=function(container){var body=document.createElement('div');YAHOO.util.Dom.generateId(body,'tab-body');YAHOO.util.Dom.addClass(body,'yui-ext-tabbody');container.appendChild(body);return body;};YAHOO.ext.TabPanel.prototype.createItemBody=function(bodyEl,id){var body=YAHOO.util.Dom.get(id);if(!body){body=document.createElement('div');body.id=id;}
YAHOO.util.Dom.addClass(body,'yui-ext-tabitembody');bodyEl.appendChild(body);return body;};YAHOO.ext.TabPanel.prototype.createStripElements=function(stripEl,text){var li=document.createElement('li');var a=document.createElement('a');var em=document.createElement('em');stripEl.appendChild(li);li.appendChild(a);a.appendChild(em);em.innerHTML=text;var li2=document.createElement('li');var a2=document.createElement('a');var em2=document.createElement('em');var strong=document.createElement('strong');stripEl.appendChild(li2);YAHOO.util.Dom.addClass(li2,'on');YAHOO.util.Dom.setStyle(li2,'display','none');li2.appendChild(a2);a2.appendChild(strong);strong.appendChild(em2);em2.innerHTML=text;return{on:li2,off:li};};


/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 *
 * This code is licensed under BSD license.
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.Resizable=function(el,config){var getEl=YAHOO.ext.Element.get;this.el=getEl(el,true);this.el.autoBoxAdjust=true;if(this.el.getStyle('position')!='absolute'){this.el.setStyle('position','relative');}
var dh=YAHOO.ext.DomHelper;var tpl=dh.createTemplate({tag:'div',cls:'yresizable-handle yresizable-handle-{0}',html:'&nbsp;'});this.east=getEl(tpl.append(this.el.dom,['east']),true);this.south=getEl(tpl.append(this.el.dom,['south']),true);if(config&&config.multiDirectional){this.west=getEl(tpl.append(this.el.dom,['west']),true);this.north=getEl(tpl.append(this.el.dom,['north']),true);}
this.corner=getEl(tpl.append(this.el.dom,['southeast']),true);this.proxy=getEl(dh.insertBefore(document.body.firstChild,{tag:'div',cls:'yresizable-proxy',id:this.el.id+'-rzproxy'}),true);this.proxy.autoBoxAdjust=true;this.moveHandler=YAHOO.ext.EventManager.wrap(this.onMouseMove,this,true);this.upHandler=YAHOO.ext.EventManager.wrap(this.onMouseUp,this,true);this.selHandler=YAHOO.ext.EventManager.wrap(this.cancelSelection,this,true);this.events={'beforeresize':new YAHOO.util.CustomEvent(),'resize':new YAHOO.util.CustomEvent()};this.dir=null;this.resizeChild=false;this.adjustments=[0,0];this.minWidth=5;this.minHeight=5;this.maxWidth=10000;this.maxHeight=10000;this.enabled=true;this.animate=false;this.duration=.35;this.dynamic=false;this.multiDirectional=false;this.disableTrackOver=false;this.easing=YAHOO.util.Easing?YAHOO.util.Easing.easeOutStrong:null;YAHOO.ext.util.Config.apply(this,config);var mdown=this.onMouseDown.createDelegate(this);this.east.mon('mousedown',mdown);this.south.mon('mousedown',mdown);if(this.multiDirectional){this.west.mon('mousedown',mdown);this.north.mon('mousedown',mdown);}
this.corner.mon('mousedown',mdown);if(!this.disableTrackOver){var mover=this.onMouseOver.createDelegate(this);var mout=this.onMouseOut.createDelegate(this);this.east.mon('mouseover',mover);this.east.mon('mouseout',mout);this.south.mon('mouseover',mover);this.south.mon('mouseout',mout);if(this.multiDirectional){this.west.mon('mouseover',mover);this.west.mon('mouseout',mout);this.north.mon('mouseover',mover);this.north.mon('mouseout',mout);}
this.corner.mon('mouseover',mover);this.corner.mon('mouseout',mout);}
this.updateChildSize();};YAHOO.extendX(YAHOO.ext.Resizable,YAHOO.ext.util.Observable,{resizeTo:function(width,height){this.el.setSize(width,height);this.fireEvent('resize',this,width,height,null);},cancelSelection:function(e){e.preventDefault();},startSizing:function(e){this.fireEvent('beforeresize',this,e);if(this.enabled){e.preventDefault();this.startBox=this.el.getBox();this.startPoint=e.getXY();this.offsets=[(this.startBox.x+this.startBox.width)-this.startPoint[0],(this.startBox.y+this.startBox.height)-this.startPoint[1]];this.proxy.setBox(this.startBox);if(!this.dynamic){this.proxy.show();}
YAHOO.util.Event.on(document.body,'selectstart',this.selHandler);YAHOO.util.Event.on(document.body,'mousemove',this.moveHandler);YAHOO.util.Event.on(document.body,'mouseup',this.upHandler);}},onMouseDown:function(e){if(this.enabled){var t=e.getTarget();if(t==this.corner.dom){this.dir='both';this.proxy.setStyle('cursor',this.corner.getStyle('cursor'));this.startSizing(e);}else if(t==this.east.dom){this.dir='east';this.proxy.setStyle('cursor',this.east.getStyle('cursor'));this.startSizing(e);}else if(t==this.south.dom){this.dir='south';this.proxy.setStyle('cursor',this.south.getStyle('cursor'));this.startSizing(e);}else if(t==this.west.dom){this.dir='west';this.proxy.setStyle('cursor',this.west.getStyle('cursor'));this.startSizing(e);}else if(t==this.north.dom){this.dir='north';this.proxy.setStyle('cursor',this.north.getStyle('cursor'));this.startSizing(e);}}},onMouseUp:function(e){YAHOO.util.Event.removeListener(document.body,'selectstart',this.selHandler);YAHOO.util.Event.removeListener(document.body,'mousemove',this.moveHandler);YAHOO.util.Event.removeListener(document.body,'mouseup',this.upHandler);var size=this.resizeElement();this.fireEvent('resize',this,size.width,size.height,e);},updateChildSize:function(){if(this.resizeChild&&this.el.dom.firstChild&&this.el.dom.offsetWidth){var el=this.el;var adj=this.adjustments;setTimeout(function(){var c=YAHOO.ext.Element.get(el.dom.firstChild,true);var b=el.getBox(true);c.setSize(b.width+adj[0],b.height+adj[1]);},1);}},resizeElement:function(){var box=this.proxy.getBox();this.el.setBox(box,false,this.animate,this.duration,null,this.easing);this.updateChildSize();this.proxy.hide();return box;},onMouseMove:function(e){if(this.enabled){var xy=e.getXY();if(this.dir=='both'||this.dir=='east'||this.dir=='south'){var w=Math.min(Math.max(this.minWidth,xy[0]-this.startBox.x+this.offsets[0]),this.maxWidth);var h=Math.min(Math.max(this.minHeight,xy[1]-this.startBox.y+this.offsets[1]),this.maxHeight);if(this.dir=='both'){this.proxy.setSize(w,h);}else if(this.dir=='east'){this.proxy.setWidth(w);}else if(this.dir=='south'){this.proxy.setHeight(h);}}else{var x=this.startBox.x+(xy[0]-this.startPoint[0]);var y=this.startBox.y+(xy[1]-this.startPoint[1]);var w=this.startBox.width+(this.startBox.x-x);var h=this.startBox.height+(this.startBox.y-y);if(this.dir=='west'&&w<=this.maxWidth&&w>=this.minWidth){this.proxy.setX(x);this.proxy.setWidth(w);}else if(this.dir=='north'&&h<=this.maxHeight&&h>=this.minHeight){this.proxy.setY(y);this.proxy.setHeight(h);}}
if(this.dynamic){this.resizeElement();}}},onMouseOver:function(){if(this.enabled)this.el.addClass('yresizable-over');},onMouseOut:function(){this.el.removeClass('yresizable-over');}});


var get_cnid_by_id = function (s) {
	return 	parseInt(s.substr(2),10)
};
var Comments=function (){
	var COMMENT_BAR_WIDTH=20;
	var blocks,chapterBody,chapterWrapper,highlightFloater,currentBlock,allCommentsList,commentTabs,submittranslationButton,currentCommentsList,commentDialog,commentForm;
	var allCommentsLoaded=false;
	var postingComment=false;
	var commentBarClick=function (e){
		setCurrentBlock(getEventTargetBlock(e));

	};
	var getEventTargetBlock=function (e){
		var t=e.getTarget();
		if(t.nodeName=="SPAN"){
			t=t.parentNode;

		}
		return blocks[parseInt(t.id.substr(1),10)];

	};
	var setCurrentBlock=function (block){
		currentBlock=block;
		highlightFloater.setXY([chapterWrapper.getX(),block.el.getY()]);
		highlightFloater.setHeight(block.height);
		highlightFloater.show();
		commentDialog.show(block);
		if(block.indicator.hasClass("has-comments")){
			commentTabs.activate("comment-tabs-current");

		}else {
			commentTabs.activate("comment-tabs-form");

		}
	};
	var onTabChange=function (tp,tabItem){
		if(tabItem.id=="comment-tabs-form"){
			submitCommentButton.show();

		}else if(tabItem.id=="comment-tabs-current"){
			if(currentBlock){
				loadComments(currentBlock);

			}
			submitCommentButton.hide();

		}else if(tabItem.id=="comment-tabs-all"){
			loadComments();
			submitCommentButton.hide();

		}
	};
	var loadComments=function (block){
		commentDialog.showLoading("正在装载注释...");
		var url=document.location.pathname+"comments/";
		var cl=allCommentsList;
		if(block){
			cl=currentCommentsList;
			url+=+block.nodenum+"/";

		}
		YAHOO.util.Connect.asyncRequest("GET",url,{
			success:function (res){
				cl.dom.innerHTML=res.responseText;
				commentDialog.hideMessage();

			},failure:XHRFailure
		});

	};
	var XHRFailure=function (res){
		commentDialog.showError(res.statusText);

	};
	var onResize=function (){
		if(highlightFloater.isVisible()&&currentBlock){
			highlightFloater.setXY([chapterWrapper.getX(),currentBlock.top]);
			highlightFloater.setHeight(currentBlock.height);

		}
	};
	var loadCommentCounts=function (callback){
		var url=document.location.pathname+"comments/counts/";
		YAHOO.util.Connect.asyncRequest("GET",url,{
			success:function (res){
				var cc=eval(res.responseText);
				for(var i=0,l=cc.length;i<l;i++){
					if(YAHOO.ext.util.Browser.isIE){
						var s = blocks[cc[i][0]].indicator.dom.firstChild.cloneNode();
						s.innerHTML=cc[i][1];
						blocks[cc[i][0]].indicator.dom.removeChild(blocks[cc[i][0]].indicator.dom.firstChild);
						blocks[cc[i][0]].indicator.dom.appendChild(s);
						blocks[cc[i][0]].indicator.addClass("has-comments");
					}else{
						blocks[cc[i][0]].indicator.addClass("has-comments");
						blocks[cc[i][0]].indicator.dom.innerHTML="<span>"+cc[i][1]+"</span>";
					}
				}
				if(callback){
					callback();

				}
			}
		});

	};
	var commentSuccess=function (res){
		postingComment=false;
		commentDialog.hideMessage();
		if(res.responseText.substr(0,3)=="<li"){
			commentTabs.activate("comment-tabs-current");
			loadCommentCounts();

		}else {
			var errors=eval(res.responseText);
			commentDialog.showError("Please fill out all required fields.");

		}
	};
	return {
		init:function (){
			chapterBody=getEl("chapter-body");
			chapterWrapper=getEl("yui-main");
			submitCommentButton=getEl("comment-submit");
			currentCommentsList=getEl("current-comments-list");
			allCommentsList=getEl("all-comments-list");
			commentForm=getEl("commentform");
			highlightFloater=getEl("highlight-floater");
			highlightFloater.hide();
			highlightFloater.setOpacity(0.3);
			if(YAHOO.ext.util.Browser.isIE&&!YAHOO.ext.util.Browser.isIE7){
				highlightFloater.setWidth(chapterWrapper.getWidth()-20);

			}else {
				highlightFloater.setWidth(chapterWrapper.getWidth());

			}
			YAHOO.util.Event.on(window,'resize',onResize);
			commentTabs=new YAHOO.ext.TabPanel("comment-tabs");
			commentTabs.addTab("comment-tabs-form","提交评注");
			commentTabs.addTab("comment-tabs-current","本块的评注");
			commentTabs.addTab("comment-tabs-all","所有评注");
			commentTabs.addTab("comment-tabs-help","帮助");
			commentTabs.onTabChange.subscribe(onTabChange);
			commentTabs.activate("comment-tabs-form");
			var ctHeightFix,cfHeightFix;
			if(YAHOO.ext.util.Browser.isGecko){
				ctHeightFix=97;
				cfHeightFix=280;

			}else {
				ctHeightFix=120;
				cfHeightFix=300;

			}
			commentDialog=new CommentDialog("djangobookcomments");
			commentDialog.resizer.delayedListener("resize",function (r,width,height){
				getEl("id_comment").setSize(width-30,height-cfHeightFix);
				commentTabs.bodyEl.setSize(width-12,height-ctHeightFix);

			});
			commentDialog.restoreState();
			var start=new Date().getTime();
			blocks=[];
			var parentTop=chapterBody.getTop();
			var cns=YAHOO.util.Dom.getElementsByClassName('cn',null,chapterBody.dom);
			var DH=YAHOO.ext.DomHelper;
			var cwx=chapterWrapper.getX();
			var ci;
			for(var i=0,l=cns.length;i<l;i++){
				var cnid = get_cnid_by_id(cns[i].id);
				var div = document.createElement("div");
				div.className = "comment-indicator";
				div.innerHTML="<span></span>";
				div.id="c"+cnid;
				var ci=null;
				if (cns[i].nodeName == 'PRE' || getEl(cns[i].id).hasClass('literal-block')) {
				    cns[0].appendChild(div);
				    ci = getEl("c"+cnid);
				    var y = cns[i].offsetTop + cns[i].offsetParent.offsetTop;
				    ci.setY(y);
				} else {
				    cns[i].appendChild(div);
				    ci = cns[i].lastChild;
				}
				blocks[cnid]=new CommentBlock(cns[i],cnid,ci,parentTop);
				blocks[cnid].indicator.mon("click",commentBarClick);
				if (cns[i].nodeName == 'TABLE') {
					var y = cns[i].offsetTop + cns[i].offsetParent.offsetTop;
					blocks[cnid].indicator.setY(y);
				}

			}
			loadCommentCounts(function (){
				YAHOO.ext.util.CSS.updateRule("div.comment-indicator","display","block");
			});

		},close:function (){
			currentBlock=null;
			highlightFloater.hide();
			commentDialog.hide();

		},submitComment:function (){
			if(postingComment||!currentBlock){
				return ;

			}
			postingComment=true;
			commentDialog.showLoading("正在提交注释...");
			commentForm.dom.nodenum.value=currentBlock.index;
			YAHOO.util.Connect.setForm(commentForm.dom);
			YAHOO.util.Connect.asyncRequest("POST",document.location.pathname+"comments/",{
				success:commentSuccess,failure:XHRFailure
			});

		},removeComment:function (e){
			YAHOO.util.Connect.asyncRequest("POST",e.href,{
				success:function (){
					var cid=e.href.split("/").reverse()[1];
					var cel=getEl("c"+cid);
					cel.enableDisplayMode();
					cel.hide();
					loadCommentCounts();

				},failure:XHRFailure
			});

		},markCommentHandled:function (e){
			YAHOO.util.Connect.asyncRequest("POST",e.href,{
				success:function (){
					if(currentBlock){
						loadComments(currentBlock)
					}
				},failure:XHRFailure
			});

		}
	};

}();
var CommentBlock=function (el,index,indicator,parentTop){
	this.el=getEl(el);
	this.index=index;
	this.indicator=getEl(indicator);
	this.nodenum=index;
	this.height=this.el.getHeight();
	this.indicator.setHeight(this.height);

};
var CommentDialog=function (el){
	this.el=getEl(el);
	this.size=this.el.getSize();
	this.size.width=500;
	this.size.height=400;
	this.xy=this.el.getCenterXY();
	this.initalized=false;
	this.dd=null;
	this.messageDiv=getEl(this.el.id+"-message");
	this.hideMessage();
	this.resizer=new YAHOO.ext.Resizable(this.el,{
		minWidth:500,minHeight:400,disableTrackOver:true,multiDirectional:false
	});
	this.el.setStyle('display','none');

};
CommentDialog.prototype={
	restoreState:function (){
		this.resizer.resizeTo(this.size.width,this.size.height);
		this.adjustViewport();

	},adjustViewport:function (){
		this.viewInfo=getViewportInfo();
		if(this.xy[1]+this.el.getHeight()>this.viewInfo.pageYOffset+this.viewInfo.innerHeight-20){
			this.xy[1]=this.viewInfo.pageYOffset+this.viewInfo.innerHeight-this.el.getHeight()-20;
			this.el.setXY(this.xy);

		}
		if(this.xy[1]<this.viewInfo.pageYOffset+20){
			this.xy[1]=this.viewInfo.pageYOffset+20;
			this.el.setXY(this.xy);

		}
	},show:function (block){
		if(!this.initalized){
			this.resizer.delayedListener("resize",this.refreshSize,this,true);
			this.dd=new YAHOO.util.DDProxy(this.el.dom,"WindowDrag");
			this.dd.setHandleElId(this.el.id+"-head");
			this.dd.startDrag=this.constraints.createDelegate(this);
			this.dd.endDrag=this.endMove.createDelegate(this);
			this.initalized=true;

		}
		if(!this.el.isVisible()){
			var xy=block.el.getXY();
			this.xy[0]=xy[0]+50;
			this.xy[1]=xy[1]-200;
			this.el.setStyle('display','block');
			this.el.setBounds(this.xy[0],this.xy[1],this.size.width,this.size.height);
			this.el.show();

		}
		this.adjustViewport();

	},hide:function (){
		this.el.hide();
		this.el.setStyle("display","none");

	},constraints:function (){
		this.dd.resetConstraints();
		this.viewInfo=getViewportInfo();
		this.dd.setXConstraint(this.xy[0],this.viewInfo.pageWidth-this.xy[0]-this.size.width);
		this.dd.setYConstraint(this.xy[1],this.viewInfo.pageHeight-this.xy[0]-this.size.height);

	},endMove:function (){
		YAHOO.util.DDProxy.prototype.endDrag.apply(this.dd,arguments);
		this.refreshSize();

	},refreshSize:function (){
		this.size=this.el.getSize();
		this.xy=this.el.getXY();

	},showMessage:function (message,className){
		this.messageDiv.dom.innerHTML=message;
		if(className){
			this.messageDiv.dom.className=className;

		}
		this.messageDiv.show();

	},showError:function (message){
		this.showMessage(message,"error");

	},showLoading:function (message){
		this.showMessage(message,"loading");

	},hideMessage:function (){
		this.messageDiv.dom.className="";
		this.messageDiv.hide();

	}
};
var getViewportInfo=function (){
	var innerWidth,innerHeight,pageXOffset,pageYOffset;
	if(self.innerHeight){
		innerWidth=self.innerWidth;
		innerHeight=self.innerHeight;
		pageXOffset=self.pageXOffset;
		pageYOffset=self.pageYOffset;

	}else if(document.documentElement&&document.documentElement.clientHeight){
		innerWidth=document.documentElement.clientWidth;
		innerHeight=document.documentElement.clientHeight;
		pageXOffset=document.documentElement.scrollLeft;
		pageYOffset=document.documentElement.scrollTop;

	}else if(document.body){
		innerWidth=document.body.clientWidth;
		innerHeight=document.body.clientHeight;
		pageXOffset=document.body.scrollLeft;
		pageYOffset=document.body.scrollTop;

	}
	var pageWidth,pageHeight;
	if(document.body.scrollHeight>document.body.offsetHeight){
		pageWidth=document.body.scrollWidth;
		pageHeight=document.body.scrollHeight;

	}else {
		pageWidth=document.body.offsetWidth;
		pageHeight=document.body.offsetHeight;

	}
	return {
		innerWidth:innerWidth,innerHeight:innerHeight,pageXOffset:pageXOffset,pageYOffset:pageYOffset,pageWidth:pageWidth,pageHeight:pageHeight
	};

};
YAHOO.ext.EventManager.onDocumentReady(Comments.init,Comments,true);


/*** translation ***/
var Translations=function (){
	var COMMENT_BAR_WIDTH=20;
	var blocks,chapterBody,chapterWrapper,highlightFloater,currentBlock,TranslationTabs,submitTranslationButton,currentTranslationsList,translationDialog,translationForm,prevTranslationButton,nextTranslationButton,submitNextButton;
	var postingTranslation=false;
	var submitNext=false;
	var translationBarClick=function (e){
		var block = getEventTargetBlock(e);
		//translationTabs.activate("translation-tabs-form");
		document.location.href = document.location.pathname+"translate/#cn"+e.getTarget().id.substr(1);
		return false;
	};
	var getEventTargetBlock=function (e){
		var t=e.getTarget();
		if(t.nodeName=="SPAN"){
			t=t.parentNode;

		}
		return blocks[t.id];

	};
	var setCurrentBlock=function (block){
		currentBlock=block;
		highlightFloater.setXY([chapterWrapper.getX(),block.el.getY()]);
		highlightFloater.setHeight(block.height);
		highlightFloater.show();
		loadTranslationForm(block);
		translationDialog.show(block);
	};
	var onTabChange=function (tp,tabItem){
		if(tabItem.id=="translation-tabs-form"){
			if(currentBlock){
				//loadTranslationForm(currentBlock);
			}
			submitTranslationButton.show();
			submitNextButton.show();
			prevTranslationButton.show();
			nextTranslationButton.show();
		}else if(tabItem.id=="translation-tabs-current"){
			if(currentBlock){
				loadTranslations(currentBlock);
			}
			submitTranslationButton.hide();
			submitNextButton.hide();
			prevTranslationButton.hide();
			nextTranslationButton.hide();
		}
	};
	var loadTranslationForm=function(block){
		translationDialog.showLoading("正在加载翻译...");
		var url=document.location.pathname+"translations/"+block.nodenum+"/";
		var form = translationForm;
		YAHOO.util.Connect.asyncRequest("GET",url,{
			success:function (res){
				if(YAHOO.ext.util.Browser.isIE){
					var container = document.getElementById("translation-tabs-form");
					container.innerHTML=res.responseText;
					translationForm=getEl("translationform");
				} else {
					form.dom.innerHTML=res.responseText;
				}
				translationDialog.hideMessage();

			},failure:XHRFailure
		});
	};
	var loadTranslations=function (block){
		translationDialog.showLoading("正在加载翻译历史记录...");
		var url=document.location.pathname+"translations/";
		var cl=currentTranslationsList;
		if(block){
			cl=currentTranslationsList;
			url+=+block.nodenum+"/history/";

		}
		YAHOO.util.Connect.asyncRequest("GET",url,{
			success:function (res){
				cl.dom.innerHTML=res.responseText;
				translationDialog.hideMessage();

			},failure:XHRFailure
		});

	};
	var XHRFailure=function (res){
		translationDialog.showError(res.statusText);

	};
	var onResize=function (){
		if(highlightFloater.isVisible()&&currentBlock){
			highlightFloater.setXY([chapterWrapper.getX(),currentBlock.top]);
			highlightFloater.setHeight(currentBlock.height);

		}
	};
	var setIndicatorHTML=function (res) {
		var cc=eval(res.responseText);
		for(var i=0,l=cc.length;i<l;i++){
			if(YAHOO.ext.util.Browser.isIE){
				var indicator = document.getElementById("b"+cc[i][0]);
				var s = indicator.firstChild.cloneNode();
				s.innerHTML=cc[i][1];
				indicator.replaceChild(s,indicator.firstChild);
				blocks[cc[i][0]].indicator.addClass("has-translations");
			} else {
				blocks[cc[i][0]].indicator.addClass("has-translations");
				blocks[cc[i][0]].indicator.dom.innerHTML="<span>"+cc[i][1]+"</span>";
			}
		}
	};
	var loadTranslationCounts=function (callback){
		var url=document.location.pathname+"translations/counts/";
		YAHOO.util.Connect.asyncRequest("GET",url,{
										success:function(res){
											setIndicatorHTML(res);
											if(callback){
												callback();
											}
										}
		});
	};
	var translationSuccess=function (res){
		postingTranslation=false;
		translationDialog.hideMessage();
		if(res.responseText.substr(0,3)=="<li"){
			currentBlock.indicator.addClass("has-translations");
			if (YAHOO.ext.util.Browser.isIE) {
				var s = currentBlock.indicator.dom.firstChild.cloneNode();
				s.innerHTML="已翻译";
				currentBlock.indicator.dom.replaceChild(s,currentBlock.indicator.dom.firstChild);
//				currentBlock.indicator.innerHTML="<span>你已经翻译。</span>";
			} else {
				currentBlock.indicator.dom.innerHTML="<span>你已经翻译。</span>";
			}
			if (submitNext) {
				Translations.next();
				submitNext=false;
			} else {
				translationTabs.activate("translation-tabs-current");
			}
		}else {
			var errors=eval(res.responseText);
			translationDialog.showError("Please fill out all required fields.");

		}
	};
	return {
		init:function (){
			chapterBody=getEl("chapter-body");
			chapterWrapper=getEl("yui-main");
			submitTranslationButton=getEl("translation-submit");
			prevTranslationButton = getEl("translation-prev");
			nextTranslationButton = getEl("translation-next");
			submitNextButton = getEl("translation-submit-next");
			nextTranslationButton.hide();
			currentTranslationsList=getEl("current-translations-list");
			translationForm=getEl("translationform");
			highlightFloater=getEl("highlight-floater");
			highlightFloater.hide();
			highlightFloater.setOpacity(0.3);
			if(YAHOO.ext.util.Browser.isIE&&!YAHOO.ext.util.Browser.isIE7){
				highlightFloater.setWidth(chapterWrapper.getWidth()-20);

			}else {
				highlightFloater.setWidth(chapterWrapper.getWidth());

			}
			YAHOO.util.Event.on(window,'resize',onResize);
			translationTabs=new YAHOO.ext.TabPanel("translation-tabs");
			translationTabs.addTab("translation-tabs-form","翻译");
			translationTabs.addTab("translation-tabs-current","翻译历史记录");
			translationTabs.addTab("translation-tabs-help","帮助");
			translationTabs.onTabChange.subscribe(onTabChange);
			translationTabs.activate("translation-tabs-form");
			var ctHeightFix,cfHeightFix;
			if(YAHOO.ext.util.Browser.isGecko){
				ctHeightFix=97;
				cfHeightFix=280;

			}else {
				ctHeightFix=120;
				cfHeightFix=300;

			}
			translationDialog=new TranslationDialog("djangobooktranslations");
			translationDialog.resizer.delayedListener("resize",function (r,width,height){
				translationTabs.bodyEl.setSize(width-12,height-ctHeightFix);

			});
			translationDialog.restoreState();
			var start=new Date().getTime();
			blocks=[];
			var parentTop=chapterBody.getTop();
			var cns=YAHOO.util.Dom.getElementsByClassName('cn',null,chapterBody.dom);
			var DH=YAHOO.ext.DomHelper;
			var cwx=chapterWrapper.getX();
			for(var i=0,l=cns.length;i<l;i++){
				if (cns[i].nodeName == 'PRE') {
					continue;
				}
				var cnid = get_cnid_by_id(cns[i].id);
				var div = document.createElement("div");
				div.className = "translation-indicator";
				div.innerHTML="<span></span>";
				div.id="b"+cnid;
				cns[i].appendChild(div);
				var ci = cns[i].lastChild;
				blocks[cnid]=new TranslationBlock(cns[i],cnid,ci,parentTop);
				blocks[cnid].indicator.mon("click",translationBarClick);
				if (cns[i].nodeName == 'TABLE') {
					var y = cns[i].offsetTop + cns[i].offsetParent.offsetTop;
					blocks[cnid].indicator.setY(y);
				}
			}
			loadTranslationCounts(function (){
				YAHOO.ext.util.CSS.updateRule("div.translation-indicator","display","block");

			});

		},close:function (){
			currentBlock=null;
			highlightFloater.hide();
			translationDialog.hide();

		},prev:function () {
			if (currentBlock) {
				for (var i=currentBlock.index-1; i>=0; i--) {
					if (blocks[i] instanceof  Object) {
						setCurrentBlock(blocks[i]);
						translationDialog.adjustViewport();
						break;
					}
				}
			}
		},next:function () {
			if (currentBlock) {
				for (var i=currentBlock.index+1; i<blocks.length; i++) {
					if (blocks[i] instanceof  Object) {
						setCurrentBlock(blocks[i]);
						translationDialog.adjustViewport();
						break;
					}
				}
			}
		},submitTranslation:function (){
			if(postingTranslation||!currentBlock){
				return ;

			}
			postingTranslation=true;
			translationDialog.showLoading("正在提交翻译...");
			translationForm.dom.nodenum.value=currentBlock.index;
			YAHOO.util.Connect.setForm(translationForm.dom);
			YAHOO.util.Connect.asyncRequest("POST",document.location.pathname+"translations/"+currentBlock.index+"/",{
				success:translationSuccess,failure:XHRFailure
			});

		},submitNext:function (){
			submitNext=true;
			Translations.submitTranslation();
		},removeTranslation:function (e){
			YAHOO.util.Connect.asyncRequest("POST",e.href,{
				success:function (){
					var cid=e.href.split("/").reverse()[1];
					var cel=getEl("c"+cid);
					cel.enableDisplayMode();
					cel.hide();
					loadCommentCounts();

				},failure:XHRFailure
			});

		},markTranslationHandled:function (e){
			YAHOO.util.Connect.asyncRequest("POST",e.href,{
				success:function (){
					if(currentBlock){
						loadTranslations(currentBlock)
					}
				},failure:XHRFailure
			});

		}
	};

}();
var TranslationBlock=function (el,index,indicator,parentTop){
	this.el=getEl(el);
	this.index=index;
	this.indicator=getEl(indicator);
	this.nodenum=index;
	this.height=this.el.getHeight();
	this.indicator.setHeight(this.height);

};
var TranslationDialog=function (el){
	this.el=getEl(el);
	this.size=this.el.getSize();
	this.size.width=650;
	this.size.height=440;
	this.xy=this.el.getCenterXY();
	this.initalized=false;
	this.dd=null;
	this.messageDiv=getEl(this.el.id+"-message");
	this.hideMessage();
	this.resizer=new YAHOO.ext.Resizable(this.el,{
		minWidth:650,minHeight:440,disableTrackOver:true,multiDirectional:false
	});
	this.el.setStyle('display','none');

};
TranslationDialog.prototype={
	restoreState:function (){
		this.resizer.resizeTo(this.size.width,this.size.height);
		this.adjustViewport();

	},adjustViewport:function (){
		this.viewInfo=getViewportInfo();
		if(this.xy[1]+this.el.getHeight()>this.viewInfo.pageYOffset+this.viewInfo.innerHeight-20){
			this.xy[1]=this.viewInfo.pageYOffset+this.viewInfo.innerHeight-this.el.getHeight()-20;
			this.el.setXY(this.xy);

		}
		if(this.xy[1]<this.viewInfo.pageYOffset+20){
			this.xy[1]=this.viewInfo.pageYOffset+20;
			this.el.setXY(this.xy);

		}
	},show:function (block){
		if(!this.initalized){
			this.resizer.delayedListener("resize",this.refreshSize,this,true);
			this.dd=new YAHOO.util.DDProxy(this.el.dom,"WindowDrag");
			this.dd.setHandleElId(this.el.id+"-head");
			this.dd.startDrag=this.constraints.createDelegate(this);
			this.dd.endDrag=this.endMove.createDelegate(this);
			this.initalized=true;

		}
		if(!this.el.isVisible()){
			var xy=block.el.getXY();
			this.xy[0]=xy[0]+20;
			this.xy[1]=xy[1]-200;
			this.el.setStyle('display','block');
			this.el.setBounds(this.xy[0],this.xy[1],this.size.width,this.size.height);
			this.el.show();

		}
		this.adjustViewport();

	},hide:function (){
		this.el.hide();
		this.el.setStyle("display","none");

	},constraints:function (){
		this.dd.resetConstraints();
		this.viewInfo=getViewportInfo();
		this.dd.setXConstraint(this.xy[0],this.viewInfo.pageWidth-this.xy[0]-this.size.width);
		this.dd.setYConstraint(this.xy[1],this.viewInfo.pageHeight-this.xy[0]-this.size.height);

	},endMove:function (){
		YAHOO.util.DDProxy.prototype.endDrag.apply(this.dd,arguments);
		this.refreshSize();

	},refreshSize:function (){
		this.size=this.el.getSize();
		this.xy=this.el.getXY();

	},showMessage:function (message,className){
		this.messageDiv.dom.innerHTML=message;
		if(className){
			this.messageDiv.dom.className=className;

		}
		this.messageDiv.show();

	},showError:function (message){
		this.showMessage(message,"error");

	},showLoading:function (message){
		this.showMessage(message,"loading");

	},hideMessage:function (){
		this.messageDiv.dom.className="";
		this.messageDiv.hide();

	}
};
YAHOO.ext.EventManager.onDocumentReady(Translations.init,Translations,true);