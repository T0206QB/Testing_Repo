!function(){var t="objListMoved",i="objListRemoved",s="listEndMoved",o="vertical",e="horizontal",l=function(){};l.prototype.C2_RUNTIME=cr_getC2Runtime(),l.prototype.waitList={},l.prototype.isInit=!1,l.prototype.init=function(t){if(!this.isInit)return this.isInit=!0,this.waitList={},this},l.prototype.createList=function(t,i,s,l,c){if(!this.waitList[t]){t=t,s=void 0!==s?s:0,l=void 0!==l?l:0,i=void 0===i||i!==e&&i!==o?o:i,c=void 0!==c?c:0;this.waitList[t]=(new n).create(this,t,i,s,l,c),this.checkListCount(!0)}},l.prototype.removeList=function(t){this.waitList[t]&&(delete this.waitList[t],this.checkListCount(!1))},l.prototype.checkListCount=function(t){var i=0;for(var s in this.waitList)i++;0===i&&this.C2_RUNTIME.untick2Me(this),1===i&&t&&this.C2_RUNTIME.tick2Me(this)},l.prototype.tick2=function(){for(var t in this.waitList)this.waitList[t].update(this.C2_RUNTIME.getDt())},l.prototype.setActivated=function(t,i){this.waitList[t]&&this.waitList[t].setActivated(!!i)},l.prototype.setStartPos=function(t,i){this.waitList[t]&&this.waitList[t].setStartPos(void 0!==i?i:0)},l.prototype.setOrientation=function(t,i){this.waitList[t]&&this.waitList[t].setOrientation(void 0===i||i!==e&&i!==o?o:i)},l.prototype.setOffset=function(t,i){this.waitList[t]&&this.waitList[t].setOffset(void 0!==i?i:0)},l.prototype.setHeight=function(t,i){this.waitList[t]&&this.waitList[t].setHeight(void 0!==i?i:0)},l.prototype.setOffsetStart=function(t,i){this.waitList[t]&&this.waitList[t].setOffsetStart(void 0!==i?i:0)},l.prototype.setRoundScroll=function(t,i,s,o){this.waitList[t]&&this.waitList[t].setRoundScroll(!(void 0===i||!i),!(void 0===s||!s),void 0!==o?o:10)},l.prototype.setClampObject=function(t,i,s,o){this.waitList[t]&&this.waitList[t].setClampObject(void 0!==i?i:null,void 0!==s?s:null,void 0!==o?o:0)},l.prototype.setCanMoveByUid=function(t,i,s){this.waitList[t]&&this.waitList[t].setCanMoveByUid(i,!!s)},l.prototype.setVisibleObject=function(t,i,s){this.waitList[t]&&this.waitList[t].setVisibleObject(i,!!s)},l.prototype.setTemporaryPosDrop=function(t,i){this.waitList[t]&&this.waitList[t].setTemporaryPosDrop(i)},l.prototype.setActiveCallbackByName=function(t,i,s){this.waitList[t]&&this.waitList[t].setActiveCallbackByName(i,!!s)},l.prototype.getPercentScrollList=function(t){if(this.waitList[t])return this.waitList[t].getPercentScrollList()},l.prototype.getPercentObjectOnList=function(t,i){if(this.waitList[t])return this.waitList[t].getPercentObjectOnList(i)},l.prototype.getVisibleObjectCount=function(t){if(this.waitList[t])return this.waitList[t].getVisibleObject()},l.prototype.getObjectCount=function(t){if(this.waitList[t])return this.waitList[t].getObjectCount()},l.prototype.getPosObjectByUid=function(t,i){return this.waitList[t]?this.waitList[t].getPosObjectByUid(i):-1},l.prototype.uidIsOnList=function(t,i){return!!this.waitList[t]&&this.waitList[t].uidIsOnList(i)},l.prototype.getRandomObjectOnList=function(t){return!!this.waitList[t]&&this.waitList[t].getRandomObjectOnList()},l.prototype.getRandomObjectVisibleOnList=function(t){return!!this.waitList[t]&&this.waitList[t].getRandomObjectVisibleOnList()},l.prototype.isOnMovement=function(t){return!!this.waitList[t]&&this.waitList[t].isOnMovement()},l.prototype.endMove=function(t){this.waitList[t]&&this.waitList[t].endMove()},l.prototype.resetMove=function(t){this.waitList[t]&&this.waitList[t].resetMove()},l.prototype.move=function(t,i){this.waitList[t]&&this.waitList[t].addScroll(i)},l.prototype.moveTo=function(t,i){this.waitList[t]&&this.waitList[t].setScroll(i)},l.prototype.movePercent=function(t,i){this.waitList[t]&&this.waitList[t].setScrollPercent(i)},l.prototype.moveToPercent=function(t,i){this.waitList[t]&&this.waitList[t].addScrollPercent(i)},l.prototype.addImpulsion=function(t,i){this.waitList[t]&&this.waitList[t].addImpulsion(i)},l.prototype.stopImpulsion=function(t){this.waitList[t]&&this.waitList[t].stopImpulsion()},l.prototype.addToList=function(t,i,s){if(this.waitList[t]){var o=this.C2_RUNTIME.getObjectByUID(i);this.waitList[t].addToList(i,o,s)}},l.prototype.removeToList=function(t,i){this.waitList[t]&&this.waitList[t].removeToList(i)},l.prototype.removeAllToList=function(t){this.waitList[t]&&this.waitList[t].removeAll()};var n=function(){};n.prototype.create=function(t,i,s,o,e,l){return this.activated=!0,this.waitingListManager=t,this.updateVisibility=!0,this.listName=i,this.orientation=s,this.startPos=o,this.offset=l,this.offsetScroll=this.offset/2,this.offsetStart=0,this.roundScroll=!1,this.listOfObjectVisible=0,this.temporaryPos=-1,this.actualDirection=0,this.activeCallback={objListMoved:!1,objListRemoved:!1,listEndMoved:!1},this.roundScroll_smoothScrollToMove=0,this.roundScroll_smoothSpeed=10,this.roundScroll_THRESHOLD=2,this.roundScroll_activeSmooth=!1,this.INERTIA_SCROLL_FACTOR=.9,this.INERTIA_ACCELERATION=.97,this.INERTIA_THRESHOLD=20,this.inertialVelocity=0,this.clampMinPosObject=null,this.clampMaxPosObject=null,this.offsetBetweenClamp=0,this.setHeight(e),this.maxScroll=0,this.listOfObject=[],this.listOfObjectUid={},this},n.prototype.isObjectOnListExist=function(t){return void 0!==this.listOfObjectUid[t]},n.prototype.setActivated=function(t){this.activated=t},n.prototype.setStartPos=function(t){this.startPos=t},n.prototype.setOrientation=function(t){this.orientation=t},n.prototype.setOffset=function(t){this.offset=t},n.prototype.setHeight=function(t){this.baseHeight=t,this.height=this.baseHeight-this.offsetStart},n.prototype.setOffsetStart=function(t){this.offsetStart=t,this.setHeight(this.baseHeight),this.calculMaxScroll()},n.prototype.setRoundScroll=function(t,i,s){this.roundScroll=t,this.roundScroll_activeSmooth=i,this.roundScroll_smoothSpeed=s},n.prototype.setClampObject=function(t,i,s){this.clampMinPosObject=t,this.clampMaxPosObject=i,this.offsetBetweenClamp=s},n.prototype.setCanMoveByUid=function(t,i){return!!this.isObjectOnListExist(t)&&this.listOfObjectUid[t].setCanMove(i)},n.prototype.setVisibleObject=function(t,i){if(!this.isObjectOnListExist(t))return!1;this.listOfObjectUid[t].setVisible(i)&&(this.updateVisibility=!0)},n.prototype.setTemporaryPosDrop=function(t){this.temporaryPos=t},n.prototype.setActiveCallbackByName=function(t,i){this.activeCallback[t]=i},n.prototype.getPercentScrollList=function(){var t=this.offset/2;return 100*(this.offsetScroll-t)/(this.maxScroll-t)},n.prototype.getPercentObjectOnList=function(t){return!!this.isObjectOnListExist(t)&&this.listOfObjectUid[t].getPercentOnList()},n.prototype.getVisibleObject=function(){return this.listOfObjectVisible},n.prototype.getObjectCount=function(){return this.listOfObject.length},n.prototype.getPosObjectByUid=function(t){return this.isObjectOnListExist(t)?this.listOfObjectUid[t].posToShow:-1},n.prototype.uidIsOnList=function(t){return this.isObjectOnListExist(t)},n.prototype.getRandomObjectOnList=function(){return this.listOfObject.length<=0?-1:this.listOfObject[Math.floor(Math.random()*this.listOfObject.length)].uid},n.prototype.getRandomObjectVisibleOnList=function(){if(this.listOfObject.length<=0)return-1;for(var t=[],i=0;i<this.listOfObject.length;i++)this.listOfObject[i].visible&&t.push(this.listOfObject[i]);return t.length>0?t[Math.floor(Math.random()*t.length)].uid:-1},n.prototype.isOnMovement=function(){return!(this.listOfObject.length<=0)&&(0!=this.inertialVelocity||0!=this.roundScroll_smoothScrollToMove)},n.prototype.setActualPos=function(t){t>this.offsetScroll?this.actualDirection=-1:t<this.offsetScroll&&(this.actualDirection=1)},n.prototype.resetMove=function(){this.actualDirection=0,this.stopImpulsion(),this.stopMoveRoundScroll()},n.prototype.setScroll=function(t){this.listOfObjectVisible*this.offset<=this.height||(this.setActualPos(t),this.offsetScroll=t,this.clampScroll())},n.prototype.addScroll=function(t){this.setScroll(t+this.offsetScroll)},n.prototype.setScrollPercent=function(t){this.setScroll(this.getScrollByPercent(t))},n.prototype.addScrollPercent=function(t){this.setScrollPercent(t+this.getScrollPercent())},n.prototype.endMove=function(){if(this.roundScroll)if(this.roundScroll_activeSmooth){if(this.listOfObjectVisible>1){var t=this.offsetScroll;this.actualDirection<0?t=this.getScrollByPercent((o=this.getScrollPercent(),e=100/(this.listOfObjectVisible-1),Math.floor(o/e)*e)):this.actualDirection>0&&(t=this.getScrollByPercent(function(t,i){return Math.ceil(t/i)*i}(this.getScrollPercent(),100/(this.listOfObjectVisible-1))));var i=t-this.offsetScroll;this.roundScroll_smoothScrollToMove=i,0==i&&this.endMoveRoundScroll()}}else this.endMoveRoundScroll();else this.activeCallback.listEndMoved&&c2_callFunction(s,[this.listName]);var o,e},n.prototype.endMoveRoundScroll=function(){var t,i;this.roundScroll&&(this.listOfObjectVisible>1&&this.setScroll(this.getScrollByPercent((t=this.getScrollPercent(),i=100/(this.listOfObjectVisible-1),Math.round(t/i)*i))),this.activeCallback.listEndMoved&&c2_callFunction(s,[this.listName],"scrollList"))},n.prototype.stopMoveRoundScroll=function(){this.roundScroll_smoothScrollToMove=0},n.prototype.getScrollPercent=function(){return Math.abs(100*(this.offsetScroll-this.offset/2)/(this.maxScroll-this.offset/2))},n.prototype.getScrollByPercent=function(t){return(this.maxScroll-this.offset/2)*t/100+this.offset/2},n.prototype.addImpulsion=function(t){this.inertialVelocity=t},n.prototype.stopImpulsion=function(){this.inertialVelocity=0},n.prototype.clampScroll=function(){this.offsetScroll=h(this.offsetScroll,this.maxScroll,this.offset/2)},n.prototype.calculMaxScroll=function(){this.maxScroll=this.height+this.offset/2-this.offset*this.listOfObjectVisible},n.prototype.addToList=function(t,i,s){if(this.isObjectOnListExist(t))return this.listOfObjectUid[t].update(),!1;s=void 0===s?this.listOfObject.length:h(s,0,this.listOfObject.length);for(var o=0;o<this.listOfObject.length;o++)this.listOfObject[o].pos>=s&&this.listOfObject[o].moveCaseByLogic(1);var e=(new c).create(this,i,s,!0);this.listOfObjectUid[t]=e,this.listOfObject.push(e),this.updateVisibility=!0,this.calculMaxScroll(),this.clampScroll()},n.prototype.removeToList=function(t){if(!this.isObjectOnListExist(t))return!1;for(var i,s,o=0;o<this.listOfObject.length;o++)if(this.listOfObject[o].uid===t){i=o,s=this.listOfObject[o].pos;break}if(void 0!==s){for(o=0;o<this.listOfObject.length;o++)this.listOfObject[o].pos>s&&this.listOfObject[o].moveCaseByLogic(-1);this.listOfObject[i].visible&&this.listOfObjectVisible--;var e=this.listOfObject[i];delete this.listOfObjectUid[t],this.listOfObject.splice(i,1),e.removeIt(),e=void 0,this.updateVisibility=!0,this.calculMaxScroll(),this.clampScroll()}else console.log("NEW CASE TO REMOVE FROM THE LIST IS NOT FOUND")},n.prototype.removeAll=function(){for(var t in this.listOfObjectUid)this.removeToList(parseInt(t))},n.prototype.update=function(t){if(this.activated){if(this.updateVisibility&&this.updateObjVisibility(),0!=this.inertialVelocity){this.addScroll(this.inertialVelocity*this.INERTIA_SCROLL_FACTOR*t),this.inertialVelocity=this.inertialVelocity*(1-this.INERTIA_ACCELERATION*t);var i=this.offsetScroll;(Math.abs(this.inertialVelocity)<this.INERTIA_THRESHOLD||i!=this.offsetScroll)&&(this.inertialVelocity=0,this.endMove())}if(0!=this.roundScroll_smoothScrollToMove){var s=this.roundScroll_smoothScrollToMove*this.roundScroll_smoothSpeed*t;this.addScroll(s),this.roundScroll_smoothScrollToMove-=s,Math.abs(this.roundScroll_smoothScrollToMove)<this.roundScroll_THRESHOLD&&(this.roundScroll_smoothScrollToMove=0,this.endMoveRoundScroll())}for(var o=0;o<this.listOfObject.length;o++)this.listOfObject[o].update(t)}},n.prototype.updateObjVisibility=function(){var t=0;this.listOfObject.sort((function(t,i){return t.pos-i.pos}));for(var i=0;i<this.listOfObject.length;i++)this.listOfObject[i].posToShow=this.listOfObject[i].visible?t++:-1;this.listOfObjectVisible=t,this.updateVisibility=!1,this.calculMaxScroll(),this.clampScroll()};var c=function(){};function h(t,i,s){return Math.min(s,Math.max(i,t))}c.prototype.create=function(t,i,s,o){return this.list=t,this.object=i,this.pos=void 0!==s?s:-1,this.posToShow=this.pos,this.visible=void 0===o||o,this.uid=this.object.uid,this.canMove=!0,this.update(),this},c.prototype.removeIt=function(){this.list.activeCallback.objListRemoved&&c2_callFunction(i,[this.uid],"scrollList")},c.prototype.setCanMove=function(t){this.canMove=t},c.prototype.moveCaseByLogic=function(t){this.pos+=t,this.visible&&(this.posToShow+=t,this.update())},c.prototype.update=function(){if(this.list.activated&&this.canMove&&-2!=this.posToShow){this.list.waitingListManager.C2_RUNTIME.getDt(this.object);var i=this.list.orientation==o?this.list.startPos:this.getPosObject(),s=this.list.orientation==e?this.list.startPos:this.getPosObject();if(null!=this.list.clampMinPosObject&&null!=this.list.clampMaxPosObject){var l=this.list.clampMinPosObject+this.posToShow*this.list.offsetBetweenClamp,n=this.list.clampMaxPosObject-(this.list.listOfObjectVisible-1-this.posToShow)*this.list.offsetBetweenClamp;this.list.orientation==e&&(i=h(i,l,n)),this.list.orientation==o&&(s=h(s,l,n))}i==this.object.x&&s==this.object.y||(this.object.x=i,this.object.y=s,this.object.set_bbox_changed(),this.list.activeCallback.objListMoved&&c2_callFunction(t,[this.object.uid],"scrollList")),-1==this.posToShow&&this.posToShow}},c.prototype.setVisible=function(t){return this.visible!=t&&(this.visible=t,!0)},c.prototype.getPosObject=function(){return this.list.offsetStart+this.list.offsetScroll+(this.posToShow+(-1!=this.list.temporaryPos&&this.posToShow>=this.list.temporaryPos?1:0))*this.list.offset},c.prototype.getPercentOnList=function(){var t=this.getPosObject()-this.list.offsetStart,i=this.list.maxScroll,s=this.list.height,l=0;if(null!=this.list.clampMinPosObject&&null!=this.list.clampMaxPosObject){l=this.list.clampMinPosObject+this.posToShow*this.list.offsetBetweenClamp-this.list.offsetStart;var n=this.list.clampMaxPosObject-(this.list.listOfObjectVisible-1-this.posToShow)*this.list.offsetBetweenClamp-this.list.offsetStart;this.list.orientation==e&&(t=h(t,l,n)),this.list.orientation==o&&(t=h(t,l,n)),i=l,s=n}return t<0||l<0?100*(t-i)/(s-i):Math.abs(100*t/(s-i))},"object"!=typeof window.playtouch&&(window.playtouch={}),playtouch.waitingListManager=(new l).init(),playtouch.waitingListManager.VERSION="1.3"}();