/* 

*/
;(function(){
	var TAG_EVENT = "c2:libJewel:";
	var Pos = window.playtouchGame.match3.Pos;

	class Main {
		constructor(){}

		createGrid(logicWidth,logicHeight,timeBetweenDestroy,timeBetweenDestroyStart=0){
			this.grid = new GridCustom();
			this.grid.init(logicWidth,logicHeight, CellCustom);
			this.timeoutId = [];
			this.TIME_BETWEEN_DESTROY = timeBetweenDestroy;
			this.TIME_BETWEEN_DESTROY_START = timeBetweenDestroyStart;

			return this;
		}

		destroy(){
			for (var i = 0; i < this.timeoutId.length; i++) {
				clearTimeout(this.timeoutId[i]);
			}
			delete this.grid;
			
			// seed
			// playtouch.seedsField.uproot("createItem_color_"+this.lvl+((this.ld.seed)?"_"+this.ld.seed:""));
			playtouch.seedsField.uproot("createItem_color");
			// 
		}

		clearTimeoutId(id){
			for (var i = 0; i < this.timeoutId.length; i++) {
				if(this.timeoutId[i] === id){
					this.timeoutId.splice(i,1);
				}
			}
		}

		isTimeoutExist(){
			return Math.min(1,this.timeoutId.length);
		}

		createItem(x,y,option,destroy=false){
			let cell = this.grid.getCell(x,y);
			
			if(cell.item){
				if(destroy){
					this.destroyItem(x,y);
					return this.createItem(...arguments);
				}
				this.grid.applyOption(cell.item,option);
				cell.item.updated();
			}else{
				this.grid.itemCreateOnPos(x,y,option);
			}
		}

		loadLd(ld,lvl){
			if(typeof ld === "string"){ld = JSON.parse(ld);}
			this.ld = ld;
			this.lvl = lvl;
			// console.log("START LVL :",lvl);
			if(!window.saveStateLvl){window.saveStateLvl = {};}
			window.saveStateLvl[lvl] = {
				st:"ok",
				mp:undefined,
				pack : ld.old.split("_")[0],
				lvl : ld.old.split("_")[1]
			};

			// seed
			var seedName = "createItem_color";
			// playtouch.seedsField.plant(seedName, lvl);
			playtouch.seedsField.plant(seedName, lvl+((ld.seed)?"_"+ld.seed:0));
			//
			
			window.saveStateLvl[lvl].seedValue = ((ld.seed)?ld.seed:"");

			let spawnPoint = [];
			for (let i = 0; i < ld.grid.length; i++) {
				if(ld.grid[i].spawnPoint){spawnPoint.push(new Pos(ld.grid[i].x,ld.grid[i].y))}
			}
			
			this.grid.rules["posCreateItem"] = [];
			this.grid.addRules("posCreateItem",[
				function (spawnPoint,width,height,cells){
					return spawnPoint;
				}.bind(undefined,spawnPoint)
			]);
			
			
			this.grid.addRules("createItemOption",
				function(seedName,nbColor){
					var rand = 0;
					if(c2_callFunction("tuto_gameMain_isOnTuto",[],"match3:dev")){
						rand = playtouch.seedsField.random(seedName);
					}else{
						rand = Math.random();
					}
					return {color:Math.floor(rand*nbColor)}
				}.bind(undefined,seedName,ld.nbColor)
			);

			this.currentLDColor = ld.nbColor;
			//createItem without match
			this.grid.addRules("createItem",
				function (nbColor,seedName,gridObject,cell,itemOption){
					cell.item = new gridObject.itemClass(cell,gridObject,Math.floor(playtouch.seedsField.random(seedName)*nbColor));
					gridObject.applyOption(cell.item,itemOption);
					while(gridObject.checkMatch(false,false,true).length > 0){
						cell.item.color = Math.floor(playtouch.seedsField.random(seedName)*nbColor);
					}
					cell.item.create();
					return cell.item;
				}.bind(undefined,ld.nbColor,seedName)
			);

			//load ld
			this.grid.ld_load(ld.grid,ld.nbColor);

			for (let i = 0; i < spawnPoint.length; i++) {
				this.grid.getCell(spawnPoint[i].x,spawnPoint[i].y).isSpawn = true;
			}

			//revert createItem to normal
			this.grid.addRules("createItem",
				function (maxTotemInGrid,gridObject,cell,itemOption){
					cell.item = new gridObject.itemClass(cell,gridObject);
					gridObject.applyOption(cell.item,itemOption);
					let totemLeftToCreate = c2_callFunction("cnd_totemLeftToCreate");
					if(cell && cell.isSpawn && totemLeftToCreate > 0 && c2_callFunction("canCreateTotem")){
						let totemInGrid = gridObject.cells.filter(function(a){if(a.item && a.item.type == "totem"){return a}}).length;
						if(totemInGrid < maxTotemInGrid && totemInGrid < totemLeftToCreate){
							cell.item.type = "totem";
						}
					}
					cell.item.create();
					return cell.item;
				}.bind(undefined,this.grid.cells.filter(function(a){if(a.item && a.item.type == "totem"){return a}}).length)
			);
			

			// DEBUG
			// var result = this.grid.movePossible();
			// window.saveStateLvl[lvl].mp = result;
			// console.log("result",lvl,window.saveStateLvl[lvl]);
			// localStorage.setItem("saveStateLvl",JSON.stringify(saveStateLvl));
			// if(result){
			// 	eventToFire.fireEvent("c2:ldLoaded");
			// }else{
			// 	if(!window.saveStateLvl[lvl].retryCount)window.saveStateLvl[lvl].retryCount = 0;
			// 	window.saveStateLvl[lvl].retryCount++;
			// 	ld.seed = "customSeedLD_"+Math.floor(Math.random()*9999);
			// 	this.destroy();
			// 	this.createGrid(ld.width,ld.height,0.04,0,1);
			// 	this.loadLd(ld,lvl);
			// 	return;
			// }
			// DEBUG

			this.grid.movePossible(true);
			// this.grid.drawGrid();
		}

		add1ColorOnCreate(maxColor = 6){
			this.currentLDColor = Math.min(maxColor, this.currentLDColor+1);
			this.grid.addRules("createItemOption",
				function(nbColor){
					return {color:Math.floor(Math.random()*nbColor)}
				}.bind(undefined,this.currentLDColor)
			);
		}

		//BONUS
		scoreDestroyBonus(){
			c2_callFunction("addScoreGlobal",[100]);
		}

		destroyBombRadius(radius,x,y,x2=-1,y2=-1,color=-1,removeCorner=true,typeDestroy=undefined){
			if(y2 !== -1) {
				let cell1 = this.grid.getCell(x,y);
				let cell2 = this.grid.getCell(x2,y2);
				if(cell1.item){cell1.item.setType("");}
				if(cell2.item){cell2.item.setType("");}
			};
			let colorBonus = color;
			
			let arr = [];
			for (let x = -radius; x <= radius; x++) {
				for (let y = -radius; y <= radius; y++) {
					if(removeCorner && Math.abs(y) == radius && Math.abs(x)== radius){continue;}
					arr.push(new Pos(x,y));
				}
			}
			let startPos = new Pos(x,y);
			let startCell = this.grid.getCellByPos(startPos);
			if(startCell.item){
				let listExclude = ["totem","key","copyer","sinker","switcher", "exploder","popper","blockLife","virus"];
				if(!listExclude.includes(startCell.item.type)){startCell.item.setType("");}
				if(colorBonus == -1) colorBonus = startCell.item.color;
			}

			this.destroyBombR(startPos,arr,colorBonus,typeDestroy);
		}

		destroyBombR(startPos,posToCheck,colorBonus,typeDestroy = "bonus_Bomb"){
			let toDestroy = [];
			let match = {"match":[],name:typeDestroy,color:colorBonus};
			for (let i = 0; i < posToCheck.length; i++) {
				let posCell = Pos.sumPos(startPos,posToCheck[i]);
				let cell = this.grid.getCellByPos(posCell);
				let cur_rulesDestroy = undefined;
				let cur_match = match;
				if(!cell){continue;}
				toDestroy.push(cell);
				if(cell.item && cell.item.type == "copyer"){cur_match.match=[startPos];cur_rulesDestroy = [this.grid.rulesClass.canDestroyItem_oneTime_cell,this.grid.rulesClass.canDestroyItem_life_copyer];}
				if(cell.item && cell.item.type == "popper"){cur_match.match=[startPos];cur_rulesDestroy = [this.grid.rulesClass.canDestroyItem_life_popper_os,this.grid.rulesClass.canDestroyItem_oneTime_cell,this.grid.rulesClass.canDestroyItem_life];}
				this.destroyItemByTimeout(
					this.grid.checkRules.checkDestroyItem.bind(this.grid.checkRules,cell,this.grid,cur_match,cur_rulesDestroy,undefined,"bonus"),
					startPos,
					cell.pos
				);
			}
			this.check_coat([startPos],toDestroy);
		}

		destroyLineCross(x,y,x2,y2){
			let cell1 = this.grid.getCell(x,y);
			let cell2 = this.grid.getCell(x2,y2);
			if(cell1.item){cell1.item.setType("");}
			if(cell2.item){cell2.item.setType("");}
			
			this.destroyLineVertical(x,y);
			this.destroyLineHorizontal(x,y);
		}

		destroyLineVertical(x,y,nbLine=1,x2=-1,y2=-1,color=-1){
			if(y2 !== -1) {
				let cell1 = this.grid.getCell(x,y);
				let cell2 = this.grid.getCell(x2,y2);
				if(cell1.item){cell1.item.setType("");}
				if(cell2.item){cell2.item.setType("");}
			};
			for (var lineNb = 0; lineNb < nbLine; lineNb++) {
				let arr = [];
				let posCheck = (x - Math.floor(nbLine/2) + lineNb);
				for (let i = 0; i < this.grid.cells.length; i++) {
					if(this.grid.cells[i].x == posCheck){
						arr.push(this.grid.cells[i]);
					}
				}
				// this.destroyLine(new Pos(posCheck,y),arr);
				this.destroyLine(new Pos(x,y),arr,color);
			}
		}

		destroyLineHorizontal(x,y,nbLine=1,x2=-1,y2=-1,color=-1){
			if(y2 !== -1) {
				let cell1 = this.grid.getCell(x,y);
				let cell2 = this.grid.getCell(x2,y2);
				if(cell1.item){cell1.item.setType("");}
				if(cell2.item){cell2.item.setType("");}
			};

			for (var lineNb = 0; lineNb < nbLine; lineNb++) {
				let arr = [];
				let posCheck = (y - Math.floor(nbLine/2) + lineNb);
				for (let i = 0; i < this.grid.cells.length; i++) {
					if(this.grid.cells[i].y == posCheck){
						arr.push(this.grid.cells[i]);
					}
				}
				// this.destroyLine(new Pos(x,posCheck),arr);
				this.destroyLine(new Pos(x,y),arr,color);
			}
		}
		
		destroyLine(posStart,arrayToDestroy,color = -1){
			let arrOfBlockable = [];
			let arrOfDestroy = []
			
			for (let i = 0; i < arrayToDestroy.length; i++) {
				if(!arrayToDestroy[i].item){continue;}
				if(arrayToDestroy[i].item.type == "sinker"){arrOfBlockable.push(arrayToDestroy[i]);}
			}	
			let cellStart = this.grid.getCellByPos(posStart);
			let colorBonus = color;
			if(cellStart && cellStart.item && colorBonus == -1){colorBonus = cellStart.item.color;}

			for (var i = 0; i < arrayToDestroy.length; i++) {
				let cell = arrayToDestroy[i];
				let canDestroy = true;
				for (var y = 0; y < arrOfBlockable.length; y++) {
					if(Pos.equal(cell.pos,arrOfBlockable[y].pos)){continue;}//same pos
					if(cell.pos.x != arrOfBlockable[y].pos.x && cell.pos.y != arrOfBlockable[y].pos.y){continue;}
					let distBlockable = Pos.distPos(posStart,arrOfBlockable[y].pos);
					let distItem = Pos.distPos(posStart,cell.pos);
					if(((distBlockable > 0 && distItem > 0) || (distBlockable < 0 && distItem < 0)) && 
						Math.abs(distItem) > Math.abs(distBlockable)){
						canDestroy = false;
						break;
					}
				}
				if(!canDestroy){continue;}
				arrOfDestroy.push(cell);
				
				let cur_rulesDestroy = undefined;
				if(cell.item && cell.item.type == "copyer"){cur_rulesDestroy = [this.grid.rulesClass.canDestroyItem_life_copyer];}
				this.destroyItemByTimeout(
					this.grid.checkRules.checkDestroyItem.bind(this.grid.checkRules,cell,this.grid,{"match":[posStart],name:"bonus_line",color:colorBonus},cur_rulesDestroy,undefined,"bonus"),
					posStart,
					cell.pos
				);
			}
			this.check_coat([posStart],arrOfDestroy);
		}

		destroyColorBomb(x,y,color,type=""){
			let toDestroy = [];
			let destroyCount = 0;
			
			//cell colorBomb
			let cell = this.grid.grid[x][y];
			if(cell.item){
				// cell.item.setType("");
				toDestroy.push(cell);
			}
			
			for (let i = 0; i < this.grid.cellsSortTop.length; i++) {
				let newCell = this.grid.cellsSortTop[i];
				if(!newCell.item){continue};
				if(newCell.item.type === "colorBomb"){continue};
				if(newCell.item.type === "blockLife"){continue};
				if(newCell.type === "chest"){continue};
				// if(newCell.type === "blockLife"){continue};
				if(newCell.item.color === color){
					if(type !== "" && newCell.item.type === ""){
						newCell.item.setType(type,false);
					}
					toDestroy.push(newCell);
				}
			}

			for (let i = 0; i < toDestroy.length; i++) {
				if(!toDestroy[i].item){continue};
				this.destroyItemByTimeout(
					this.grid.checkRules.checkDestroyItem.bind(this.grid.checkRules,toDestroy[i],this.grid,undefined,undefined,undefined,"bonus_colorBomb"),
					new Pos(0,0),
					toDestroy[i].pos,
					destroyCount/2
				);
				destroyCount++;
			}
			this.check_coat([new Pos(x,y)],toDestroy);
		}

		destroyColorBomb_all(x,y){
			let destroyCount = 0;
			let arr = [];		
			for (let i = 0; i < this.grid.cellsSortTop.length; i++) {
				let newCell = this.grid.cellsSortTop[i];
				if(!newCell.item){continue};
				this.destroyItemByTimeout(
					this.grid.checkRules.checkDestroyItem.bind(this.grid.checkRules,newCell,this.grid,undefined,undefined,undefined,"bonus_colorBomb"),
					new Pos(0,0),
					newCell.pos,
					destroyCount/10
				);
				arr.push(newCell);
				destroyCount++;
			}
			this.check_coat([new Pos(x,y)],arr);
		}

		destroyTotem(x,y){
			let cell = this.grid.getCell(x,y);
			if(!cell.item){return false;}
			if(cell.item.type != "totem"){return false;}
			if(cell.type == "blockLife" && cell.life > 0){return false;}
			if(cell.type == "chest" && cell.life > 0){return false;}
			return this.grid.checkRules.checkDestroyItem(cell,this.grid,undefined,[this.grid.rulesClass.canDestroyItem_all],[]);
		}

		destroyItem(x,y,reason = ""){
			let cell = this.grid.grid[x][y];
			if(!cell.item){return;}
			this.grid.checkRules.checkDestroyItem(cell,this.grid,undefined,undefined,undefined,reason);
		}

		destroyKey(){
			let chestDestroyed = false;
			for (let i = 0; i < this.grid.cells.length; i++) {
				if(this.grid.cells[i].type == "chest"){
					this.grid.cells[i].life--;
					if(this.grid.cells[i].life <= 0){
						this.grid.cells[i].setType("");
						chestDestroyed = true;
					}
					this.grid.cells[i].updated();
				}
			}
			if(chestDestroyed){
				this.grid.checkMatch(true);
			}
		}

		destroyItemByTimeout(callback,pos1,pos2,idDestroy){
			var id = playtouch.arrayWaitForFunction.waitForFunctionJS(
				this.TIME_BETWEEN_DESTROY_START+((typeof idDestroy == "undefined")?Math.abs(Pos.distPos(pos1,pos2)):idDestroy)*this.TIME_BETWEEN_DESTROY,
				() => {
					this.clearTimeoutId(id);
					callback()
				}
			);
			this.timeoutId.push(id);
		}

		setItemType(x,y,type=""){
			let cell = this.grid.getCell(x,y);
			if(!cell.item){return;}
			cell.item.setType(type);
		}

		addStarterItem(type,color){
			let allPos = [];
			let ret = {used:0,type:type};
			for (let i = 0; i < this.grid.cellsSortTop.length; i++) {
				let newCell = this.grid.cellsSortTop[i];
				if(newCell.type !== "bgLife" && newCell.type!== "coat" && newCell.type !== ""){continue;}
				if(!newCell.item){continue;}
				if(newCell.item.type !== ""){continue;}
				if(playtouchGame.main.ld.grid.find((a)=>(a.items && Pos.equal(newCell.pos,new Pos(a.x,a.y))))){continue;} //remove LD position
				allPos.push(newCell);
			}
			if(allPos.length <= 0){return JSON.stringify(ret);}
			let posToadd = allPos[Math.floor(Math.random()*allPos.length)];

			let option = {"type":type};
			if(typeof color !== "undefined"){option["color"] = color;}
			window.eventToFire.fireEvent(TAG_EVENT+"itemStarter",this.grid.getCell(posToadd.x,posToadd.y).item.uid);

			this.createItem(posToadd.x,posToadd.y,option);
			ret.color = this.grid.getCell(posToadd.x,posToadd.y).item.color;
			ret.used = 1;
			ret.x = posToadd.x;
			ret.y = posToadd.y;
		
			return JSON.stringify(ret);
		}

		addVirus(){
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
			let allVirus = [];
			let listCanBeVirus = ["line_h","line_v","bomb","colorBomb"];
			for (let i = 0; i < this.grid.cells.length; i++) {
				let cell = this.grid.cells[i];
				if(!cell.item){continue;}
				if(cell.item.type != "virus"){continue;}
				for (let i = 0; i < pos.length; i++) {
					let nearCell = this.grid.getCellByPos(Pos.sumPos(cell.pos,pos[i]));
					if(!nearCell){continue;}
					if(nearCell.type != "" && nearCell.type != "coat"){continue;}

					if(!nearCell.item){allVirus.push(nearCell);continue;}
					if(nearCell.item.type === "" || listCanBeVirus.includes(nearCell.item.type)){allVirus.push(nearCell);}
				}
			}
			if(allVirus.length <= 0){return false;}
			let virusToAdd = allVirus[Math.floor(Math.random()*allVirus.length)];
			
			if(!virusToAdd.item){
				virusToAdd.setType("");
				this.grid.itemCreateOnCell(virusToAdd,{type:"virus"});
				return true;
			}
			if(virusToAdd.item.type === "" || listCanBeVirus.includes(virusToAdd.item.type)){
				virusToAdd.setType("");
				virusToAdd.item.setType("virus");
				return true;
			}

			return false;
		}

		victory_destroyAllBonus(){
			let arrBonus = ["line","line_h","line_v","bomb","colorBomb"];
			let arrCellBlock = ["blockLife","chest"];
			let ret = false;
			for (let i = 0; i < this.grid.cells.length; i++) {
				let cell =  this.grid.cells[i];
				if(!cell.item){continue;}
				if(arrCellBlock.includes(cell.type)){continue;}
				if(!arrBonus.includes(cell.item.type)){continue;}
				this.destroyItem(cell.x,cell.y,"victory");
				ret = true;
			}
			return ret;
		}
		
		victory_createBonusLine(count){
			let ret = false;
			let itemAvailable = [];
			let arrCellBlock = ["blockLife","chest"];
			for (let i = 0; i < this.grid.cells.length; i++) {
				let cell =  this.grid.cells[i];
				if(!cell.item){continue;}
				if(!cell.item.type == ""){continue;}
				if(arrCellBlock.includes(cell.type)){continue;}
				itemAvailable.push(cell.item);
				ret = true;
			}
			shuffle(itemAvailable);

			for (var i = 0; i < count; i++) {
				if(i >= itemAvailable.length){break;}
				this.createItem(itemAvailable[i].x,itemAvailable[i].y,{"type":((Math.random()>0.5)?"line_v":"line_h")});
			}
			return ret;
		}

		exploder_addTurn(value){
			//add timer on exploder
			for (let i = 0; i < this.grid.cells.length; i++) {
				let cell =  this.grid.cells[i];
				if(!cell.item){continue;}
				if(cell.item.type != "exploder"){continue;}
				cell.item.timer = Math.max(value,cell.item.timer+value);
			}
		}

		check_coat_fromC2Match(c2Match = {"match":[]}){
			if(typeof c2Match == "string"){c2Match = JSON.parse(c2Match);}
			let arr = [];
			for (var i = 0; i < c2Match.match.length; i++) {
				arr.push(new Pos(c2Match.match[i].x,c2Match.match[i].y));
			}
			this.check_coat(arr);
		}
		
		check_coat(arrStart = [],arrToAdd = [],fromBonus = false){
			if(arrStart.length <= 0){return false;}
			// convert all pos to cell and check if it's a cell_coat
			let asCoat = false;
			for (let i = 0; i < arrStart.length; i++) {
				if(!arrStart[i].pos){
					arrStart[i] = this.grid.getCellByPos(arrStart[i]);
					if(!arrStart[i]){continue;}
				}
				if(arrStart[i].type == "coat"){asCoat = true;}
			}
			if(!asCoat){return false;}
			for (let i = 0; i < arrToAdd.length; i++) {
				if(!arrToAdd[i].pos){
					arrToAdd[i] = this.grid.getCellByPos(arrToAdd[i]);
				}
			}
			//
			arrToAdd.push(...arrStart);
			for (let i = 0; i < arrToAdd.length; i++) {
				if(!arrToAdd[i].item){continue;}
				if(arrToAdd[i].item.type == "popper"){continue;}
				if(arrToAdd[i].item.type == "copyer"){continue;}
				if(arrToAdd[i].item.type == "blockLife"){continue;}
				// console.log(arrToAdd[i],arrToAdd[i].type,arrToAdd[i].item);
				if(arrToAdd[i].type != "" && arrToAdd[i].type != "totem"){continue;}
				arrToAdd[i].setType("coat");
			}
		}

		createOnMatch(match,color){
			if(typeof match === "string"){match = JSON.parse(match);}

			let cellOkForBonus = false;
			let cell;
			match.match.unshift(new Pos(match.posCreate.x,match.posCreate.y));
			
			for (var i = 0; i < match.match.length; i++) {
				if(i != 0 && match.match[i].x == match.posCreate.x && match.match[i].y == match.posCreate.y){continue;} // already checked in pos 0

				cell = this.grid.getCellByPos(match.match[i]);
				if(!cell){continue;}
				if(!cell.item){cellOkForBonus = true;}
				else if(cell.item.type == ""){cellOkForBonus = true;}

				if(cellOkForBonus){break;}
			}

			// create bonus
			if(cellOkForBonus){
				let optionItem = {"type":"","color":color};
				switch (match.name) {
					case "match_4":
						optionItem.type = (["line_v","line_h"])[Math.round(Math.random())];
					break;
					case "match_4_v":
						optionItem.type = "line_v";
					break;
					case "match_4_h":
						optionItem.type = "line_h";
					break;
					case "match_T7":
					case "match_5":
					case "match_Cross9":
					case "match_Cross8":
					case "match_Cross7":
					case "match_Cross7_2":
						optionItem.type = "colorBomb";
					break;
					case "match_T5":
					case "match_T6":
					case "match_L4":
					case "match_L5":
					case "match_Cross6":
					case "match_Cross5":
						optionItem.type = "bomb";
					break;
				}
				if(optionItem.type != ""){this.createItem(cell.x,cell.y,optionItem);}
			}

		}

		resetPopper(x,y){
			let cell = this.grid.getCell(x,y);
			if(!cell){return;}
			let item = cell.item;
			if(!item){return;}
			if(item.type != "popper"){return;}
			if(!item.baseLife){item.baseLife = item.life;}
			item.life = item.baseLife;
			item.updated();
		}
		
		forceUpdateItem(x,y){
			let cell = this.grid.getCell(x,y);
			if(!cell.item){return;}
			cell.item.updated();
		}

		//--------------------------------
		

	}


	class GridCustom extends window.playtouchGame.match3.Grid {
		constructor() {super();}

		init(){
			super.init(...arguments);

			this.addRules("match",[
				this.rulesClass.match_Cross9,
				this.rulesClass.match_Cross8,
				this.rulesClass.match_Cross7,
				this.rulesClass.match_Cross7_2,
				this.rulesClass.match_T7,
				this.rulesClass.match_5,
				this.rulesClass.match_Cross6,
				this.rulesClass.match_Cross5,
				this.rulesClass.match_T6,
				this.rulesClass.match_T5,
				this.rulesClass.match_L5,
				this.rulesClass.match_4,
				this.rulesClass.match_3
			]);

			this.addRules("matchItems",[
				this.rulesClass.matchItems_type_popper,
				this.rulesClass.matchItems_cell_type_chest,
				this.rulesClass.matchItems_type_sinker,
				this.rulesClass.matchItems_type_copyer,
				this.rulesClass.matchItems_type_virus,
				this.rulesClass.matchItems_type_blockLife,
				this.rulesClass.matchItems_type_colorBomb,
				this.rulesClass.matchItems_type_totem,
				this.rulesClass.matchItems_color,
				this.rulesClass.matchItems_all
			]);

			this.addRules("swapItems",[
				this.rulesClass.swapItems_near1Cell,
				this.rulesClass.swapItems_noSwap,
				this.rulesClass.swapItems_blockLife
			]);

			this.addRules("swapItemsMatch",[
				this.rulesClass.swapItems_bonus,
				this.rulesClass.swapItems_match
			]);

			this.addRules("sortCells", 
				this.rulesClass.sortCells_bottom
			);

			this.addRules("move",[	
				this.rulesClass.move_bottom_1,
				this.rulesClass.move_bottomLeftRight_nearBorder_1,
				this.rulesClass.move_bottomLeftRight_1
			]);

			this.addRules("canMove",[
				this.rulesClass.canMove_type_noMove,
				this.rulesClass.canMove_type_blockLife,
				this.rulesClass.canMove_type_void,
				this.rulesClass.canMove_empty
			]);

			this.addRules("canCreateItem",[
				this.rulesClass.canCreateItem_void
			]);

			//used always and don't have any check on item, no block
			this.addRules("canDestroyNoItem",[
				this.rulesClass.canDestroyItem_oneTime_cell_rulesNoItem,
				this.rulesClass.canDestroyItem_cellBGLife
			]);

			this.addRules("canDestroyItem",[
				this.rulesClass.canDestroyItem_oneTime_cell,
				this.rulesClass.canDestroyItem_cellChest,
				this.rulesClass.canDestroyItem_cellBlockLife,
				this.rulesClass.canDestroyItem_totem,
				this.rulesClass.canDestroyItem_popperNearDestroyed,
				this.rulesClass.canDestroyItem_virusNearDestroyed,
				this.rulesClass.canDestroyItem_blockLifeNearDestroyed,
				this.rulesClass.canDestroyItem_sinkerNearDestroyed,
				this.rulesClass.canDestroyItem_copyerNearDestroyed,
				this.rulesClass.canDestroyItem_life,
				this.rulesClass.canDestroyItem_all
			]);

			this.addRules("createItem",
				this.rulesClass.createItemDefault_type_random4
			);
			
			this.addRules("canTouch",[
				this.rulesClass.canTouch_type_item_popper,
				// this.rulesClass.canTouch_type_item_blockLife,
				// this.rulesClass.canTouch_type_item_virus,
				this.rulesClass.canTouch_type_item_copyer,
				// this.rulesClass.canTouch_type_cell_blockLife,
				this.rulesClass.canTouch_type_cell_chest
			]);

			return this;
		}
	}

	class CellCustom extends window.playtouchGame.match3.Cell {
		constructor() {
			super(...arguments);
		}
	}


	class Utils {
		constructor(){
			this.timerMatch={};
		}

		sortPosWall(c){
			c = Object.values(c);
			var d = [c.splice(0,1)[0]];
			while(c.length > 0){
				var used = false;
				for(var i =0;i < c.length;i++){
					var checkCase = d[d.length-1];
					if(checkCase.destX == c[i].startX && checkCase.destY == c[i].startY){
						d.push(c.splice(i,1)[0]);
						used = true;
						break;
					}
					var checkCaseBefore = d[0];
					if(checkCaseBefore.destX == c[i].startX && checkCaseBefore.destY == c[i].startY){
						d.unshift(c.splice(i,1)[0]);
						used = true;
						break;
					}
					checkCase = d[d.length-1];
					if(checkCase.destX == c[i].destX && checkCase.destY == c[i].destY){
						let newC = c.splice(i,1)[0];
						d.push({startX:newC.destX,startY:newC.destY,destX:newC.startX,destY:newC.startY});
						used = true;
						break;
					}
					checkCaseBefore = d[0];
					if(checkCaseBefore.startX == c[i].startX && checkCaseBefore.startY == c[i].startY){
						let newC = c.splice(i,1)[0];
						d.unshift({startX:newC.destX,startY:newC.destY,destX:newC.startX,destY:newC.startY});
						used = true;
						break;
					}
				}
				if(!used){
					d.push(c.splice(0,1)[0]);
				}
			}
			return JSON.stringify(d);
		};

		getBezierXY(type,t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
			switch( type){
			  case 'x': return Math.pow(1-t,3) * sx + 3 * t * Math.pow(1 - t, 2) * cp1x 
				+ 3 * t * t * (1 - t) * cp2x + t * t * t * ex;
			  case 'y': return Math.pow(1-t,3) * sy + 3 * t * Math.pow(1 - t, 2) * cp1y 
				+ 3 * t * t * (1 - t) * cp2y + t * t * t * ey;
			}
		}

		//debug utils count time between events
		startTime(tag="default"){
			if(!this.timerMatch[tag]){this.timerMatch[tag] = {lastTime:-1,arr:[],countZero : 0};}
			this.timerMatch[tag].lastTime = window.performance.now();
		}
		endTime(tag="default"){
			if(!this.timerMatch[tag]){return;}
			let time = window.performance.now() - this.timerMatch[tag].lastTime;
			if(time <= 0){this.timerMatch[tag].countZero++;return;}
			this.timerMatch[tag].arr.push(time);
			this.timerMatch[tag].average = this.getTimeAverage(tag);
			this.timerMatch[tag].allTime = this.getAllTime(tag);
			this.timerMatch[tag].sum = this.sumAllTime(tag);
		}
		getTimeAverage(tag="default"){
			if(!this.timerMatch[tag]){return 0;}
			if(this.timerMatch[tag].arr.length <= 0){return 0;}
			return Math.round((this.timerMatch[tag].arr.reduce((a,b)=>a+b)/this.timerMatch[tag].arr.length)*100)/100;
		}
		getAllTime(tag="default"){
			if(!this.timerMatch[tag]){return 0;}
			if(this.timerMatch[tag].arr.length <= 0){return 0;}
			let sort = this.timerMatch[tag].arr.sort((a,b)=>b-a);
			return Math.round((sort[sort.length-1])*100)/100+">"+this.getTimeAverage(tag)+"<"+Math.round((sort[0])*100)/100;
		}
		resetAllTime(tag="default"){
			if(!this.timerMatch[tag]){return ;}
			this.timerMatch[tag].arr = [];
		}
		sumAllTime(tag="default"){
			if(!this.timerMatch[tag]){return 0;}
			if(this.timerMatch[tag].arr.length <= 0){return 0;}
			return this.timerMatch[tag].arr.reduce((sum, a) => sum + a, 0);
		}
		

		//--- LD
		decompressString(txt, compressor){
			let bs="|";
			var txtSplit = txt.split(bs), autoDecompressor;
			if(txtSplit.length === 1 || txtSplit[0].length>16) txtSplit.unshift("plain");
			autoDecompressor = txtSplit.shift();
			txt = txtSplit.join(bs);
			if(typeof compressor === "undefined") compressor = autoDecompressor;
			switch(compressor){
				case "lz_Base64":
					txt = LZUTF8.decompress(txt, {inputEncoding:compressor.split("_")[1]});
					break;
				case "plain": case "": default:
					//
					break;
			}

			let strReplace ={
				"width":"w",
				"height":"h",
				"cells": "c",
				"option":"o",
				"life":"l",
				"starValues":"S",
				"nbColor":"n",
				"grid":"g",
				"type":"t",
				"void":"v",
				"items":"i",
				"color":"C",
				"spawnPoint":"s",
				"value":"V",
				"bgLife":"b",
				"blockLife":"B",
				"sinker":"si",
				"key":"k",
				"totem":"to",
				"exploder":"e",
				"switcher":"sw",
				"virus":"vi",
				"chest":"ch",
				"copyer":"Co",
				"popper":"p",
				"cndLose":"cl",
				"cndWin":"cw",
				"cndType":"ct",
				"turns":"T",
			}
		
			for(let i in strReplace){
				let re = new RegExp("\""+strReplace[i]+"\"","g");
				txt = txt.replace(re,"\""+i+"\"")
			}
			return txt;
		};

		//--- life manager
		getLastNotifByName(list,name){
			list = (typeof list == "string") ? JSON.parse(list):list;
			var obj = {name:'',timeEnd:-1};
			for(var i in list){
				if(list[i].state =='active' && list[i].name.indexOf(name) != -1){
					if(list[i].timeEnd > obj.timeEnd){
						obj.name = list[i].name;
						obj.timeEnd = list[i].timeEnd;
					}
				}
			}
			return obj.name;
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

	window.playtouchGame.main = new Main();
	window.playtouchGame.utils = new Utils();
})();