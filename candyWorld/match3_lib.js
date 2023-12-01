;(function(){
	var TAG_EVENT = "c2:libJewel:";

	const match3_lib_VERSION = "1.0.4";

	class Grid {
		constructor() {
			this.rules = {
				match:[],
				move:[],
				canMove:[],
				posCreateItem:[],
				canCreateItem:[],
				createItem :function(){},
				createItemOption :function(){return {}},
				matchItems:[],
				swapItems:[],
				swapItemsMatch:[],
				canTouch:[],
				canDestroyNoItem:[],
				canDestroyItem:[],
				sortCells:undefined,
				onlyOneMatch:false
			}
			this.rulesCache = {checkMove:{}};
	
			return this;
		}

		init(logicWidth,logicHeight,cell = Cell,item = Item, checkRules = CheckRules, rulesClass = window.playtouchGame.match3.RulesClass){
			this.cellClass = cell;
			this.itemClass = item;
			this.logicWidth = logicWidth;
			this.logicHeight = logicHeight;
			this.rulesClass = rulesClass;
			this.checkRules = new checkRules(this.rules,this.rulesClass);

			this.rules.createItem = this.rulesClass.createItemDefault;
			

			this.createArray();
			window.eventToFire.fireEvent(TAG_EVENT+"initEnd");
			return this;
		}

		addRules(type,rule){
			if(typeof this.rules[type] === "object"){
				if(typeof rule === "function"){
					this.rules[type].push(rule);
				}else if(typeof rule === "object"){
					for (let i = 0; i < rule.length; i++) {
						this.rules[type].push(rule[i]);
					}
				}
			}else{
				this.rules[type] = rule;
			}

			if(type === "sortCells" && typeof this.rules[type] !== "undefined"){
				this.cells = this.cells.sort(this.rules[type]);
			}

			return this;
		}
		
		createArray(){
			this.grid =[];
			this.cells = [];
			for (let x = 0; x < this.logicWidth; x++) {
				this.grid.push([]);
				for (let y = 0; y < this.logicHeight; y++) {
					let newCell = new this.cellClass(this,x,y);
					this.grid[x].push(newCell);
					this.cells.push(newCell);
					newCell.create();
				}
			}
			if(!this.cellsSortTop) {this.cellsSortTop = [...this.cells].sort(this.rulesClass.sortCells_top);}
			window.eventToFire.fireEvent(TAG_EVENT+"onGridEnded");
		}

		ld_load(ld,nbColor){
			let arrCreate = [];
			for (let i = 0; i < ld.length; i++) {
				let  cell = this.getCell(ld[i].x,ld[i].y);
				if(!cell){continue;}
				let optionCell = (typeof ld[i].cells !== "undefined" && typeof ld[i].cells.option !=="undefined")?ld[i].cells.option : {};
				let optionItem = (typeof ld[i].items !== "undefined" && typeof ld[i].items.option !=="undefined")?ld[i].items.option : {};
				this.applyOption(cell,optionCell);
				if(cell.type !== ""){cell.setType(cell.type);}
				if(cell.type === "void"){continue;}
				let arrayRemoveColor = ["totem","virus","copyer","sinker","colorBomb","popper","blockLife"];
				if(arrayRemoveColor.includes(optionItem.type)){optionItem.color = -1;}
				if(optionItem.type == "switcher"){
					optionItem.life = 4;
					let arrColor = [];
					// ne pas ajouter la couleur de base du switcher et si pas de couleur, shift la couleurs de l'array
					for (let y = 0; y < nbColor; y++) {
						if(optionItem.color == y){continue;}
						arrColor.push(y);
					}
					optionItem.switcherArrColor = [];
					let arrLength = arrColor.length;
					for (let y = 0; y < arrLength; y++) {
						optionItem.switcherArrColor.push(arrColor.splice(Math.floor(Math.random()*arrColor.length),1)[0])
					}
					if(!optionItem.color){optionItem.color = optionItem.switcherArrColor.shift();}
				}
				// console.log("apply LD",cell.x,cell.y,optionItem);
				arrCreate.push({"cell":cell,"optionItem":optionItem});
			}

			//create all other items
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i].type === "void"){continue;}
				if(this.cells[i].item){continue;}
				if(arrCreate.findIndex( e => e.cell.id == this.cells[i].id) != -1){continue;}
				arrCreate.push({"cell":this.cells[i]});
			}
			
			window.eventToFire.fireEvent(TAG_EVENT+"ld_load_beforeCreateItem");
			arrCreate.forEach(e => {
				this.itemCreateOnCell(e.cell,e.optionItem);
			});
			
			
		}

		addUidOnItem(itemId,uid){
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i].item && this.cells[i].item._id == itemId){
					this.cells[i].item.uid = uid;
					return;
				}
			}
		}
		
		addUidOnCell(cellId,uid){
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i]._id == cellId){
					this.cells[i].uid = uid;
					return;
				}
			}
		}

		getCell(logicX,logicY){
			if(logicX < 0 || logicY < 0 || logicX >= this.logicWidth || logicY >= this.logicHeight ){
				return undefined;
			}
			if(this.grid[logicX] && this.grid[logicX][logicY]){
				return this.grid[logicX][logicY]
			}
			return undefined;
		}
		getCellByPos(pos){
			return this.getCell(pos.x,pos.y);
		}
		getCellById(id){
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i].id === id){return this.cells[i]}
			}
			return undefined;
		}

		getRealWidth(){
			let min = Infinity;
			let max = 0;
			for (var i = 0; i < this.cells.length; i++) {
				let cell = this.cells[i];
				if(cell.type == "void"){continue;}
				if(cell.x <= min){min = cell.x}
				if(cell.x > max){max = cell.x}
			}
			return max-min+1;
		}

		getRealHeight(){
			let min = Infinity;
			let max = 0;
			for (var i = 0; i < this.cells.length; i++) {
				let cell = this.cells[i];
				if(cell.type == "void"){continue;}
				if(cell.y <= min){min = cell.y}
				if(cell.y > max){max = cell.y}
			}
			return max-min+1;
		}

		//create and destroy
		itemCreateOnCell(cell,itemOption={}){
			// if(cell.item){logMe("[itemCreateOnCell] item already exist on cell",cell,cell.item);return false;}
			if(cell.item){this.applyOption(cell.item,itemOption);cell.item.updated();return cell.item.id;}
			return this.rules.createItem(this,cell,itemOption);
		}

		itemCreateOnPos(x,y,itemOption={}){
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i].x === x && this.cells[i].y === y){
					return this.itemCreateOnCell(this.cells[i],itemOption);
				}
			}
			return undefined;
		}

		itemDestroyOnCell(cell){
			cell.destroyItem();
		}

		itemDestroyOnPos(x,y){
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i].x === x && this.cells[i].y === y){
					this.cells[i].destroyItem();
				}
			}
		}

		applyOption(obj,objOption={}){
			if(!obj){return}
			for (var option in objOption) {
				if (objOption.hasOwnProperty(option)) {
					try{
						obj[option] = objOption[option];
					}catch(e){logMe("[applyOption] problem on add option",obj,objOption,e);}
				}
			}
		}

		//check
		checkMove(stringify = true){
			this.rulesCache.checkMove = {};
			let moved = {};
			let currentMoved = this.checkRules.itemCheckMoveGrid(this,moved);
			//return type
			if(Object.keys(moved || {}).length <=0){
				window.eventToFire.fireEvent(TAG_EVENT+"noItemMoved");
			}
			if(stringify){
				return JSON.stringify(moved);
			}else{
				return moved;
			}
		}

		swapItem(item1_logicX,item1_logicY,item2_logicX,item2_logicY,checkMatch = true, testOnly=false){
			let cell1 = this.getCell(item1_logicX,item1_logicY);
			let cell2 = this.getCell(item2_logicX,item2_logicY);
			if(!cell1 || !cell2){return false;}
			let item1 = cell1.item;
			let item2 = cell2.item;
			if(!item1 || !item2){return false;}
			if(testOnly || (this.checkRules.itemCanSwap(item1,item2,this) && (!checkMatch || this.checkRules.itemCanSwapMatch(item1,item2,this)))){
				if(!testOnly){window.eventToFire.fireEvent(TAG_EVENT+"onBeforeItemSwapped",item1.id,item2.id);}
				cell1.setItem(item2,!testOnly);
				cell2.setItem(item1,!testOnly);
				if(!testOnly){window.eventToFire.fireEvent(TAG_EVENT+"onAfterItemSwapped",item1.id,item2.id);}
				return true;
			}
		   return false;
		}

		itemCanSwap(item1_logicX,item1_logicY,item2_logicX,item2_logicY){
			let cell1 = this.getCell(item1_logicX,item1_logicY);
			let cell2 = this.getCell(item2_logicX,item2_logicY);
			if(!cell1 || !cell2){return false;}
			let item1 = cell1.item;
			let item2 = cell2.item;
			if(!item1 || !item2){return false;}
			if(this.checkRules.itemCanSwap(item1,item2,this)){
				return true;
			}
		   return false;
		}

		swapItemByPos(pos1,pos2,checkMatch = true, testOnly=false){
			return this.swapItem(pos1.x,pos1.y,pos2.x,pos2.y,checkMatch,testOnly);
		}

		itemCanSwapByPos(pos1,pos2,checkMatch = true, testOnly=false){
			return this.itemCanSwap(pos1.x,pos1.y,pos2.x,pos2.y);
		}

		checkMatch(destroyItem=false,stringify = true,testOnly=false){
			let matches =  this.sortMatchesByRule(this.checkRules.lookForMatchGrid(this));
			//transform cell into POS
			for (let i = 0; i < matches.length; i++) {
				for (let cell = 0; cell < matches[i].match.length; cell++) {
					let pos = matches[i].match[cell].pos.getCopy();
					if(matches[i].match[cell].item){pos.id = matches[i].match[cell].item.id;}
					matches[i].match[cell] = pos;
				}
			}
			//sort
			for (let i = 0; i < matches.length; i++) {matches[i].match = matches[i].match.sort(Pos.sort);}

			matches = this.clearDuplicateMatch(matches);
			matches = this.clearContainedMatch(matches);
			for (let i = 0; i < matches.length; i++) {
				if(!this.isStillACompleteMatch(matches[i].match)){continue;}
				if(!testOnly){window.eventToFire.fireEvent(TAG_EVENT+"onBeforeItemMatched",(stringify)?JSON.stringify(matches[i]):matches[i]);}
				if(destroyItem){
					for (let pos = 0; pos < matches[i].match.length; pos++) {
						let cell = this.getCellByPos(matches[i].match[pos]);
						if(!cell.item){continue;}
						this.checkRules.checkDestroyItem(cell,this,matches[i]);
					}
				}
				if(!testOnly){window.eventToFire.fireEvent(TAG_EVENT+"onItemMatched",(stringify)?JSON.stringify(matches[i]):matches[i]);}
				if(this.rules.onlyOneMatch){break;}
			}
			if(matches.length <=0){
				if(!testOnly){window.eventToFire.fireEvent(TAG_EVENT+"noItemMatched");}
			}
			//return type
			if(stringify){
				return JSON.stringify(matches);
			}else{
				return matches;
			}
		}

		//UTILS FOR checkMatch Function
		isStillACompleteMatch(match){
			for(let i =0; i <  match.length;i++){
				if(!this.getCellByPos(match[i]).item || this.getCellByPos(match[i]).item.id !== match[i].id){
					return false
				}
			}
			return true;
		}

		sortMatchesByRule(matches){
			let newMatches = [];
			for (let rule = 0; rule < this.rules.match.length; rule++) {
				for (let match = 0; match < matches.length; match++) {
					if(matches[match].name === this.rules.match[rule].name){
						newMatches.push(matches[match]);
					}
				}
			}
			return newMatches;
		}

		clearDuplicateMatch(matches){
			for (let i = 0; i < matches.length; i++) {
				for(let y = matches.length-1;y >= 0;y--){
					if(i == y){continue;}
					if(matches[i].name !== matches[y].name){continue;}
					if((JSON.stringify(matches[i].match) === JSON.stringify(matches[y].match))){
						matches.splice(y,1);
					}
				}
			}
			return matches;
		}

		clearContainedMatch(matches){
			for (let i = 0; i < matches.length; i++) {
				for(let y = matches.length-1;y >= 0;y--){
					if(i == y){continue;}
					if(matches[y].match.every(elem => matches[i].match.some((elemSome) => Pos.equal(elem,elemSome)))){
						matches.splice(y,1);
					}
				}
			}
			return matches;
		}
		//-----------------------------

		getValueOfItemById(id,value,defaultValue=""){
			for (let i = 0; i < this.cells.length; i++) {
				let item = this.cells[i].item;
				if(!item){continue;}
				if(item.id != id){continue;}
				return (typeof item[value] == "undefined")?defaultValue:item[value];
			}
			return defaultValue;
		}

		getValueOfItemByPos(x,y,value,defaultValue=""){
			let item = this.grid[x][y].item;
			if(!item){return defaultValue;}
			return item[value] || defaultValue;
		}

		getValueOfCellById(id,value,defaultValue=""){
			for (let i = 0; i < this.cells.length; i++) {
				if(this.cells[i].id != id){continue;}
				return this.getValueOfCellByPos(this.cells[i].x,this.cells[i].y,value,defaultValue);
			}
			return defaultValue;
		}

		getValueOfCellByPos(x,y,value,defaultValue=""){
			if(!this.grid[x][y]){return defaultValue;}
			return (typeof this.grid[x][y][value] == "undefined")?defaultValue:this.grid[x][y][value];
		}

		//-----------------------------
		movePossible(shuffleAuto = false, getMatches = false, shuffleAutoEvent = false, shuffleCount = 0){
			let ret = false;
			var arrayDirCheck = [new Pos(0,-1),new Pos(0,1),new Pos(-1,0),new Pos(1,0)];
			var lastMatches = [];
			if(typeof this.rulesCache["movePossible"] == "undefined" || (getMatches && typeof this.rulesCache["movePossible"].matches == "undefined")){
				for(var i =0;i < this.cells.length;i++){
					let cell = this.cells[i];
					if(!this.cellAndItemExist(cell)){continue;}
					for (var y = 0; y < arrayDirCheck.length; y++) {
						let cell2 = this.getCellByPos(Pos.sumPos(cell,arrayDirCheck[y]));
						if(!this.cellAndItemExist(cell2)){continue;}
						let canSwap = this.itemCanSwapByPos(cell.item,cell2.item);
						if(!canSwap){continue;}

						//is bonus
						let listOfBonus = ["line_h","line_v","bomb"];
						if(cell.item.type == "colorBomb" || cell2.item.type == "colorBomb" || (listOfBonus.includes(cell.item.type) && listOfBonus.includes(cell2.item.type))){
							ret = true;
							if(getMatches){
								lastMatches = [{
									name:"bonus",
									match:[],
								}];
								lastMatches[0].match.push(cell.pos.getCopy());
								lastMatches[0].match[lastMatches[0].match.length-1].id = cell.item.id;
								lastMatches[0].match.push(cell2.pos.getCopy());
								lastMatches[0].match[lastMatches[0].match.length-1].id = cell2.item.id;
								lastMatches[0].dest = {"from":lastMatches[0].match[0],"to":lastMatches[0].match[1]};
							}
							break;
						}
						//--
						this.swapItemByPos(cell.item,cell2.item,true,true);
						let savedRule = this.rules.onlyOneMatch;
						this.rules.onlyOneMatch = true;
						let matches = this.checkMatch(false,false,true);
						//restore state
						this.rules.onlyOneMatch = savedRule;
						this.swapItemByPos(cell.item,cell2.item,true,true);
						if(matches.length <= 0){continue;}
						if(getMatches){
							lastMatches = this.movePossibleFetchMatchReturn(matches,cell,cell2);
						}
						ret = true;
						break;
					}
					if(ret){break;}
				}
				if(typeof this.rulesCache["movePossible"] == "undefined"){this.rulesCache["movePossible"] = {};}
				this.rulesCache["movePossible"].matches = lastMatches;
				this.rulesCache["movePossible"].ret = ret;
			}else{
				lastMatches = this.rulesCache["movePossible"].matches;
				ret = this.rulesCache["movePossible"].ret;
			}
			
			if(!ret && shuffleAuto){
				if(shuffleAutoEvent){
					window.eventToFire.fireEvent(TAG_EVENT+"requiredShuffle");
					ret = false;
				}else{
					ret = this.shuffleGrid(shuffleCount);
				}
			}else if(getMatches){
				return JSON.stringify(lastMatches);
			}
			this.rulesCache["movePossible"].ret = ret;
			return ret;
		}

		movePossibleFetchMatchReturn(matches,cell,cell2){
			let lastMatches = matches;

			for(let iMatch = 0; iMatch < lastMatches[0].match.length;iMatch++){
				let stop = false;
				for(let posCount = 0; posCount < 2; posCount++){
					let newPos = ((posCount==0)?cell.pos:cell2.pos).getCopy();
					let destPos = ((posCount==0)?cell2.pos:cell.pos).getCopy();

					newPos.id = (posCount==0)?cell.item.id:cell2.item.id;
					destPos.id = (posCount==0)?cell2.item.id:cell.item.id;
					if(Pos.equal(newPos,lastMatches[0].match[iMatch])){
						lastMatches[0].match[iMatch] = destPos;
						lastMatches[0].dest = {"from":destPos,"to":newPos};
						stop = true;
						break;
					}
				}
				if(stop){break;}
			}

			return lastMatches;
		}

		shuffleGrid(shuffleCount = 0){
			let listOfCell = [];
			let listOfItem = [];
			if(shuffleCount >= 10){
				window.eventToFire.fireEvent(TAG_EVENT+"noShufflePossible");
				return false;
			}else if(shuffleCount >= 9){
				//set a bonus on side of other bonus
				let listOfMove = [];
				for(let i =0;i < this.cells.length;i++){
					let cell = this.cells[i];
					if(!this.cellAndItemExist(cell)){continue;}
					if(cell.type != "" && cell.type != "bgLife" && cell.type != "coat"){continue;}
					if(cell.item.type != "bomb" && cell.item.type != "line" && cell.item.type != "line_v" && cell.item.type != "line_h" && cell.item.type != "colorBomb"){continue;}
					listOfCell.push(cell);
				}
				let neighborItem;
				for (let i = 0; i < listOfCell.length; i++) {
					let neighboor = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
					// ccheck all neighboor and after find another bonus for inverted them
					for(let j = 0; j < neighboor.length; j++) {
						let cell = this.getCellByPos(Pos.sumPos(listOfCell[i].pos,neighboor[j]));
						if(!this.cellAndItemExist(cell)){continue;}
						if(cell.type != "" && cell.type != "bgLife" && cell.type != "coat"){continue;}
						if(cell.item.type != ""){continue;}
						listOfMove.push(cell.item);
						listOfMove.push(listOfCell[i].item);
						listOfCell.splice(i,1);
						neighborItem = cell.item;
						break;
					}
					if(neighborItem){break;}
				}
				window.eventToFire.fireEvent(TAG_EVENT+"startShuffle",JSON.stringify(listOfMove.map((a) => {return {"pos":{"x":a.x,y:a.y},"id":a.id}})));
				if(listOfCell.length <= 0){
					if(neighborItem) neighborItem.setType("bomb");
				}else{
					if(neighborItem) neighborItem.setType(listOfCell[0].item.type);
					listOfCell[0].item.setType("");
				}
			}else{
				for(let i =0;i < this.cells.length;i++){
					let cell = this.cells[i];
					if(!this.cellAndItemExist(cell)){continue;}
					if(cell.type != "" && cell.type != "bgLife" && cell.type != "coat"){continue;}
					if(cell.item.type != ""){continue;}
					listOfCell.push(cell);
					listOfItem.push(cell.item);
				}
				window.eventToFire.fireEvent(TAG_EVENT+"startShuffle",JSON.stringify(listOfItem.map((a) => {return {"pos":{"x":a.x,y:a.y},"id":a.id}})));
				shuffle(listOfCell);
				shuffle(listOfItem);
	
				let colorCount = listOfItem.reduce(function(a,b){return (a >b.color)?a:b.color})+1;
				
				let maxCheckMatch = colorCount*2.5;
				let currentCheckMatch = 0;
				for (let i = 0; i < listOfCell.length; i++) {
					listOfCell[i].setItem(listOfItem[i]);
					while(this.checkMatch(false,false,true).length > 0 && currentCheckMatch++ < maxCheckMatch){
						listOfItem[i].setColor(Math.floor(Math.random()*colorCount));
					}
				}

				if(currentCheckMatch >= maxCheckMatch){
					return this.shuffleGrid(shuffleCount+1);
				}
			}
			
			return this.movePossible(true,undefined,undefined,shuffleCount+1);
		}
		
		cellAndItemExist(cell){
			if(!cell){return false;}
			if(!cell.item){return false;}
			return true;
		}

		canTouch(logicX,logicY){
			let cell = this.getCell(logicX,logicY);
			if(!cell){return false;}
		   return this.checkRules.canTouch(cell);
		}

		canTouchByPos(pos){
		   return this.canTouch(pos.x,pos.y);
		}

		//DEBUG
		drawGrid(){
			let draw = "";
			draw+= "-----------------------------";
			for (let i = 0; i < this.cellsSortTop.length; i++) {
				if(i%this.logicWidth == 0){
					if(i != 0){draw+= "|";}
					draw+= "\n|";
				}
				let type = ""+((this.cellsSortTop[i].item)?this.cellsSortTop[i].item.color:" ");
				type = type.replace("-1","-");
				draw += " "+type+" ";
			}
			draw+= "|\n";
			draw+= "-----------------------------";
			console.log(draw);
		}
	}

	//represent 1 cell in the grid
	class Cell {
		constructor(grid,logicX,logicY) {
			this._id = ++Item.idU;
			this.uid = undefined;
			this.pos = new Pos(logicX,logicY);
			this.type = "";
			this.item = undefined;
			this.isSpawn = false;
			this.grid = grid;
			return this;
		}

		create(){
			delete this.grid.rulesCache["movePossible"];
			window.eventToFire.fireEvent(TAG_EVENT+"onCellCreated",this.id,this.logicX,this.logicY,this);
			return this;
		}

		get id(){
			return (!this.uid)?this._id:this.uid;
		}

		get x(){
			return this.pos.x;
		}

		get y(){
			return this.pos.y;
		}

		get logicX(){
			return this.pos.x;
		}

		get logicY(){
			return this.pos.y;
		}

		setItem(item,updateItem = true){
			this.item = item;
			if(!this.item){return;}
			this.item.setCell(this,updateItem);
			return this;
		}
		
		destroyItem(reason){
			if(!this.item){return;}
			this.item.destroy(reason);
			this.item = undefined;
			this.updated();
			return this;
		}

		setType(type){
			this.type = type;
			delete this.grid.rulesCache["movePossible"];
			window.eventToFire.fireEvent(TAG_EVENT+"onCellTypeUpdated",this.id,this.logicX,this.logicY,this.type);
			this.updated();
			return this;
		}

		updated(reason = ""){
			delete this.grid.rulesCache["movePossible"];
			window.eventToFire.fireEvent(TAG_EVENT+"onCellUpdated",this.id,this.logicX,this.logicY,this.type,reason,this);
			return this;
		}

		get info(){
			return {
				"x":this.x,
				"y":this.y,
				"id":this.id,
				"type":this.type
			}
		}

		//static
		static get idU(){ return !this._count ? 0 : this._count;};
		static set idU(val){ this._count = val;};
	}

	//represent 1 item who can be added to a Cell
	class Item {
		constructor(cell,grid,color = -1,type = "") {
			this._id = ++Item.idU;
			this.uid = undefined;
			this.cell = cell;
			this.type = type;
			this.color = color;
			this.grid = grid;
			return this;
		}

		create(){
			delete this.grid.rulesCache["movePossible"];
			this.sendEvent("onItemCreated");
			return this;
		}

		updated(){
			delete this.grid.rulesCache["movePossible"];
			this.sendEvent("onItemUpdated");
			return this;
		}

		setCell(cell,update = true){
			delete this.grid.rulesCache["movePossible"];
			this.cell = cell;
			if(update){this.updated();}
			return this;
		}

		setType(type,update = true){
			delete this.grid.rulesCache["movePossible"];
			this.type = type;
			if(!update){return this;}
			this.sendEvent("onItemTypeUpdated");
			this.updated();
			return this;
		}

		setColor(color){
			this.color = color;
			this.sendEvent("onItemColorUpdated");
			this.updated();
			return this;
		}
		
		destroy(reason){
			if(reason) this.destroyReason = reason;
			this.sendEvent("onItemDestroy");
			return this;
		}

		sendEvent(eventName){
			window.eventToFire.fireEvent(TAG_EVENT+eventName,this.id,this.logicX,this.logicY,this.type,this.color,this);
		}

		get id(){
			return (!this.uid)?this._id:this.uid;
		}

		get logicX(){
			if(!this.cell){return -1}
			return this.cell.logicX;
		}

		get logicY(){
			if(!this.cell){return -1}
			return this.cell.logicY;
		}

		get x(){
			if(!this.cell){return -1}
			return this.cell.logicX;
		}

		get y(){
			if(!this.cell){return -1}
			return this.cell.logicY;
		}

		get info(){
			return {
				"x":this.x,
				"y":this.y,
				"id":this.id,
				"type":this.type,
				"color":this.color
			}
		}

		//static
		static get idU(){ return !this._count ? 0 : this._count;};
		static set idU(val){ this._count = val;};
	}

	class CheckRules {
		constructor(rules,rulesClass){
			this.rulesClass = rulesClass;
			this.rules = rules;
			this.posCached = {};
			this.posCached_match = {};
			this.cache = {};
		}

		// posCreateItem
		getPosCreateItem(func,...args){
			if(!this.posCached[func.name]){this.posCached[func.name] = func(...args);}
			return this.posCached[func.name];
		}
		
		//
		
		// posCreateItem
		getPosMatchItem(func,...args){
			if(!this.posCached_match[func.name]){
				this.posCached_match[func.name] = this.rulesClass.match_getPosibilities(func(...args));
			}
			return this.posCached_match[func.name];
		}


		itemCanMatch(item1,item2){
			for (let i = 0; i < this.rules.matchItems.length; i++) {
				if(typeof this.rules.matchItems[i] !== "function"){logMe("[CheckRules] matchItems rule is not a function",this.rules.matchItems[i]);continue;}
				let result = this.rules.matchItems[i].call(this.rulesClass,item1,item2);
				if(result !== this.rulesClass.result_continue()){return !!result;}
			}
			return true;
		}

		itemCanSwap(item1,item2,grid){
			for (let u = 0; u < this.rules.swapItems.length; u++) {
				if(typeof this.rules.swapItems[u] !== "function"){logMe("[CheckRules] swapItems rule is not a function",this.rules.swapItems[u]);continue;}
				let result = this.rules.swapItems[u].call(this.rulesClass,item1,item2,grid);
				if(result !== this.rulesClass.result_continue()){return !!result;}
			}
			return true;
		}

		itemCanSwapMatch(item1,item2,grid){
			for (let u = 0; u < this.rules.swapItemsMatch.length; u++) {
				if(typeof this.rules.swapItemsMatch[u] !== "function"){logMe("[CheckRules] swapItems rule is not a function",this.rules.swapItems[u]);continue;}
				let result = this.rules.swapItemsMatch[u].call(this.rulesClass,item1,item2,grid);
				if(result !== this.rulesClass.result_continue()){return !!result;}
			}
			return true;
		}

		//match check
		lookForMatchGrid(gridObject){
			let matchs = [];
			delete this.cache["checkMatchExist"];
			for (let x = 0; x < gridObject.grid.length; x++) {
				for (let y = 0; y < gridObject.grid[x].length; y++) {
					if(!gridObject.getCell(x,y).item){continue;}
					let cell = gridObject.getCell(x,y);
					if(!this.itemCanMatch(cell.item,cell.item)){continue;}
					let curMatch = this.lookForMatchCell(cell,gridObject);
					if(curMatch.length == 0){continue;}
					
					for (let i = 0; i < curMatch.length; i++) {
						matchs.push(curMatch[i]);
					}
				}
			}
			return matchs;
		}
		
		lookForMatchCell(cell,gridObject){
			for (let i = 0; i < this.rules.match.length; i++) {
				if(typeof this.rules.match[i] !== "function"){logMe("[CheckRules] match() rule is not a function",this.rules.match[i]);continue;}
				let matchs = this.lookForMatchCellByRule(this.rules.match[i],cell,gridObject);
				//return only the match from the first rule of this cell
				if(matchs.length>0){return matchs;}
			}
			return [];
		}
		
		lookForMatchCellByRule(rule,cell,gridObject){
			let arrayRule = this.getPosMatchItem(rule);
			let ret = [];
			for (let i = 0; i < arrayRule.length; i++) {
				let match = [cell];
				let completed = true;
				let itemPos = this.lookForMatchCellByRule_getAllItemPos(gridObject,cell,arrayRule[i]);
				if(itemPos.length <= 0){continue;}
				// if(this.lookForMatchCellByRule_isAlreadyCheck(cell,itemPos)){continue;}
				for (let pos = 0; pos < itemPos.length; pos++) {
					let cell2 = itemPos[pos];
					if(!this.itemCanMatch(cell.item,cell2.item)){completed = false;break;}
					match.push(cell2);
				}
				if(completed){
					ret.push({
						"match":match,
						"name":rule.name
					});
				}
			}
			return ret;
		}

		lookForMatchCellByRule_getAllItemPos(gridObject,cellBase,posMatchItem){
			let ret = [];
			for (let i = 0; i < posMatchItem.length; i++) {
				let cell2 = gridObject.getCellByPos(Pos.sumPos(cellBase,posMatchItem[i]));
				if(!cell2 || !cell2.item){return [];}
				ret.push(cell2);
			}
			return ret;
		}

		lookForMatchCellByRule_isAlreadyCheck(itemBase,itemsPos){
			if(!this.cache["checkMatchExist"]){this.cache["checkMatchExist"] = {}};
			let arr = [itemBase, ...itemsPos]
				.map((a)=>{return a.pos.getCopy();})
				.sort(Pos.sort);
			let str = JSON.stringify(arr);
			if(this.cache["checkMatchExist"][str]){return true;}
			this.cache["checkMatchExist"][str] = true;
			return false;
		}

		//movement
		itemCheckMoveGrid(gridObject,itemMoved = {},nbRecursif=1){
			let asMoved = false;
			//check if we can create Item before move all other items
			this.itemCheckAddItem(gridObject);
			for (let ruleI = 0; ruleI < this.rules.move.length; ruleI++) {
				if(typeof this.rules.move[ruleI] !== "function"){logMe("[CheckRules] move() rule is not a function",this.rules.move[ruleI]);continue;}
				for (let i = 0; i < gridObject.cellsSortTop.length; i++) {
					let item = gridObject.cellsSortTop[i].item;
					if(!item){continue;}
					let pos = new Pos(item.x,item.y);
					let startPos = pos;
					while(pos){
						pos = this.itemCheckMoveCellByRule(gridObject,this.rules.move[ruleI],item);
						if(pos != false){
							asMoved = true;
							if(!itemMoved[item.id]){itemMoved[item.id] = [startPos];}
							itemMoved[item.id].push(pos);
							break;
						}
					}
					//continue if we are still on the first rule
					if(ruleI !== 0 && asMoved){
						break;
					}
				}
				if(asMoved){break;}
			}
			if(asMoved){this.itemCheckMoveGrid(gridObject,itemMoved,nbRecursif+1);}
			return itemMoved;
		}
		
		itemCheckMoveCellByRule(gridObject,rule,item,testOnly = false){
			let allPos = rule(gridObject,item);
			if(allPos.hasOwnProperty("x")){allPos = [allPos];} //convert to array

			for (let iPos = 0; iPos < allPos.length; iPos++) {
				let nextPosToCheck = Pos.sumPos(allPos[iPos],item);
				let cellOfNextPos = gridObject.getCellByPos(nextPosToCheck);
				if(!cellOfNextPos){continue;}
				for (let ruleI = 0; ruleI < this.rules.canMove.length; ruleI++) {
					if(typeof this.rules.canMove[ruleI] !== "function"){logMe("[CheckRules] canMove() rule is not a function",this.rules.canMove[ruleI]);continue;}
					let result = this.rules.canMove[ruleI].call(this.rulesClass,item,cellOfNextPos);
					if(result === this.rulesClass.result_handleTrue()){
						if(!testOnly){
							window.eventToFire.fireEvent(TAG_EVENT+"onBeforeItemMoved",item.id,cellOfNextPos.x,cellOfNextPos.y);
							item.cell.setItem(undefined);
							cellOfNextPos.setItem(item);
							window.eventToFire.fireEvent(TAG_EVENT+"onAfterItemMoved",item.id,cellOfNextPos.x,cellOfNextPos.y);
						}
						return nextPosToCheck;
					}else if(result === this.rulesClass.result_handleFalse()){
						if(iPos < allPos.length-1){break;}
						return false;
					}
				}
			}
			return false;
		}
		itemCheckCanMove(gridObject,cell){
			let asMoved = false;
			
			let item = cell.item;
			if(!item){return false;}
			for (let ruleI = 0; ruleI < this.rules.move.length; ruleI++) {
				if(typeof this.rules.move[ruleI] !== "function"){logMe("[CheckRules] move() rule is not a function",this.rules.move[ruleI]);continue;}
				
				let pos = this.itemCheckMoveCellByRule(gridObject,this.rules.move[ruleI],item,true);
				if(pos != false){return true;}
			}
			return false;
		}

		//create item
		itemCheckAddItem(gridObject){
			let posToAdd = [];
			let cellAdded = [];
			for (let ruleI = 0; ruleI < this.rules.posCreateItem.length; ruleI++) {
				let posByRule = this.getPosCreateItem(this.rules.posCreateItem[ruleI],gridObject.logicWidth,gridObject.logicHeight,gridObject.cells);
				for (let i = 0; i < posByRule.length; i++) {
					posToAdd.push(posByRule[i]);
				}
			}
			shuffle(posToAdd);// shuffle it, like that, the first pos will not be always the left one (exemple: pop a totem)
			for (let i = 0; i < posToAdd.length; i++) {
				for (let ruleI = 0; ruleI < this.rules.canCreateItem.length; ruleI++) {
					if(this.rules.canCreateItem[ruleI](gridObject.getCellByPos(posToAdd[i]))){
						let cell = gridObject.getCellByPos(posToAdd[i]);
						cellAdded.push(cell);
						let options = this.rules.createItemOption();
						options.createdType = "drop";
						this.rules.createItem(gridObject,cell,options);
					}
				}
			}
			if(cellAdded.length > 0){
				window.eventToFire.fireEvent(TAG_EVENT+"allItemCreated",JSON.stringify(posToAdd));
			}
			return cellAdded;
		}

		//destroy item
		checkDestroyItem(cell,grid,match = {"match":[],name:""},rules = this.rules.canDestroyItem,rulesNoItem = this.rules.canDestroyNoItem,reason = undefined){
			// used always and don't have any check on item, no block
			for (let i = 0; i < rulesNoItem.length; i++) {
				if(typeof rulesNoItem[i] !== "function"){logMe("[CheckRules] canDestroyNoItem rule is not a function",rulesNoItem[i]);continue;}
				let result = rulesNoItem[i].call(this.rulesClass,cell,grid,match);
				if(result === this.rulesClass.result_continue()){continue;}
				if(result === this.rulesClass.result_handleFalse()){break;}
			}

			for (let i = 0; i < rules.length; i++) {
				if(typeof rules[i] !== "function"){logMe("[CheckRules] canDestroyItem rule is not a function",rules[i]);continue;}
				if(!cell.item){return false;}
				let result = rules[i].call(this.rulesClass,cell,grid,match,reason);
				if(result === this.rulesClass.result_continue()){continue;}
				if(result === this.rulesClass.result_handleFalse()){break;}
				cell.destroyItem(reason);
				return true;
			}
			return false;
		}

		canTouch(cell){
			for (let i = 0; i < this.rules.canTouch.length; i++) {
				if(typeof this.rules.canTouch[i] !== "function"){logMe("[CheckRules] canTouch rule is not a function",this.rules.canTouch[i]);continue;}
				let result = this.rules.canTouch[i].call(this.rulesClass,cell);
				if(result !== this.rulesClass.result_continue()){return !!result;}
			}
			return true;
		}

	}

	class Pos {
		constructor(x,y) {
			this.x = x;
			this.y = y;
		}

		static equal(pos1,pos2){
			return (pos1.x == pos2.x && pos1.y == pos2.y);
		}
		static sort(a,b){
			if(a.x > b.x || a.y > b.y){return 1;}
			return -1;
		}

		static sumPos(pos1,pos2){
			return new Pos(pos1.x+pos2.x,pos1.y+pos2.y);
		}
		
		static distPos(pos1,pos2){
			return (pos2.x - pos1.x) + (pos2.y - pos1.y); 
		}

		//-----
		isEqual(pos){
			return this.constructor.equal(this,pos);
		}

		getCopy(){
			return new Pos(this.x,this.y);
		}
	}

	function logMe(message,...args){
		switch (window.playtouchGame.match3.logLevel) {
			case 0:
			break;
			default:
			case 3:
				alert(message);
			case 2:
				console.error(message,args);
			break;
			case 1:
				console.log(message,args);
		}
	}

	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}


	if(typeof window.playtouchGame === "undefined"){window.playtouchGame = {};}
	if(typeof window.playtouchGame.match3 === "undefined"){window.playtouchGame.match3 = {};}
	window.playtouchGame.match3.logLevel = 1;
	window.playtouchGame.match3.logMe = logMe;
	window.playtouchGame.match3.match3_lib_VERSION = match3_lib_VERSION;
	window.playtouchGame.match3.Pos = Pos;
	window.playtouchGame.match3.Grid = Grid;
	window.playtouchGame.match3.Item = Item;
	window.playtouchGame.match3.Cell = Cell;
})();