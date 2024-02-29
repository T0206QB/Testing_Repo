!function(){var t="objListMoved",i="objListRemoved",s="vertical",e="horizontal",o=function(){};o.prototype.C2_RUNTIME=cr_getC2Runtime(),o.prototype.waitList={},o.prototype.isInit=!1,o.prototype.init=function(t){if(!this.isInit)return this.isInit=!0,this.waitList={},this},o.prototype.createList=function(t,i,o,n,c){if(!this.waitList[t]){t=t,o=void 0!==o?o:0,n=void 0!==n?n:0,i=void 0===i||i!==e&&i!==s?s:i,c=void 0!==c?c:0;this.waitList[t]=(new h).create(this,t,i,o,n,c),this.checkListCount(!0)}},o.prototype.removeList=function(t){this.waitList[t]&&(delete this.waitList[t],this.checkListCount(!1))},o.prototype.checkListCount=function(t){var i=0;for(var s in this.waitList)i++;0===i&&this.C2_RUNTIME.untick2Me(this),1===i&&t&&this.C2_RUNTIME.tick2Me(this)},o.prototype.tick2=function(){for(var t in this.waitList)this.waitList[t].update(this.C2_RUNTIME.getDt())},o.prototype.setActivated=function(t,i){this.waitList[t]&&this.waitList[t].setActivated(!!i)},o.prototype.setStartPos=function(t,i){this.waitList[t]&&this.waitList[t].setStartPos(void 0!==i?i:0)},o.prototype.setOrientation=function(t,i){this.waitList[t]&&this.waitList[t].setOrientation(void 0===i||i!==e&&i!==s?s:i)},o.prototype.setOffset=function(t,i){this.waitList[t]&&this.waitList[t].setOffset(void 0!==i?i:0)},o.prototype.setHeight=function(t,i){this.waitList[t]&&this.waitList[t].setHeight(void 0!==i?i:0)},o.prototype.setOffsetStart=function(t,i){this.waitList[t]&&this.waitList[t].setOffsetStart(void 0!==i?i:0)},o.prototype.setRoundScroll=function(t,i){this.waitList[t]&&this.waitList[t].setRoundScroll(!(void 0===i||!i))},o.prototype.setClampObject=function(t,i,s,e){this.waitList[t]&&this.waitList[t].setClampObject(void 0!==i?i:null,void 0!==s?s:null,void 0!==e?e:0)},o.prototype.setCanMoveByUid=function(t,i,s){this.waitList[t]&&this.waitList[t].setCanMoveByUid(i,!!s)},o.prototype.setVisibleObject=function(t,i,s){this.waitList[t]&&this.waitList[t].setVisibleObject(i,!!s)},o.prototype.setTemporaryPosDrop=function(t,i){this.waitList[t]&&this.waitList[t].setTemporaryPosDrop(i)},o.prototype.getPercentObjectOnList=function(t,i){if(this.waitList[t])return this.waitList[t].getPercentObjectOnList(i)},o.prototype.getVisibleObjectCount=function(t){if(this.waitList[t])return this.waitList[t].getVisibleObject()},o.prototype.getObjectCount=function(t){if(this.waitList[t])return this.waitList[t].getObjectCount()},o.prototype.getPosObjectByUid=function(t,i){return this.waitList[t]?this.waitList[t].getPosObjectByUid(i):-1},o.prototype.uidIsOnList=function(t,i){return!!this.waitList[t]&&this.waitList[t].uidIsOnList(i)},o.prototype.endMove=function(t){this.waitList[t]&&this.waitList[t].endMove()},o.prototype.move=function(t,i){this.waitList[t]&&this.waitList[t].addScroll(i)},o.prototype.moveTo=function(t,i){this.waitList[t]&&this.waitList[t].setScroll(i)},o.prototype.movePercent=function(t,i){this.waitList[t]&&this.waitList[t].setScrollPercent(i)},o.prototype.moveToPercent=function(t,i){this.waitList[t]&&this.waitList[t].addScrollPercent(i)},o.prototype.addImpulsion=function(t,i){this.waitList[t]&&this.waitList[t].addImpulsion(i)},o.prototype.stopImpulsion=function(t){this.waitList[t]&&this.waitList[t].stopImpulsion()},o.prototype.addToList=function(t,i,s){if(this.waitList[t]){var e=this.C2_RUNTIME.getObjectByUID(i);this.waitList[t].addToList(i,e,s)}},o.prototype.removeToList=function(t,i){this.waitList[t]&&this.waitList[t].removeToList(i)},o.prototype.removeAllToList=function(t){this.waitList[t]&&this.waitList[t].removeAll()};var h=function(){};h.prototype.create=function(t,i,s,e,o,h){return this.activated=!0,this.waitingListManager=t,this.updateVisibility=!0,this.listName=i,this.orientation=s,this.startPos=e,this.offset=h,this.offsetScroll=this.offset/2,this.offsetStart=0,this.roundScroll=!1,this.listOfObjectVisible=0,this.temporaryPos=-1,this.INERTIA_SCROLL_FACTOR=.9,this.INERTIA_ACCELERATION=.97,this.INERTIA_THRESHOLD=20,this.inertialVelocity=0,this.clampMinPosObject=null,this.clampMaxPosObject=null,this.offsetBetweenClamp=0,this.setHeight(o),this.maxScroll=0,this.listOfObject=[],this.listOfObjectUid={},this},h.prototype.isObjectOnListExist=function(t){return void 0!==this.listOfObjectUid[t]},h.prototype.setActivated=function(t){this.activated=t},h.prototype.setStartPos=function(t){this.startPos=t},h.prototype.setOrientation=function(t){this.orientation=t},h.prototype.setOffset=function(t){this.offset=t},h.prototype.setHeight=function(t){this.baseHeight=t,this.height=this.baseHeight-this.offsetStart},h.prototype.setOffsetStart=function(t){this.offsetStart=t,this.setHeight(this.baseHeight),this.calculMaxScroll()},h.prototype.setRoundScroll=function(t){this.roundScroll=t},h.prototype.setClampObject=function(t,i,s){this.clampMinPosObject=t,this.clampMaxPosObject=i,this.offsetBetweenClamp=s},h.prototype.setCanMoveByUid=function(t,i){return!!this.isObjectOnListExist(t)&&this.listOfObjectUid[t].setCanMove(i)},h.prototype.setVisibleObject=function(t,i){if(!this.isObjectOnListExist(t))return!1;this.listOfObjectUid[t].setVisible(i)&&(this.updateVisibility=!0)},h.prototype.setTemporaryPosDrop=function(t){this.temporaryPos=t},h.prototype.getPercentObjectOnList=function(t){return!!this.isObjectOnListExist(t)&&this.listOfObjectUid[t].getPercentOnList()},h.prototype.getVisibleObject=function(){return this.listOfObjectVisible},h.prototype.getObjectCount=function(){return this.listOfObject.length},h.prototype.getPosObjectByUid=function(t){return this.isObjectOnListExist(t)?this.listOfObjectUid[t].posToShow:-1},h.prototype.uidIsOnList=function(t){return this.isObjectOnListExist(t)},h.prototype.setScroll=function(t){this.listOfObjectVisible*this.offset<=this.height||(this.offsetScroll=t,this.clampScroll())},h.prototype.addScroll=function(t){this.setScroll(t+this.offsetScroll)},h.prototype.setScrollPercent=function(t){this.setScroll(this.getScrollByPercent(t))},h.prototype.addScrollPercent=function(t){this.setScrollPercent(t+this.getScrollPercent())},h.prototype.endMove=function(){var t,i;this.roundScroll&&(this.listOfObjectVisible>1&&(this.offsetScroll=this.getScrollByPercent((t=this.getScrollPercent(),i=100/(this.listOfObjectVisible-1),Math.round(t/i)*i))),this.clampScroll())},h.prototype.getScrollPercent=function(){return Math.abs(100*(this.offsetScroll-this.offset/2)/(this.maxScroll-this.offset/2))},h.prototype.getScrollByPercent=function(t){return(this.maxScroll-this.offset/2)*t/100+this.offset/2},h.prototype.addImpulsion=function(t){this.inertialVelocity=t},h.prototype.stopImpulsion=function(){this.inertialVelocity=0},h.prototype.clampScroll=function(){this.offsetScroll=c(this.offsetScroll,this.maxScroll,this.offset/2)},h.prototype.calculMaxScroll=function(){this.maxScroll=this.height+this.offset/2-this.offset*this.listOfObjectVisible},h.prototype.addToList=function(t,i,s){if(this.isObjectOnListExist(t))return this.listOfObjectUid[t].update(),!1;s=void 0===s?this.listOfObject.length:c(s,0,this.listOfObject.length);for(var e=0;e<this.listOfObject.length;e++)this.listOfObject[e].pos>=s&&this.listOfObject[e].moveCaseByLogic(1);var o=(new n).create(this,i,s,!0);this.listOfObjectUid[t]=o,this.listOfObject.push(o),this.updateVisibility=!0,this.calculMaxScroll(),this.clampScroll()},h.prototype.removeToList=function(t){if(!this.isObjectOnListExist(t))return!1;for(var i,s,e=0;e<this.listOfObject.length;e++)if(this.listOfObject[e].uid===t){i=e,s=this.listOfObject[e].pos;break}if(void 0!==s){for(e=0;e<this.listOfObject.length;e++)this.listOfObject[e].pos>s&&this.listOfObject[e].moveCaseByLogic(-1);this.listOfObject[i].visible&&this.listOfObjectVisible--;var o=this.listOfObject[i];delete this.listOfObjectUid[t],this.listOfObject.splice(i,1),o.removeIt(),o=void 0,this.updateVisibility=!0,this.calculMaxScroll(),this.clampScroll()}else console.log("NEW CASE TO REMOVE FROM THE LIST IS NOT FOUND")},h.prototype.removeAll=function(){for(var t in this.listOfObjectUid)this.removeToList(parseInt(t))},h.prototype.update=function(t){if(this.activated){if(this.updateVisibility&&this.updateObjVisibility(),0!=this.inertialVelocity){this.offsetScroll+=this.inertialVelocity*this.INERTIA_SCROLL_FACTOR*t,this.inertialVelocity=this.inertialVelocity*this.INERTIA_ACCELERATION;var i=this.offsetScroll;this.clampScroll(),(Math.abs(this.inertialVelocity)<this.INERTIA_THRESHOLD||i!=this.offsetScroll)&&(this.inertialVelocity=0)}for(var s=0;s<this.listOfObject.length;s++)this.listOfObject[s].update(t)}},h.prototype.updateObjVisibility=function(){var t=0;this.listOfObject.sort((function(t,i){return t.pos-i.pos}));for(var i=0;i<this.listOfObject.length;i++)this.listOfObject[i].posToShow=this.listOfObject[i].visible?t++:-1;this.listOfObjectVisible=t,this.updateVisibility=!1,this.calculMaxScroll(),this.clampScroll()};var n=function(){};function c(t,i,s){return Math.min(s,Math.max(i,t))}n.prototype.create=function(t,i,s,e){return this.list=t,this.object=i,this.pos=void 0!==s?s:-1,this.posToShow=this.pos,this.visible=void 0===e||e,this.uid=this.object.uid,this.canMove=!0,this.update(),this},n.prototype.removeIt=function(){c2_callFunction(i,[this.uid])},n.prototype.setCanMove=function(t){this.canMove=t},n.prototype.moveCaseByLogic=function(t){this.pos+=t,this.visible&&(this.posToShow+=t,this.update())},n.prototype.update=function(){if(this.list.activated&&this.canMove&&-2!=this.posToShow){this.list.waitingListManager.C2_RUNTIME.getDt(this.object);var i=this.list.orientation==s?this.list.startPos:this.getPosObject(),o=this.list.orientation==e?this.list.startPos:this.getPosObject();if(null!=this.list.clampMinPosObject&&null!=this.list.clampMaxPosObject){var h=this.list.clampMinPosObject+this.posToShow*this.list.offsetBetweenClamp,n=this.list.clampMaxPosObject-(this.list.listOfObjectVisible-1-this.posToShow)*this.list.offsetBetweenClamp;this.list.orientation==e&&(i=c(i,h,n)),this.list.orientation==s&&(o=c(o,h,n))}i==this.object.x&&o==this.object.y||(this.object.x=i,this.object.y=o,this.object.set_bbox_changed(),c2_callFunction(t,[this.object.uid])),-1==this.posToShow&&this.posToShow}},n.prototype.setVisible=function(t){return this.visible!=t&&(this.visible=t,!0)},n.prototype.getPosObject=function(){return this.list.offsetStart+this.list.offsetScroll+(this.posToShow+(-1!=this.list.temporaryPos&&this.posToShow>=this.list.temporaryPos?1:0))*this.list.offset},n.prototype.getPercentOnList=function(){var t=this.getPosObject()-this.list.offsetStart,i=this.list.maxScroll,o=this.list.height,h=0;if(null!=this.list.clampMinPosObject&&null!=this.list.clampMaxPosObject){h=this.list.clampMinPosObject+this.posToShow*this.list.offsetBetweenClamp-this.list.offsetStart;var n=this.list.clampMaxPosObject-(this.list.listOfObjectVisible-1-this.posToShow)*this.list.offsetBetweenClamp-this.list.offsetStart;this.list.orientation==e&&(t=c(t,h,n)),this.list.orientation==s&&(t=c(t,h,n)),i=h,o=n}return t<0||h<0?100*(t-i)/(o-i):Math.abs(100*t/(o-i))},"object"!=typeof window.playtouch&&(window.playtouch={}),playtouch.waitingListManager=(new o).init()}();