(function(){var shopManager=function(){};shopManager.version="2.1",shopManager.prototype.init=function(t){var e=this.getBaseStash();for(var a in t.shop)e.stash.items[a]=this.createObject(t.shop[a].unlocked,t.shop[a].quantity);return JSON.stringify(e)},shopManager.prototype.getBaseStash=function(){return{stash:{items:{},money:{normal:{gold:0,silver:0,bronze:0},premium:{gold:0}}}}},shopManager.prototype.createObject=function(t,e){var a=void 0===t?1:t,s=void 0===e?0:e;return{unlocked:a,quantity:s}},shopManager.prototype.test=function(_variable,_comparator,_value){try{if(eval(_variable+_comparator+_value))return!0}catch(t){console.error("function Test of 'shopManager' ERROR"),console.error(t.stack)}return!1},shopManager.prototype.saveStash=function(t){for(var e in t=JSON.parse(t),t.stash.items)t.stash.items[e].quantity<=0&&0==t.stash.items[e].unlocked&&delete t.stash.items[e];return JSON.stringify(t)},shopManager.prototype.loadStash=function(t,e){var a=JSON.parse(t),s=JSON.parse(this.init(a));for(var n in e=JSON.parse(e),Object.assign(s.stash.items,e.stash.items),Object.assign(s.stash.money,e.stash.money),s.stash.items)a.shop[n]&&(s.stash.items[n].quantity=Math.min(s.stash.items[n].quantity,a.shop[n].quantityMax));return JSON.stringify(s)},"object"!=typeof window.playtouch&&(window.playtouch={}),playtouch.shopManager=new shopManager})(),"function"!=typeof Object.assign&&(Object.assign=function(t){"use strict";if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),a=1;a<arguments.length;a++){var s=arguments[a];if(null!=s)for(var n in s)s.hasOwnProperty(n)&&(e[n]=s[n])}return e});