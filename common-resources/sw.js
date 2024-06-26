"use strict";function PostBroadcastMessage(e){broadcastChannel&&setTimeout(()=>broadcastChannel.postMessage(e),3e3)}function Broadcast(e){PostBroadcastMessage({type:e})}function BroadcastDownloadingUpdate(e){PostBroadcastMessage({type:"downloading-update",version:e})}function BroadcastUpdateReady(e){PostBroadcastMessage({type:"update-ready",version:e})}function GetCacheBaseName(){return CACHE_NAME_PREFIX+"-"+self.registration.scope}function GetCacheVersionName(e){return GetCacheBaseName()+"-v"+e}function GetAvailableCacheNames(){return caches.keys().then(e=>{const t=GetCacheBaseName();return e.filter(e=>e.startsWith(t))})}function IsUpdatePending(){return GetAvailableCacheNames().then(e=>e.length>=2)}function GetMainPageUrl(){return clients.matchAll({includeUncontrolled:!0,type:"window"}).then(e=>{for(let t of e){let e=t.url;if(e.startsWith(self.registration.scope)&&(e=e.substring(self.registration.scope.length)),e&&"/"!==e)return e.startsWith("?")&&(e="/"+e),e}return""})}function fetchWithBypass(e,t){if("string"==typeof e&&(e=new Request(e)),t){const t=new URL(e.url);return t.search+=Math.floor(1e6*Math.random()),fetch(t,{headers:e.headers,mode:e.mode,credentials:e.credentials,redirect:e.redirect,cache:"no-store"})}return fetch(e)}function CreateCacheFromFileList(e,t,n){return Promise.all(t.map(e=>fetchWithBypass(e,n))).then(n=>{let a=!0;for(let e of n)e.ok||(a=!1,console.error(CONSOLE_PREFIX+"Error fetching '"+originalUrl+"' ("+e.status+" "+e.statusText+")"));if(!a)throw new Error("not all resources were fetched successfully");return caches.open(e).then(e=>Promise.all(n.map((n,a)=>e.put(t[a],n)))).catch(t=>{throw console.error(CONSOLE_PREFIX+"Error writing cache entries: ",t),caches.delete(e),t})})}function UpdateCheck(e){return fetchWithBypass(OFFLINE_DATA_FILE,!0).then(e=>e.json()).then(t=>{const n=t.version;let a=t.fileList;const s=GetCacheVersionName(n);return caches.has(s).then(t=>t?IsUpdatePending().then(e=>{e?(console.log(CONSOLE_PREFIX+"Update pending"),Broadcast("update-pending")):(console.log(CONSOLE_PREFIX+"Up to date"),Broadcast("up-to-date"))}):GetMainPageUrl().then(t=>(a.unshift("./"),t&&-1===a.indexOf(t)&&a.unshift(t),console.log(CONSOLE_PREFIX+"Caching "+a.length+" files for offline use"),e?Broadcast("downloading"):BroadcastDownloadingUpdate(n),CreateCacheFromFileList(s,a,!e).then(IsUpdatePending).then(e=>{e?(console.log(CONSOLE_PREFIX+"All resources saved, update ready"),BroadcastUpdateReady(n)):(console.log(CONSOLE_PREFIX+"All resources saved, offline support ready"),Broadcast("offline-ready"))}))))}).catch(e=>{console.warn(CONSOLE_PREFIX+"Update check failed: ",e)})}const OFFLINE_DATA_FILE="offline.js",CACHE_NAME_PREFIX="c2offline",BROADCASTCHANNEL_NAME="offline",CONSOLE_PREFIX="[SW] ",broadcastChannel="undefined"==typeof BroadcastChannel?null:new BroadcastChannel(BROADCASTCHANNEL_NAME);self.addEventListener("install",e=>{e.waitUntil(UpdateCheck(!0).catch(()=>null))}),self.addEventListener("fetch",e=>{const t="navigate"===e.request.mode;let n=GetAvailableCacheNames().then(n=>n.length?Promise.resolve().then(()=>1!==n.length&&t?clients.matchAll().then(e=>{if(e.length>1)return n[0];let t=n[n.length-1];return console.log(CONSOLE_PREFIX+"Updating to new version"),Promise.all(n.slice(0,-1).map(e=>caches.delete(e))).then(()=>t)}):n[0]).then(t=>caches.open(t).then(t=>t.match(e.request)).then(t=>t||fetch(e.request))):fetch(e.request));t&&e.waitUntil(n.then(()=>UpdateCheck(!1))),e.respondWith(n)});