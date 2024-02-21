var pendingLog=[],Tile=function(t,e,i){this.type=10,this.color=10,this.logicX="number"==typeof e?e:-1,this.logicY="number"==typeof i?i:-1,this.ghost=!1,this.checked=!1,this.toCollapse=!1,this.lastGridChanges={},this.grid=t,this.adjacentLinks="0000"};Tile.prototype.setType=function(t){return"number"!=typeof t&&(t=0),this.type=t,this},Tile.prototype.getType=function(){return this.type},Tile.prototype.setColor=function(t){return"number"!=typeof t&&(t=10),this.color=t,this.getGrid().setHighestColor(this.color),this},Tile.prototype.getColor=function(){return this.isGhost?-1:this.color},Tile.prototype.getLogicX=function(){return this.logicX},Tile.prototype.getLogicY=function(){return this.logicY},Tile.prototype.setGhost=function(t){return"boolean"!=typeof t&&(t=!0),this.ghost=t,this},Tile.prototype.setChecked=function(t){return"boolean"!=typeof t&&(t=!0),this.checked=t,this},Tile.prototype.isChecked=function(){return this.checked},Tile.prototype.setToCollapse=function(t){return"boolean"!=typeof t&&(t=!0),this.toCollapse=t,this},Tile.prototype.toCollapse=function(){return this.toCollapse},Tile.prototype.isOnGrid=function(){return!this.ghost&&this.logicX>=0&&this.logicX<this.getGrid().getWidth()&&this.logicY>=0&&this.logicY<this.getGrid().getHeight()},Tile.prototype.setGrid=function(t){return"object"==typeof t&&(this.grid=t),this.grid},Tile.prototype.getGrid=function(){return this.grid},Tile.prototype.setLogic=function(t,e){return"number"!=typeof t&&(t=-1),"number"!=typeof e&&(e=-1),this.logicX=t,this.logicY=e,this},Tile.prototype.getNeighbour=function(t,e){return this.getGrid().getTileAt(this.logicX+t,this.logicY+e)},Tile.prototype.randColor=function(t){return"number"!=typeof t&&(t=this.getGrid().getWidth()),this.setColor(10+Math.floor(Math.random()*t))},Tile.prototype.buildAdjacentLinks=function(t){if(!this.isGhost){"boolean"!=typeof t&&(t=!0),this.adjacentLinks="";var e=[[0,-1],[1,0],[0,1],[-1,0]];for(var i in e)if(e.hasOwnProperty(i)){var o=this.getGrid().getTileAt(this.logicX+e[i][0],this.logicY+e[i][1],!0);this.adjacentLinks+=o.getColor()===this.getColor()?"1":"0"}return this}},Tile.prototype.getAdjacentLinks=function(){return this.adjacentLinks};var Grid=function(){this.width=0,this.height=0,this.tiles={count:0},this.logMeIAmFamous=!1,this.lastCollapsedTiles=[],this.lastCollapsedCenter=!1,this.lowestColor=999,this.highestColor=0};Grid.prototype.getTilesCount=function(){return this.tiles.count},Grid.prototype.getWidth=function(){return this.width},Grid.prototype.getLowestColor=function(){return this.lowestColor},Grid.prototype.getHighestColor=function(){return this.highestColor},Grid.prototype.setLowestColor=function(t){return"number"==typeof t&&(this.lowestColor>t?this.lowestColor=t:this.lowestColor=this.findLowestColor()),this},Grid.prototype.findLowestColor=function(){this.lowestColor=999;for(var t=0;t<this.width;t++)for(var e=0;e<this.height;e++)!this.getTileAt(t,e).isChecked()&&this.lowestColor>this.getTileAt(t,e).getColor()&&(this.lowestColor=this.getTileAt(t,e).getColor());return this},Grid.prototype.setHighestColor=function(t){return this.highestColor<t&&(this.highestColor=t),this},Grid.prototype.getHeight=function(){return this.height},Grid.prototype.setGridSize=function(t,e){return"number"==typeof t&&"number"!=typeof e&&(e=t),"number"!=typeof t&&(t=5),"number"!=typeof e&&(e=5),this.width=t,this.height=e,this.tiles={count:0},this},Grid.prototype.getTileAt=function(t,e,i){return"object"==typeof t&&void 0!==t.length&&t.length>1&&(e=parseInt(t[1]),t=parseInt(t[0])),"number"==typeof t&&"number"==typeof e||console.error("missing coordinates : ",arguments),void 0===this.tiles[t+"_"+e]?!("boolean"!=typeof i||!i)&&new Tile(this,t,e).setGhost(!0):this.tiles[t+"_"+e]},Grid.prototype.addTileAt=function(t,e,i){if(void 0===t&&console.error("missing tile"),"object"==typeof t&&"number"==typeof t.length){for(var o=0;o<t.length;o++)this.addTileAt(t[o]);return this}return"number"!=typeof e&&(e=t.logicX),"number"!=typeof i&&(i=t.logicY),this.tiles[e+"_"+i]=t.setGrid(this),this},Grid.prototype.populate=function(t,e,i){"boolean"!=typeof i&&(i=!0),this.setGridSize(t,e);for(var o=0;o<this.width;o++)for(var r=0;r<this.height;r++){var s=new Tile(this).setLogic(o,r);i&&s.setColor(this.getARandomColor(10,14)),this.tiles[o+"_"+r]=s}return this.tiles.count=this.width*this.height,this},Grid.prototype.getNeighboursOf=function(t,e,i){"object"==typeof t&&"function"==typeof t.getLogicY&&(e=t.getLogicY(),t=t.getLogicX()),("string"!=typeof i||"+"!==i&&"x"!==i&&"o"!==i)&&(i="+");var o,r,s=[];switch(i){case"o":case"circle":case"around":r=[[-1,-1],[1,-1],[1,1],[-1,1],[-1,0],[0,-1],[1,0],[0,1]];break;case"x":case"diag":case"diagonal":case"diagonals":r=[[-1,-1],[1,-1],[1,1],[-1,1]];break;default:r=[[-1,0],[0,-1],[1,0],[0,1]]}"number"!=typeof e&&(e=0),"object"==typeof t&&void 0!==t.color&&(e=t.logicY,t=t.logicX),"object"==typeof t&&void 0!==t.length&&t.length>1&&(e=parseInt(t[1]),t=parseInt(t[0])),"number"!=typeof t&&(t=0);for(var n=0;n<r.length;n++)(o=this.getTileAt(t+r[n][0],e+r[n][1]))&&o.isOnGrid()&&s.push(o);return s},Grid.prototype.getSameColorNeighboursOf=function(t,e,i){"object"==typeof t&&"function"==typeof t.getLogicY&&(e=t.getLogicY(),t=t.getLogicX());for(var o=this.getNeighboursOf(t,e,i),r=this.getTileAt(t,e).getColor(),s=o.length-1;s>=0;s--)!1!==o[s]&&o[s].getColor()===r||o.splice(s,1);return o},Grid.prototype.getSameColorNotCheckedNeighboursOf=function(t,e,i){"object"==typeof t&&"function"==typeof t.getLogicY&&(e=t.getLogicY(),t=t.getLogicX());for(var o=this.getNeighboursOf(t,e,i),r=this.getTileAt(t,e).getColor(),s=o.length-1;s>=0;s--)(!1===o[s]||o[s].isChecked()||o[s].getColor()!==r)&&o.splice(s,1);return o},Grid.prototype.getTilesMatching=function(t,e){"object"!=typeof t&&(t={});var i=[],o=Object.keys(t).length;"boolean"!=typeof e&&(e=!1);t:for(var r in this.tiles)if(this.tiles.hasOwnProperty(r)){var s=0;e:for(var n in t){if(s===o)break e;if(!t.hasOwnProperty(n)||void 0===this.tiles[r][n]||this.tiles[r][n]!==t[n])continue t;s++}if(e)return this.tiles[r];i.push(this.tiles[r])}return!e&&i},Grid.prototype.canTileFall=function(t,e){return"object"==typeof t&&"function"==typeof t.getLogicY&&(e=t.getLogicY(),t=t.getLogicX()),void 0!==this.tiles[t+"_"+(e+1)]&&this.tiles[t+"_"+(e+1)].isChecked()},Grid.prototype.getExpectedTileYAfterFallFrom=function(t,e){for(var i=0;this.canTileFall(t,e+i);)i++,this.canTileFall(t,e+i);return e+i},Grid.prototype.moveTile=function(t,e,i,o,r){switch(r){case"delete":case"replace":case"overwrite":default:delete this.tiles[i+"_"+o],this.tiles[i+"_"+o]=this.tiles[t+"_"+e].setLogic(i,o);break;case"swap":var s=this.tiles[i+"_"+o];this.tiles[i+"_"+o]=this.tiles[t+"_"+e].setLogic(i,o),this.tiles[t+"_"+e]=s.setLogic(t,e)}return this},Grid.prototype.getARandomColor=function(t,e){if("number"==typeof t&&"number"==typeof e&&t<=e&&t>=10)return Math.floor(Math.random()*(e-t)+t);var i=Math.floor(4*Math.random())+this.getLowestColor();return parseInt(i)},Grid.prototype.spreadAt=function(t,e){"object"==typeof t&&"function"==typeof t.getLogicY&&(e=t.getLogicY(),t=t.getLogicX());var i=window.performance.now(),o=0,r=0,s=this.getTileAt(t,e);this.lastCollapsedCenter=!1,!1===s&&console.error("Picking tile outside of board");for(var n,h=[s],g=this.width*this.height*4;g>0&&(n=h.pop());)g--,o++,n.isChecked()||r++,n.setChecked(!0),n.getLogicX()===s.getLogicX()&&n.getLogicY()===s.getLogicY()||(this.lastGridChanges.deleted[n.getLogicX()+"_"+n.getLogicY()]={x:n.getLogicX(),y:n.getLogicY(),c:n.getColor()},this.lastGridChanges.deletedCount++),h=h.concat(this.getSameColorNotCheckedNeighboursOf(n.getLogicX(),n.getLogicY()));if(1===o)return r=0,this.lastCollapsedTiles=[],s.setChecked(!1),this;this.lastGridChanges.changedCount=1,this.lastGridChanges.changed[s.getLogicX()+"_"+s.getLogicY()]={x:s.getLogicX(),y:s.getLogicY(),c:s.setColor(s.getColor()+1).buildAdjacentLinks().getColor()},this.lastGridChanges.highestColor=this.getHighestColor(),s.setChecked(!1);for(var l=0;l<this.width;l++)for(var c=this.height-1;c>=0;c--)if(!this.tiles[l+"_"+c].isChecked()){var a=this.getExpectedTileYAfterFallFrom(l,c);a!==c&&(this.lastGridChanges.movedCount++,this.lastGridChanges.moved[l+"_"+c]={from:{x:l,y:c,c:this.tiles[l+"_"+c].getColor()},to:{x:l,y:a,c:this.tiles[l+"_"+c].getColor()}},this.moveTile(l,c,l,a,"swap"))}this.findLowestColor();for(l=0;l<this.width;l++)for(c=0;c<this.height;c++)this.tiles[l+"_"+c].isChecked()&&(this.tiles[l+"_"+c].setColor(this.getARandomColor()).setChecked(!1),this.lastGridChanges.created[l+"_"+c]={x:this.tiles[l+"_"+c].getLogicX(),y:this.tiles[l+"_"+c].getLogicY(),c:this.tiles[l+"_"+c].getColor()},this.lastGridChanges.createdCount++);return pendingLog.push("Spread done. "+r+" tiles collapsed, it took "+o+" checks in "+Math.round(window.performance.now()-i)+"ms to proceed"),this},Grid.prototype.getLastGridChanges=function(t){return"boolean"==typeof t&&!0===t||(t=!1),t?JSON.stringify(this.lastGridChanges):this.lastGridChanges},Grid.prototype.getLastGridChangesSimplified=function(){return this.getLastGridChanges(!0)},Grid.prototype.uncheckAllTiles=function(){for(var t=0;t<this.width;t++)for(var e=0;e<this.height;e++)this.tiles[t+"_"+e].setChecked(!1);return this},Grid.prototype.getFirstTileMatching=function(t){return this.getTilesMatching(t,!0)},Grid.prototype.getClone=function(){for(var t=(new Grid).setGridSize(this.width,this.height),e=0;e<this.width;e++)for(var i=0;i<this.height;i++)t.tiles[e+"_"+i]=new Tile(t).setLogic(e,i).setColor(this.tiles[e+"_"+i].getColor()).setType(this.tiles[e+"_"+i].getType()).setChecked(this.tiles[e+"_"+i].isChecked());return t},Grid.prototype.log=function(t){if(this.logMeIAmFamous){"boolean"==typeof t&&t&&window.console.clear();for(var e=function(t,e,i){return i=i||"0",(t+="").length>=e?t:new Array(e-t.length+1).join(i)+t},i=0;i<this.height;i++){var o="";if(0===i){o+="=XX= ";for(var r=0;r<this.width;r++)o+="+"+e(r,2)+"+ ";o+="\n"}for(var s=0;s<this.width;s++)0===s&&(o+="="+e(i,2)+"= "),o+="["+e(this.tiles[s+"_"+i].getColor(),2)+"] ";window.console.log(o)}for(var n=0;n<pendingLog.length;n++)window.console.log(pendingLog[n]);return pendingLog=[],this}};var GameMain=function(){this.grid,this.startX,this.startY,this.shouldLog=!1};GameMain.prototype.newGrid=function(t,e){return this.grid=(new Grid).populate(t,e),this.grid.logMeIAmFamous=this.shouldLog,this.grid},GameMain.prototype.getGrid=function(){return this.grid},GameMain.prototype.activateLog=function(t){return"boolean"!=typeof t&&(t=!1),this.shouldLog=t,this},GameMain.prototype.getCurrentGridSimplified=function(){for(var t={},e=0;e<this.grid.width;e++)for(var i=0;i<this.grid.height;i++){var o=this.grid.tiles[e+"_"+i].getType();t[e+"_"+i]={x:this.grid.tiles[e+"_"+i].getLogicX(),y:this.grid.tiles[e+"_"+i].getLogicY(),c:this.grid.tiles[e+"_"+i].getColor()},10!==o&&(t[e+"_"+i].t=o)}return JSON.stringify(t)},GameMain.prototype.getLastGridChanges=function(t){return this.grid.getLastGridChanges(t)},GameMain.prototype.getLastGridChangesSimplified=function(){return this.grid.getLastGridChangesSimplified()},GameMain.prototype.play=function(t,e){return!1===this.grid.getTileAt(t,e)&&console.error("Picking Tile outside of grid"),this.grid.lastGridChanges={played:{x:this.grid.tiles[t+"_"+e].getLogicX(),y:this.grid.tiles[t+"_"+e].getLogicY(),c:this.grid.tiles[t+"_"+e].getColor()},deleted:{},deletedCount:0,changed:{},changedCount:0,moved:{},movedCount:0,created:{},createdCount:0,highestColor:this.grid.getHighestColor()},this.grid.spreadAt(t,e),this},GameMain.prototype.log=function(){return this.grid.log(),this},"object"!=typeof window.playtouch&&(window.playtouch={}),playtouch.gameMain=new GameMain;