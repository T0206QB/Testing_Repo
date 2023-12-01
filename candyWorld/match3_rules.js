
;(function(){
	class RulesClass {
		constructor(){}

		static result_continue(){return -1;}
		static result_handleFalse(){return 0;}
		static result_handleTrue(){return 1;}

		static match_getPosibilities(arrayPos){
			let rules = [["y","-x"],["-x","-y"],["-y","x"],["-x","y"],["y","x"],["x","-y"],["-y","-x"]];
			let ret = [arrayPos];
			for (let i = 0; i < rules.length; i++) {
				let newPos = [];
				for (let y = 0; y < arrayPos.length; y++) {
					newPos.push(this.match_applyRule(rules[i],arrayPos[y]));
				}
				ret.push(newPos);
			}
			return this.match_clearDuplicate(ret);
		}
		static match_applyRule(rule,pos){
			let ret = pos.getCopy();
			for (let i = 0; i < rule.length; i++) {
				let key = (i==0)?"x":"y";
				switch(rule[i]){
					case "x":
						ret[key] = parseInt(pos.x);
					break;
					case "-x":
						ret[key] = parseInt(-pos.x);
					break;
					case "y":
						ret[key] = parseInt(pos.y);
					break;
					case "-y":
						ret[key] = parseInt(-pos.y);
					break;
				}
			}
			return ret;
		}
		static match_clearDuplicate(arrayPos){
			for (let i = 0; i < arrayPos.length; i++) {
				for(let y = arrayPos.length-1;y >= 0;y--){
					if(i == y){continue;}
					if(JSON.stringify(arrayPos[i]) === JSON.stringify(arrayPos[y])){
						arrayPos.splice(y,1);
					}
				}
			}
			return arrayPos;
		}

		static match_3(){return [new Pos(0,1),new Pos(0,2)];}
		static match_4(){return [new Pos(0,1),new Pos(0,2),new Pos(0,3)];}
		static match_5(){return [new Pos(0,1),new Pos(0,2),new Pos(0,3),new Pos(0,4)];}
		static match_T5(){return [new Pos(0,1),new Pos(0,2),new Pos(1,2),new Pos(-1,2)];}
		static match_T6(){return [new Pos(0,1),new Pos(0,2),new Pos(1,2),new Pos(-1,2),new Pos(2,2)];}
		static match_T7(){return [new Pos(0,1),new Pos(0,2),new Pos(1,2),new Pos(-1,2),new Pos(2,2),new Pos(-2,2)];}
		static match_L4(){return [new Pos(0,1),new Pos(0,2),new Pos(1,2)];}
		static match_L5(){return [new Pos(0,1),new Pos(0,2),new Pos(1,2),new Pos(2,2)];}

		static match_Cross5(){return [new Pos(0,1),new Pos(-1,1),new Pos(1,1),new Pos(0,2)];}
		static match_Cross6(){return [new Pos(0,1),new Pos(0,2),new Pos(-1,2),new Pos(1,2),new Pos(0,3)];}
		static match_Cross7(){return [new Pos(0,1),new Pos(0,2),new Pos(-1,2),new Pos(1,2),new Pos(0,3),new Pos(0,4)];}
		static match_Cross7_2(){return [new Pos(0,1),new Pos(0,2),new Pos(-1,2),new Pos(1,2),new Pos(2,2),new Pos(0,3)];}
		static match_Cross8(){return [new Pos(0,1),new Pos(0,2),new Pos(-1,2),new Pos(-2,2),new Pos(1,2),new Pos(0,3),new Pos(0,4)];}
		static match_Cross9(){return [new Pos(0,1),new Pos(0,2),new Pos(-1,2),new Pos(-2,2),new Pos(1,2),new Pos(2,2),new Pos(0,3),new Pos(0,4)];}

		//match Item
		static matchItems_all(item1,item2){return this.result_handleTrue();}
		static matchItems_color(item1,item2){
			if(item1.uid === item2.uid){return this.result_continue();}
			if(item1.color === item2.color){
				return this.result_handleTrue();
			}
			return this.result_handleFalse();
		}
		static matchItems_type_blockLife(item1,item2){
			if(item1.type === "blockLife" || item2.type === "blockLife"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_type_colorBomb(item1,item2){
			if(item1.type === "colorBomb" || item2.type === "colorBomb"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_type_virus(item1,item2){
			if(item1.type === "virus" || item2.type === "virus"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_type_totem(item1,item2){
			if(item1.type === "totem" || item2.type === "totem"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_type_sinker(item1,item2){
			if(item1.type === "sinker" || item2.type === "sinker"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_type_copyer(item1,item2){
			if(item1.type === "copyer" || item2.type === "copyer"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_cell_type_chest(item1,item2){
			if(item1.cell.type === "chest" || item2.cell.type === "chest"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static matchItems_type_popper(item1,item2){
			if(item1.type === "popper" || item2.type === "popper"){return this.result_handleFalse();}
			return this.result_continue();
		}

		// swapItem
		static swapItems_all(item1,item2){return this.result_handleTrue();}
		static swapItems_near1Cell(item1,item2,grid){//1 cell only of distance
			if(!item1.cell || !item2.cell){return this.result_handleFalse();}
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];

			for (let i = 0; i < pos.length; i++) {
				if(item1.cell.x + pos[i].x === item2.cell.x && item1.cell.y + pos[i].y === item2.cell.y){
					return this.result_continue();
				}
			}

			return this.result_handleFalse();
		}
		static swapItems_near1CellAndMatch(item1,item2,grid){//1 cell only of distance and match
			if(!item1.cell || !item2.cell){return this.result_handleFalse();}
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];

			for (let i = 0; i < pos.length; i++) {
				if(item1.cell.x + pos[i].x === item2.cell.x && item1.cell.y + pos[i].y === item2.cell.y){
					grid.swapItemByPos(item1,item2,true,true);
					let savedRule = grid.rules.onlyOneMatch;
					grid.rules.onlyOneMatch = true;
					let matches = grid.checkMatch(false,false,true);
					//restore state
					grid.rules.onlyOneMatch = savedRule;
					grid.swapItemByPos(item1,item2,true,true);
					if(matches.length <= 0){continue;}
					return this.result_handleTrue();
				}
			}

			return this.result_handleFalse();
		}
		static swapItems_blockLife(item1,item2){
			if(item1.type == "blockLife" || item2.type == "blockLife"){
				return this.result_handleFalse();
			}
			if((item1.cell.type == "blockLife" && item1.cell.life >0) || (item2.cell.type == "blockLife" && item2.cell.life >0)){
				return this.result_handleFalse();
			}
			return this.result_continue();
		}
		static swapItems_noSwap(item1,item2){
			let listExclude = ["chest","copyer","virus","popper"];
			if(listExclude.includes(item1.type) || listExclude.includes(item2.type)){return this.result_handleFalse();}
			if(listExclude.includes(item1.cell.type) || listExclude.includes(item2.cell.type)){return this.result_handleFalse();}
			return this.result_continue();
		}
		static swapItems_match(item1,item2,grid){//match
			if(!item1.cell || !item2.cell){return this.result_handleFalse();}

			grid.swapItemByPos(item1,item2,true,true);
			let savedRule = grid.rules.onlyOneMatch;
			grid.rules.onlyOneMatch = true;
			let matches = grid.checkMatch(false,false,true);
			//restore state
			grid.rules.onlyOneMatch = savedRule;
			grid.swapItemByPos(item1,item2,true,true);
			if(matches.length <= 0){return this.result_handleFalse();}
			return this.result_handleTrue();
		}
		static swapItems_bonus(item1,item2){
			let listBonus = ["line_v","line_h","line","colorBomb","bomb"];
			if(listBonus.includes(item1.type) && listBonus.includes(item2.type)){
				return this.result_handleTrue();
			}

			let listExclude = ["totem","chest","sinker","copyer","popper"];
			if((item1.type == "colorBomb" || item2.type == "colorBomb") && 
				!listExclude.includes(item1.type) && 
				!listExclude.includes(item2.type) && 
				!listExclude.includes(item1.cell.type) && 
				!listExclude.includes(item2.cell.type)){
				return this.result_handleTrue();
			}
			return this.result_continue();
		}

		// sort Cells
		static sortCells_top(a,b){if(a.y >= b.y){return 1;}return -1;}
		static sortCells_bottom(a,b){if(a.y <= b.y){return 1;}return -1;}
		static sortCells_left(a,b){if(a.x >= b.x){return 1;}return -1;}
		static sortCells_right(a,b){if(a.x <= b.x){return 1;}return -1;}
		
		// move
		static move_bottom_1(){return new Pos(0,1);}
		static move_bottomLeftRight_1(){return [new Pos(1,1),new Pos(-1,1)];}
		static move_bottomLeft_1(){return new Pos(1,1);}
		static move_bottomRight_1(){return new Pos(-1,1);}
		static move_bottomLeftRight_nearBorder_1(grid,item){
			if(item.x <= grid.logicWidth/2){return new Pos(-1,1)}
			else{return new Pos(1,1);}
		}

		// canMove
		static canMove_empty(item, cell){
			if(!cell.item){
				return this.result_handleTrue();
			}
			return this.result_continue();
		}
		static canMove_type_void(item, cell){
			if(cell.type === "void"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canMove_type_blockLife(item, cell){
			if(item.type === "blockLife" || (item.cell.type == "blockLife" && item.cell.life >0)){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canMove_type_noMove(item, cell){
			let listExclude = ["copyer","virus","chest","popper"];
			if(listExclude.includes(item.type)){return this.result_handleFalse();}
			if(listExclude.includes(item.cell.type)){return this.result_handleFalse();}
			if(listExclude.includes(cell.type)){return this.result_handleFalse();}
			return this.result_continue();
		}


		// posCreateItem
		static posCreateItem_top(width,height,cells){
			let ret = [];
			for (let x = 0; x < width; x++){ret.push(new Pos(x,0));}
			return ret;
		}
		static posCreateItem_bottom(width,height,cells){
			let ret = [];
			for (let x = 0; x < width; x++){ret.push(new Pos(x,height-1));}
			return ret;
		}
		static posCreateItem_left(width,height,cells){
			let ret = [];
			for (let y = 0; y < height; y++){ret.push(new Pos(0,y));}
			return ret;
		}
		static posCreateItem_right(width,height,cells){
			let ret = [];
			for (let y = 0; y < height; y++){ret.push(new Pos(width-1,y));}
			return ret;
		}
		static posCreateItem_centerTop_1(width,height,cells){
			return new Pos(Math.floor((width-1)/2),0);
		}

		// canCreateItem
		static canCreateItem_void(cell){
			if(cell.type == "void"){return false;}
			if(!cell.item){return true;}
			return false;
		}

		// createItem
		static createItemDefault(gridObject,cell,itemOption){
			cell.item = new gridObject.itemClass(cell,gridObject);
			gridObject.applyOption(cell.item,itemOption);
			cell.item.create();
			return cell.item;
		}
		static createItemDefault_type_random4(gridObject,cell,itemOption){
			cell.item = new gridObject.itemClass(cell,gridObject,Math.floor(Math.random()*4));
			gridObject.applyOption(cell.item,itemOption);
			cell.item.create();
			return cell.item;
		}

		// createItemOption
		static createItemOptionDefault(){return {};}
		static createItemOption_type_random4(){return {color:Math.floor(Math.random()*4)};}
		
		// canDestroyItem
		static canDestroyItem_all(cell){
			return this.result_handleTrue();
		}
		static canDestroyItem_life(cell,grid,match){
			let listLife = ["switcher","sinker","blockLife","popper"];
			if(!listLife.includes(cell.item.type)){return this.result_continue();}
			if(!cell.item.baseLife){cell.item.baseLife = cell.item.life;}
			cell.item.life--;
			cell.item.updated();
			if(cell.item.type == "switcher" && cell.item.switcherArrColor.length > 0 && cell.item.life > 0){
				cell.item.setColor(cell.item.switcherArrColor.shift());
			}
			if(cell.item.life > 0){return this.result_handleFalse();}
			return this.result_handleTrue();
		}
		static canDestroyItem_blockLifeNearDestroyed(cell,grid){
			if(cell.item.type == "blockLife"){return this.result_continue();}
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
			for (let i = 0; i < pos.length; i++) {
				let nearCell = grid.getCellByPos(Pos.sumPos(cell.pos,pos[i]));
				if(!nearCell || !nearCell.item){continue;}
				if(nearCell.item.type === "blockLife"){
					grid.checkRules.checkDestroyItem(nearCell,grid,undefined,[this.canDestroyItem_oneTime_cell,this.canDestroyItem_cellChest,this.canDestroyItem_life],[]);
				}
			}
			return this.result_continue();
		}
		static canDestroyItem_totem(cell){
			if(cell.item.type != "totem"){return this.result_continue();}
			return this.result_handleFalse();
		}
		static canDestroyItem_cellBlockLife(cell,grid,match,reason){
			if(cell.type != "blockLife"){return this.result_continue();}
			if(cell.life <= 0){return this.result_continue();}
			if(!cell.baseLife){cell.baseLife = cell.life;}
			cell.life--;
			cell.updated(reason);
			if(cell.life <= 0){cell.setType("");}
			return this.result_handleFalse();
		}
		static canDestroyItem_cellBGLife(cell){
			if(cell.type != "bgLife"){return this.result_continue();}
			if(cell.life <= 0){return this.result_continue();}
			if(!cell.baseLife){cell.baseLife = cell.life;}
			cell.life--;
			cell.updated();
			if(cell.life <= 0){cell.setType("");}
			return this.result_continue();
		}
		static canDestroyItem_virusNearDestroyed(cell,grid){
			if(cell.item.type == "virus"){return this.result_continue();}
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
			for (let i = 0; i < pos.length; i++) {
				let nearCell = grid.getCellByPos(Pos.sumPos(cell.pos,pos[i]));
				if(!nearCell || !nearCell.item){continue;}
				if(nearCell.item.type === "virus"){
					grid.checkRules.checkDestroyItem(nearCell,grid,undefined,[this.canDestroyItem_all],[]);
				}
			}
			return this.result_continue();
		}
		static canDestroyItem_cellChest(cell){
			if(cell.type != "chest"){return this.result_continue();}
			return this.result_handleFalse();
		}
		static canDestroyItem_sinkerNearDestroyed(cell,grid){
			if(cell.item.type == "sinker"){return this.result_continue();}
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
			for (let i = 0; i < pos.length; i++) {
				let nearCell = grid.getCellByPos(Pos.sumPos(cell.pos,pos[i]));
				if(!nearCell || !nearCell.item){continue;}
				if(nearCell.item.type === "sinker"){
					if(nearCell.type == "blockLife"){continue;}
					// TODO >> verifier le type de la cell >>
					grid.checkRules.checkDestroyItem(nearCell,grid,undefined,[this.canDestroyItem_oneTime_cell,this.canDestroyItem_cellChest,this.canDestroyItem_life],[]);
				}
			}
			return this.result_continue();
		}
		static canDestroyItem_copyerNearDestroyed(cell,grid,match){
			if(cell.item.type == "copyer"){return this.result_handleFalse();}
			if(match.match.length <= 1){return this.result_continue();}

			let colorCheck = cell.item.color;
			if(typeof match.color != "undefined" && match.color != -1){
				colorCheck = match.color;
			}else{
				match.color = colorCheck;
			}

			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
			for (let i = 0; i < pos.length; i++) {
				let nearCell = grid.getCellByPos(Pos.sumPos(cell.pos,pos[i]));
				if(!nearCell || !nearCell.item){continue;}
				if(nearCell.item.type !== "copyer"){continue;}

				if(!match.triggered_copyer){ match.triggered_copyer = []};
				if(match.triggered_copyer.includes(nearCell.id)){continue;}

				if(match.match.length == 1 && (match.match[0].x != nearCell.x && match.match[0].y != nearCell.y)){continue;}
				if(typeof nearCell.item.colorCopyer == "undefined" || nearCell.item.colorCopyer == -1){nearCell.item.colorCopyer = colorCheck;nearCell.item.updated();}
				if(nearCell.item.colorCopyer !== colorCheck){continue;}
				match.triggered_copyer.push(nearCell.id);
				grid.checkRules.checkDestroyItem(nearCell,grid,undefined,[this.canDestroyItem_cellChest,this.canDestroyItem_life_copyer],[]);
			}
			return this.result_continue();
		}
		static canDestroyItem_life_copyer(cell,grid,match){
			let listLife = ["copyer"];
			if(!listLife.includes(cell.item.type)){return this.result_continue();}
			if(!cell.item.baseLife){cell.item.baseLife = cell.item.life;}
			if((typeof cell.item.colorCopyer == "undefined" || cell.item.colorCopyer == -1) && match && typeof match.color != "undefined" && match.color != -1){cell.item.colorCopyer = match.color;cell.item.updated();}
			if(typeof match.color != "undefined" && (match.color == -1 || cell.item.colorCopyer !== match.color)){return this.result_continue();}
			if(typeof cell.item.colorCopyer == "undefined" || cell.item.colorCopyer == -1){return this.result_continue();}
			cell.item.life--;
			cell.item.updated();
			if(cell.item.life > 0){return this.result_handleFalse();}
			return this.result_handleTrue();
		}
		static canDestroyItem_popperNearDestroyed(cell,grid,match){
			if(cell.item.type == "popper"){return this.result_continue();}
			if(match.match.length < 3){return this.result_continue();}
			let pos = [new Pos(0,1),new Pos(1,0),new Pos(0,-1),new Pos(-1,0)];
			for (let i = 0; i < pos.length; i++) {
				let nearCell = grid.getCellByPos(Pos.sumPos(cell.pos,pos[i]));
				if(!nearCell || !nearCell.item){continue;}
				if(nearCell.item.type !== "popper"){continue;}

				if(!match.triggered_popper){ match.triggered_popper = []};
				if(match.triggered_popper.includes(nearCell.id)){continue;}

				if(match.match.length == 1 && (match.match[0].x != nearCell.x && match.match[0].y != nearCell.y)){continue;}
				match.triggered_popper.push(nearCell.id);
				grid.checkRules.checkDestroyItem(nearCell,grid,undefined,[this.canDestroyItem_oneTime_cell,this.canDestroyItem_cellChest,this.canDestroyItem_life],[]);
			}
			return this.result_continue();
		}
		static canDestroyItem_life_popper_os(cell,grid,match){
			if(cell.item.type != "popper"){return this.result_continue();}
			if(match.match.length <= 0){return this.result_continue();}
			if(match.name !== "popper"){return this.result_continue();}
			cell.item.life = 0;
			cell.item.updated();
			return this.result_handleTrue();
		}
		static canDestroyItem_oneTime_cell(cell,grid,match){
			if(!grid.rulesCache){grid.rulesCache = {};}
			if(!grid.rulesCache.checkMove){grid.rulesCache.checkMove = {};}
			if(!grid.rulesCache.checkMove.oneTime_cell){grid.rulesCache.checkMove.oneTime_cell = [];}
			if(grid.rulesCache.checkMove.oneTime_cell.indexOf(cell.id) == -1){
				grid.rulesCache.checkMove.oneTime_cell.push(cell.id);
				return this.result_continue();
			}
			return this.result_handleFalse();
		}
		static canDestroyItem_oneTime_cell_rulesNoItem(cell,grid,match){
			if(!grid.rulesCache){grid.rulesCache = {};}
			if(!grid.rulesCache.checkMove){grid.rulesCache.checkMove = {};}
			if(!grid.rulesCache.checkMove.oneTime_cell){grid.rulesCache.checkMove.oneTime_cell = [];}
			if(grid.rulesCache.checkMove.oneTime_cell.indexOf(cell.id) == -1){
				return this.result_continue();
			}
			return this.result_handleFalse();
		}

		

		// canTouch
		static canTouch_type_item_blockLife(cell){
			if(cell.item && cell.item.type === "blockLife"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canTouch_type_item_virus(cell){
			if(cell.item && cell.item.type === "virus"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canTouch_type_item_copyer(cell){
			if(cell.item && cell.item.type === "copyer"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canTouch_type_cell_blockLife(cell){
			if(cell.type === "blockLife"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canTouch_type_cell_chest(cell){
			if(cell.type === "chest"){return this.result_handleFalse();}
			return this.result_continue();
		}
		static canTouch_type_item_popper(cell){
			if(cell.item && cell.item.type === "popper"){return this.result_handleFalse();}
			return this.result_continue();
		}

	}


	if(typeof window.playtouchGame === "undefined"){window.playtouchGame = {};}
	if(typeof window.playtouchGame.match3 === "undefined"){window.playtouchGame.match3 = {};}
	window.playtouchGame.match3.RulesClass = RulesClass;
	var Pos = window.playtouchGame.match3.Pos;
})();