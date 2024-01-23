//V1.0.20200303

// Board
///////////////////////////////////////////////////////////

    function Board() {
        this.gridWidth = 0; // length on x
        this.gridHeight = 0; // length on y
        this.grid = []; // array to store tiles
        this.boardData = []; // array to store treated levelData
        this.changeLog = {}; // object to store changes on board after a move
        this.equationsList = {}; // object to store board solutions
        this.gameInitialised = false; // param to know if board has been created or not
        this.gameOver = false; // param to know if board has been solved or not
        this.boardSolutionsSheet = {}; // object to store board solutions
        this.equationCount = 0; // number of valid equations on the board
    }

    Board.prototype.initLevelFromPack = function(levelData) {

        /* levelData sample format
        {
            "w":6,
            "h":7,
            "d":",,,,,,M7,,,,,,,,,,,,E,L=,L2,L+,L5,,,,,,,,,,,,,,,,,,,,"
        }

        Legend: 
        w - board width
        h - board height
        Mx - moveable tile containing value x (can be =,+,-,/,* or any positive non-zero integer)
        Lx - Locked tile containing value x (can be =,+,-,/,* or any positive non-zero integer)
        E - locked empty tile which can receive a moveable tile
        */

        Tile.prototype.currId = 0;
        return this.boardLog("initializeBoardLog")
                .setWidth(parseInt(levelData.w))
                .setHeight(parseInt(levelData.h))
                .setBoardData((levelData.d).split(","))
                .setUpBoardAssets()
                .setGameOver(false)
                .setGameInitialised();
    };

    Board.prototype.setUpBoardAssets = function(){

        var levelData = this.getBoardData(),
            width = this.getWidth(),
            height = this.getHeight();

        for (var logicX = 0; logicX < width; logicX++){
            for (var logicY = 0; logicY < height; logicY++) {
                
                var dataSegment = levelData[logicX + (logicY*width)],
                    cellID = logicX+"_"+logicY,
                    cellData = {
                                "canAccomodate": this.getValueFromDataSegment("canAccomodate", dataSegment),
                                "isPartOfEquation": this.getValueFromDataSegment("isPartOfEquation", dataSegment),
                                "logicX": logicX,
                                "logicY": logicY,
                                "tile": {}
                                },
                    tileConfig = {
                                    "value": this.getValueFromDataSegment("value", dataSegment),
                                    "ghost": false,
                                    "isMoveable": this.getValueFromDataSegment("isMoveable", dataSegment),
                                    "board": this
                                };
                
                this.setCell(cellID, cellData);
                if (!!tileConfig.value) this.createTileIntoCell(cellID, this.createTile(tileConfig));
            }
        }

        this.detectAndSaveEquations();
        this.initSolutionFinder();
        return this;
    };

    Board.prototype.getValueFromDataSegment = function(query, dataSegment){

        /*
        dataSegment Legend: 
        Mx - moveable tile containing value x (can be =,+,-,/,* or any positive non-zero integer)
        Lx - Locked tile containing value x (can be =,+,-,/,* or any positive non-zero integer)
        E - locked empty tile which can receive a moveable tile
        "" - nothing here
        */
        switch (query) {
            case "canAccomodate":
                if (dataSegment[0] == "L") return false;
                return true;
                break;

            case "isPartOfEquation":
                if (dataSegment[0] == "E" || dataSegment[0] == "L") return true;
                return false;
                break;

            case "value":
                if (dataSegment[0] == "M" || dataSegment[0] == "L") return dataSegment.slice(1);
                return false;
                break;

            case "isMoveable":
                if (dataSegment[0] == "L") return false;
                return true;
                break;

            default:
                return false;
        }
    };

    Board.prototype.createTileIntoCell = function(cellID, tile){

        this.addTileToCell(cellID, tile);
        this.boardLog("create", cellID);
        return this;
    };

    Board.prototype.addTileToCell = function(cellID, tile){

        this.grid[cellID].tile = tile;
        return this;
    };

    Board.prototype.removeTileFromCell = function(cellID){

        this.grid[cellID].tile = {};
        return this;
    };

    Board.prototype.createTile = function(config){

        return (new Tile()).loadConfig(config).setBoard(this);
    };

    Board.prototype.detectAndSaveEquations = function(){

        var width = this.getWidth(),
            height = this.getHeight(),
            equationsList = {},
            equationCount = 0;

        for (var logicX = 0; logicX < width; logicX++) {    
            equationsList["column_"+logicX] = this.returnEquationArrayInColumn(logicX);

            if (equationsList["column_"+logicX].length > 0) equationCount += 1;
        }

        for (var logicY = 0; logicY < height; logicY++) {    
            equationsList["row_"+logicY] = this.returnEquationArrayInRow(logicY);

            if (equationsList["row_"+logicY].length > 0) equationCount += 1;
        }

        this.setEquationsList(equationsList);
        this.setEquationCount(equationCount);
        return this;
    };

    Board.prototype.returnEquationArrayInColumn = function(logicX) {

        var height = this.getHeight();

        for(var logicY = 0; logicY <= height - 4; logicY++){

            if (!this.checkFor5ConsecutiveVerticalCells(logicX,logicY)) continue;

            return [logicX+"_"+logicY, logicX+"_"+(logicY+1), logicX+"_"+(logicY+2), logicX+"_"+(logicY+3), logicX+"_"+(logicY+4)];
        }

        return [];
    };

    Board.prototype.returnEquationArrayInRow = function(logicY) {

        var width = this.getWidth();

        for(var logicX = 0; logicX <= width - 4; logicX++){

            if (!this.checkFor5ConsecutiveHorizontalCells(logicX,logicY)) continue;

            return [logicX+"_"+logicY, (logicX+1)+"_"+logicY, (logicX+2)+"_"+logicY, (logicX+3)+"_"+logicY, (logicX+4)+"_"+logicY];
        }

        return [];
    };

    Board.prototype.checkFor5ConsecutiveVerticalCells = function(logicX, logicY){

        for (var count = 0; count < 5; count++) {
            
            if (this.getCell(logicX+"_"+logicY).isPartOfEquation) {

                logicY += 1;
                continue;
            }else{

                return false;
            }
        }

        return true;
    };

    Board.prototype.checkFor5ConsecutiveHorizontalCells = function(logicX, logicY){

        for (var count = 0; count < 5; count++) {
            
            if (this.getCell(logicX+"_"+logicY).isPartOfEquation) {

                logicX += 1;
                continue;
            }else{

                return false;
            }
        }

        return true;
    };

    Board.prototype.log = function() {

        var returnString = "";
        var logicX = 0;
        var logicY = 0;
        var newLine = "\n";
        var axisX = "";
        var boardHeight = this.getHeight();
        var boardWidth = this.getWidth();
        var maxWidth = (this.getMaxDataWidth() < 3) ? 3 : this.getMaxDataWidth();


        for (logicX = 0; logicX < boardWidth; logicX++) {

            axisX += (padValue(logicX, maxWidth)).replace("[", " ").replace("]", " ");
        }

        returnString += (padValue("Y\\X", maxWidth)).replace("[", " ").replace("]", " ") + axisX;

        for (logicY = 0; logicY < boardHeight; logicY++) {
            for (logicX = 0; logicX < boardWidth; logicX++) {

                var tile = this.getTileAt(logicX, logicY),
                    tiletext = padValue(tile.getValue(), maxWidth);

                if (tile.canMove()) tiletext = tiletext.replace("[", ">").replace("]", "<");
                if (!this.getCell(logicX+"_"+logicY).isPartOfEquation) tiletext = tiletext.replace("[", " ").replace("]", " ");
                if (logicX === 0) {

                    returnString += newLine +
                        (padValue(logicY, maxWidth)).replace("[", " ").replace("]", " ") + tiletext;

                } else {

                    returnString += tiletext;

                }
            }
        }

        //window.console.clear();
        window.console.log("%c" + returnString, "color: DodgerBlue");
        return this;
    };

    Board.prototype.getMaxDataWidth = function() {

        var logicX = 0;
        var logicY = 0;
        var maxWidth = 0;
        var boardHeight = this.getHeight();
        var boardWidth = this.getWidth();

        for (logicY = 0; logicY < boardHeight; logicY++) {
            for (logicX = 0; logicX < boardWidth; logicX++) {

                var localWidth = this.getTileAt(logicX, logicY).getValueWidth();
 
                if (maxWidth < localWidth) maxWidth = localWidth;

            }
        }
        return maxWidth;
    };

    Board.prototype.getTileAt = function(logicX,logicY){

        var cellID = logicX,
            emptyObj = {};
        
        if (logicX >= 0 &&  logicY >= 0) cellID = logicX+"_"+logicY;

        var tile = this.getCell(cellID).tile;
        
        if(tile === undefined || JSON.stringify(tile) === JSON.stringify(emptyObj)) return this.createTile({
                                                                                    "value": "",
                                                                                    "ghost": true,
                                                                                    "isMoveable": false,
                                                                                    "board": undefined
                                                                                    });    
        return tile;
    };

    Board.prototype.boardLog = function(command, cellID1, cellID2) {

        switch (command) {

            case "initializeBoardLog":
                this.changeLog = {"isInUse":false,"merge":{}, "destroy":[], "swapTiles":[], "posChange":[], "create":[]};
                break;

            case "refresh":
                if (this.changeLog.isInUse) {
                    this.changeLog = {"isInUse":false,"merge":{}, "destroy":[], "swapTiles":[], "posChange":[], "create":[]};
                }
                break;

            case "export":
                if (this.changeLog.isInUse) {
                    this.changeLog.isInUse = this.changeLog.isInUse.asInt();
                    var exportString = JSON.stringify(this.changeLog);
                    this.boardLog("refresh");
                    return exportString;
                }else{
                    return false;
                }
                break;

            case "merge":
                if (!this.changeLog.isInUse) this.changeLog.isInUse = true;
                this.changeLog.merge =  {
                                        "logicX":"",
                                        "logicY":"",
                                        "value":""
                                        };
                break;

            case "destroy":
                if (!this.changeLog.isInUse) this.changeLog.isInUse = true;
                this.changeLog.destroy.push(
                                            {
                                            "logicX":"",
                                            "logicY":""
                                            }
                                            );
                break;

            case "swapTiles":
                if (!this.changeLog.isInUse) this.changeLog.isInUse = true;
                this.changeLog.swapTiles.push(
                                            {
                                            "initLogicX":cellID2.split("_")[0],
                                            "initLogicY":cellID2.split("_")[1],
                                            "finalLogicX":cellID1.split("_")[0],
                                            "finalLogicY":cellID1.split("_")[1]
                                            }
                                            );
                break;

            case "posChange":
                if (!this.changeLog.isInUse) this.changeLog.isInUse = true;
                this.changeLog.posChange.push(
                                            {
                                            "initLogicX":cellID2.split("_")[0],
                                            "initLogicY":cellID2.split("_")[1],
                                            "finalLogicX":cellID1.split("_")[0],
                                            "finalLogicY":cellID1.split("_")[1]
                                            }
                                            );
                break;

            case "create":
                if (!this.changeLog.isInUse) this.changeLog.isInUse = true;
                this.changeLog.create.push(
                                            {
                                            "logicX": cellID1.split("_")[0],
                                            "logicY": cellID1.split("_")[1],
                                            "value": this.getTileAt(cellID1).getValue(),
                                            "tag": cellID1,
                                            "canAccomodate": (this.getCell(cellID1).canAccomodate).asInt(),
                                            "isMoveable": (this.getTileAt(cellID1).canMove()).asInt()
                                            }
                                            );
                break;

            default:
                return false;
        }
        return this;
    };

    Board.prototype.isTileMoveableConstruct = function(cellID){

    	return (this.getTileAt(cellID).canMove()).asInt();
    };

    Board.prototype.computeX = function(logicX, offsetX, cellWidth){
        var positionX = offsetX + (0.5 + logicX)*cellWidth;
        return ((Math.floor(positionX*10))/10);
    };

    Board.prototype.computeY = function(logicY, offsetY, cellHeight){
        var positionY = offsetY + (0.5 + logicY)*cellHeight;
        return ((Math.floor(positionY*10))/10);
    };

    Board.prototype.isMoveArrayValid = function(moveArray){

        if (this.getTileAt(moveArray[0]).canMove() && this.getCell(moveArray[1]).canAccomodate) return true;
        return false;
    };

    Board.prototype.moveTileToCell = function(moveArray){

        var originCellID = moveArray[0],
            destinationCellID = moveArray[1],
            tileAtOrigin = this.getTileAt(originCellID),
            tileAtDestination = this.getTileAt(destinationCellID);

        this.removeTileFromCell(originCellID);
        this.removeTileFromCell(destinationCellID);
        
        if (!tileAtDestination.isGhost()) {

            this.addTileToCell(originCellID,tileAtDestination);
            this.addTileToCell(destinationCellID,tileAtOrigin);
            this.boardLog("swapTiles", originCellID, destinationCellID);

        }else{

        	this.addTileToCell(destinationCellID,tileAtOrigin);
        	this.boardLog("posChange", destinationCellID, originCellID);
        } 

        return this.checkBoardSolutions();
    };

    Board.prototype.checkBoardSolutions = function(){

        var equationsList = this.getEquationsList(),
            localCheck = true;

        for(var i in equationsList){

            if(!equationsList.hasOwnProperty(i))  continue;
            
            var currEquation = equationsList[i];

            if (!Array.isArray(currEquation)) continue;
            if (currEquation.length === 0) continue;
            if(this.isEquationSolutionValid(currEquation)) continue;
            
            localCheck = false;
            break;
        }

        this.setGameOver(localCheck);
        return this;
    };

    Board.prototype.isEquationSolutionValid = function(equationArray){
        
        if (!this.isEquationArrayFullOfTiles(equationArray)) return false;
        
        var valuesArray = this.extractValuesArray(equationArray);

        return this.checkEquationSolution(valuesArray);
    };

    Board.prototype.doesCellContainTile = function(cellID){

        if (this.getTileAt(cellID).isGhost()) return false;
        if (!this.getTileAt(cellID).isGhost()) return true;
        return false;
    };

    Board.prototype.doesCellContainTileConstruct = function(cellID){

        if (this.getTileAt(cellID).isGhost()) return false.asInt();
        if (!this.getTileAt(cellID).isGhost()) return true.asInt();
        return false.asInt();
    };

    Board.prototype.isEquationArrayFullOfTiles = function(equationArray){

        for (var i = 0; i < equationArray.length; i++){

            if(!this.doesCellContainTile(equationArray[i])) return false;

        }
        return true;
    };

    Board.prototype.extractValuesArray = function(equationArray){

        var valuesArray = [];
        for (var index = 0; index < equationArray.length; index++) {

            valuesArray[index] = this.getTileAt(equationArray[index]).getValue();
        }
        return valuesArray;
    };

    Board.prototype.checkEquationIntegrity = function(valuesArray){

        if (this.isANumber(valuesArray[0]) && this.isEqualitySign(valuesArray[1]) && this.isANumber(valuesArray[2]) && this.isArithmeticOperator(valuesArray[3]) && this.isANumber(valuesArray[4])) {

            return true;    
        }else{

            if (this.isANumber(valuesArray[0]) && this.isEqualitySign(valuesArray[3]) && this.isANumber(valuesArray[2]) && this.isArithmeticOperator(valuesArray[1]) && this.isANumber(valuesArray[4])) return true;
        }

        return false;
    };

    Board.prototype.isANumber = function(value){

        if (parseInt(value) > 0) return true;
        return false;
    };

    Board.prototype.isEqualitySign = function(value){

        if (value === "=") return true;
        return false;
    };

    Board.prototype.isArithmeticOperator = function(value){

        if (value === "+" || value === "-" || value === "/" || value === "*") return true;
        return false;
    };

    Board.prototype.checkEquationSolution = function(valuesArray){

        if (!this.checkEquationIntegrity(valuesArray)) return false;

        var result = 0,
            val1 = 0,
            val2 = 0,
            arithmeticOperator = "";

        if (this.isEqualitySign(valuesArray[3])){

            result = parseInt(valuesArray[4]);
            val1 = parseInt(valuesArray[0]);
            val2 = parseInt(valuesArray[2]);
            arithmeticOperator = valuesArray[1];

            if (result === this.doCalculation(arithmeticOperator, val1, val2)) return true;
            
        }else if (this.isEqualitySign(valuesArray[1])) {

            result = parseInt(valuesArray[0]);
            val1 = parseInt(valuesArray[2]);
            val2 = parseInt(valuesArray[4]);
            arithmeticOperator = valuesArray[3];

            if (result === this.doCalculation(arithmeticOperator, val1, val2)) return true;

        }else{

            return false;
        }

        return false;
    };

    Board.prototype.doCalculation = function(arithmeticOperator, val1, val2){

        switch(arithmeticOperator){

            case "+":
                return this.addNumbers(val1,val2);
                break;

            case "-":
                return this.substractNumbers(val1,val2);
                break;

            case "/":
                return this.divideNumbers(val1,val2);
                break;
        
            case "*":
                return this.multiplyNumbers(val1,val2);
                break;
        
            default:
                return false;
        }
    };

    Board.prototype.addNumbers = function(val1,val2){

        return val1 + val2;
    };

    Board.prototype.substractNumbers = function(val1,val2){

        return Math.abs(val1 - val2);
    };

    Board.prototype.divideNumbers = function(val1,val2){
    
        return val1 / val2;
    };

    Board.prototype.multiplyNumbers = function(val1,val2){

        return val1 * val2;
    };

    Board.prototype.solveOneEquation = function(){
        
        var currEquation = this.fetchNextUnsolvedEquation(),
            valuesArray = this.extractValuesArray(currEquation),
            solutionSheet = this.getBoardSolutionsSheet(),
            grid = this.getGrid();

        for (var i = 0; i < currEquation.length; i++) {

            if (this.getCell(currEquation[i]).canAccomodate && this.getCell(currEquation[i]).isPartOfEquation) {

                var targetCell = currEquation[i],
                    valueToSeek = solutionSheet[targetCell],
                    solved = false;
                    
                if (valuesArray[i] === valueToSeek) continue;
                    
                for (var cellID in grid) {

                    if (!grid.hasOwnProperty(cellID)) continue;
                    if (cellID === targetCell) continue;
                    if (this.doesCellContainTile(cellID)){

                        var tile = this.getTileAt(cellID);

                        if (tile.canMove() && tile.getValue() === valueToSeek) {

                            if (!this.getCell(cellID).isPartOfEquation) {

                                this.moveTileToCell([cellID,targetCell]);
                                solved = true;
                                break;
                            }
                        }
                    }
                }

                if (!solved) {

                    for (var cellID in grid) {
    
                        if (!grid.hasOwnProperty(cellID)) continue;
                        if (cellID === targetCell) continue;
                        if (this.doesCellContainTile(cellID)){
    
                            var tile = this.getTileAt(cellID);
    
                            if (tile.canMove() && tile.getValue() === valueToSeek) {
    
                                if (this.getCell(cellID).isPartOfEquation && !this.doesTileSatisfyAllEquations(cellID)) {
    
                                        this.moveTileToCell([cellID,targetCell]);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }

        return this;
    };

    Board.prototype.fetchNextUnsolvedEquation = function(){

        var equationsList = this.getEquationsList(),
            nextUnsolvedEquation = [];

        for(var i in equationsList){

            if (!equationsList.hasOwnProperty(i))  continue;
            var currEquation = equationsList[i];

            if (!Array.isArray(currEquation)) continue;
            if (currEquation.length === 0) continue;
            if (this.isEquationSolutionValid(currEquation)) continue;
            
            nextUnsolvedEquation = currEquation;
            break;
        }

        return nextUnsolvedEquation;
    };

    Board.prototype.doesTileSatisfyAllEquations = function(cellID) {

        var tile = this.getTileAt(cellID),
            equationsList = this.getEquationsList();

        if (tile.isGhost()) return false;

            for (var index in equationsList) {

                if (!equationsList.hasOwnProperty(index)) continue;
                if ((equationsList[index]).length === 0) continue;

                var currEquation = equationsList[index];

                for (var i = 0; i < currEquation.length; i++) {

                    if (currEquation[i] === cellID) {

                        if (!this.checkEquationSolution(this.extractValuesArray(currEquation))) return false;
                    }
                }
            }

        return true; 
    };

    Board.prototype.doesTileSatisfyAtleastOneEquation = function(cellID) {

        var tile = this.getTileAt(cellID),
            equationsList = this.getEquationsList();

        if (tile.isGhost()) return false;

            for (var index in equationsList) {

                if (!equationsList.hasOwnProperty(index)) continue;
                if ((equationsList[index]).length === 0) continue;

                var currEquation = equationsList[index];

                for (var i = 0; i < currEquation.length; i++) {

                    if (currEquation[i] === cellID) {

                        if (this.checkEquationSolution(this.extractValuesArray(currEquation))) return true;
                    }
                }
            }

        return false; 
    };

    Board.prototype.doesTileNotSatisfyAtleastOneFullEquation = function(cellID) {

        var tile = this.getTileAt(cellID),
            equationsList = this.getEquationsList();

        if (tile.isGhost()) return false;

            for (var index in equationsList) {

                if (!equationsList.hasOwnProperty(index)) continue;
                if ((equationsList[index]).length === 0) continue;

                var currEquation = equationsList[index];

                for (var i = 0; i < currEquation.length; i++) {

                    if (currEquation[i] === cellID) {

                        if (this.isEquationArrayFullOfTiles(currEquation) && !this.checkEquationSolution(this.extractValuesArray(currEquation))) return true;
                    }
                }
            }

        return false; 
    };

    Board.prototype.returnTileColorConstruct = function(cellID){

    	/*
			0 - unchanged/unsolved
			1 - unsolved
			2 - solved
    	*/

    	if (this.checkIfPartOfEquation(cellID) === 0) return 0;
    	if (this.doesTileSatisfyAtleastOneEquation(cellID)) return 2;
    	if (this.doesTileNotSatisfyAtleastOneFullEquation(cellID)) return 1;

    	return 0;
    };

// Board - LD solution finder
///////////////////////////////////////////////////////////

    Board.prototype.initSolutionFinder = function(){

        var equationsStack = JSON.parse(JSON.stringify(this.getEquationsList())),
            moveableTileValuesStack = this.fetchMoveableTileValues(),
            iterationCount = 0;

        equationsStack._keys = Object.keys(equationsStack);

        var iterationDataObject = this.iterateEquations(equationsStack, moveableTileValuesStack, iterationCount);

        if (!iterationDataObject) return this.initSolutionFinder();

        this.setBoardSolutionsSheet(iterationDataObject.solutionsObject);

        return this;
    };

    Board.prototype.iterateEquations = function(equationsStack, moveableTileValuesStack, iterationCount){

        if (iterationCount > 1000) return false;

        var batchIterationCheck = true,
            bufferIterationDataObject = {
                                            "solved": false,
                                            "moveableTileValuesStack": [],
                                            "currSolution": {}
                                        },
            iterationDataObject = {
                                    "moveableTileValuesStack": Object.assign([], moveableTileValuesStack),
                                    "solutionsObject": {}
                                    },
            keysArray = equationsStack["_keys"];

        for (var i = 0; i < keysArray.length; i++){

            var currEquation = equationsStack[keysArray[i]];

            if (currEquation.length === 0) continue;

            bufferIterationDataObject = this.iterateEquationForSolution(currEquation, iterationDataObject);
         
            if (bufferIterationDataObject.solved === true) {

                var newMoveableTileValues = bufferIterationDataObject.moveableTileValuesStack,
                    newSolutions = bufferIterationDataObject.currSolution;

                iterationDataObject.moveableTileValuesStack = newMoveableTileValues;
                if (newSolutions !== {}) {
                
                    iterationDataObject.solutionsObject = this.addToObject(newSolutions, iterationDataObject.solutionsObject);
                }

            }else{
                 
                batchIterationCheck = false;
                break;
            }
        }
   
        if (batchIterationCheck) return iterationDataObject;
         
        iterationCount += 1;
                                                                                    
        equationsStack["_keys"] = shuffleArray(equationsStack["_keys"]);
        moveableTileValuesStack = shuffleArray(moveableTileValuesStack);

        return this.iterateEquations(equationsStack, moveableTileValuesStack, iterationCount);
    };

    Board.prototype.iterateEquationForSolution = function(currEquation, iterationDataObject){

        var looping = true,
            valuesArray = this.extractAndUpdateValuesArray(currEquation, iterationDataObject.solutionsObject),
            missingTiles = this.countNbOfMissingTiles(currEquation),
            testTileArray = [],
            testArray = [],
            currSolution = {},
            loopCount = 0;
 
        while (looping) {

            testArray = Object.assign([],valuesArray);
            testTileArray = Object.assign([],iterationDataObject.moveableTileValuesStack);
            currSolution = {};

            testTileArray = shuffleArray(testTileArray);

            for (var index = 0; index < testArray.length; index++) {

                if (testArray[index] === "") {
                    testTileArray = shuffleArray(testTileArray);
                    var testTileArrayIndex = this.findIndexOfBestValue(testArray, index, testTileArray),
                        randomTileValue = 0,
                        cellID = currEquation[index];


                    randomTileValue = testTileArray[testTileArrayIndex];
                    testArray[index] = randomTileValue;
                    currSolution[cellID] = randomTileValue;
                    testTileArray.splice(testTileArrayIndex,1);
                }
            }

            if (this.checkEquationSolution(testArray)) {

                looping = false;
                iterationDataObject = {
                                        "solved": true,
                                        "moveableTileValuesStack": testTileArray,
                                        "currSolution": currSolution
                                        };
            }else{

                if (loopCount > 1000) {

                    looping = false;
                    iterationDataObject = {
                                        "solved": false,
                                        "moveableTileValuesStack": [],
                                        "currSolution": {}
                                        };
                }

                if (missingTiles === (iterationDataObject.moveableTileValuesStack).length && loopCount > 120) {

                    looping = false;
                    iterationDataObject = {
                                        "solved": false,
                                        "moveableTileValuesStack": [],
                                        "currSolution": {}
                                        };
                }
            }

            loopCount += 1;
        }

        return iterationDataObject;
    };

    Board.prototype.findIndexOfBestValue = function (valuesArray, index, valuesStack) {

        switch(index){

            case 0:
                return this.getNumberIndex(valuesStack);
                break;

            case 2:
                return this.getNumberIndex(valuesStack);
                break;

            case 4:
                return this.getNumberIndex(valuesStack);
                break;

            case 1:

                if (this.isEqualitySign(valuesArray[3])) return this.getArithmeticOperatorIndex(valuesStack);
                if (this.isArithmeticOperator(valuesArray[3])) return this.getEqualityIndex(valuesStack);
                return this.getArithmeticOperatorOrEqualityIndex(valuesStack);
                break;

            case 3:

                if (this.isEqualitySign(valuesArray[1])) return this.getArithmeticOperatorIndex(valuesStack);
                if (this.isArithmeticOperator(valuesArray[1])) return this.getEqualityIndex(valuesStack);
                return this.getArithmeticOperatorOrEqualityIndex(valuesStack);
                break;
                    
            default:
                return valuesStack.length - 1;

        }
    }

    Board.prototype.getNumberIndex = function (valuesStack){

        for (var i = 0; i < valuesStack.length; i++){

            if (this.isANumber(valuesStack[i])) {
   
                return i;
            }
        }

        return valuesStack.length - 1;
    }

    Board.prototype.getEqualityIndex = function (valuesStack){

        for (var i = 0; i < valuesStack.length; i++){

            if (this.isEqualitySign(valuesStack[i])) {
   
                return i;
            }
        }

        return valuesStack.length - 1;
    }

    Board.prototype.getArithmeticOperatorIndex = function (valuesStack){

        for (var i = 0; i < valuesStack.length; i++){

            if (this.isArithmeticOperator(valuesStack[i])) {
   
                return i;
            }
        }

        return valuesStack.length - 1;
    }

    Board.prototype.getArithmeticOperatorOrEqualityIndex = function (valuesStack){

        for (var i = 0; i < valuesStack.length; i++){

            if (this.isEqualitySign(valuesStack[i]) || this.isArithmeticOperator(valuesStack[i])) {
   
                return i;
            }
        }

        return valuesStack.length - 1;
    }

    Board.prototype.addToObject = function(objToAdd, objToReceive){

        for (var keys in objToAdd) {
            if(!objToAdd.hasOwnProperty(keys))  continue;
            objToReceive[keys] = objToAdd[keys];
        }

        return objToReceive;
    };

    Board.prototype.extractAndUpdateValuesArray = function(currEquation, solutionCells){

        var valuesArray = this.extractValuesArray(currEquation);

        if (Object.keys(solutionCells).length === 0) return valuesArray;

        for (var i = 0; i < currEquation.length; i++){
            if (valuesArray[i] === "") {
                for (var j in solutionCells){
                    if (!solutionCells.hasOwnProperty(j)) continue;
                    if (currEquation[i] === j) valuesArray[i] = solutionCells[j];
                }
            }   
        }

        return valuesArray;
    };

    Board.prototype.countNbOfMissingTiles = function(currEquation){

        var count = 0;

        for(var i = 0; i < currEquation.length; i++) {

            if (!this.doesCellContainTile(currEquation[i])) count += 1;
        }

        return count;
    };

    Board.prototype.fetchMoveableTiles = function(){

        var moveableTiles = [],
            grid = this.getGrid();

        for (var cellID in grid) {

            if (!grid.hasOwnProperty(cellID)) continue;

            if (this.doesCellContainTile(cellID)){

                var tile = this.getTileAt(cellID);

                if (tile.canMove()) moveableTiles.push(tile);
            }
        }
        
        return moveableTiles;
    };

    Board.prototype.fetchMoveableTileValues = function(){

        var moveableTileValues = [],
            moveableTiles = this.fetchMoveableTiles();

        for (var i = 0; i < moveableTiles.length; i++) {

            var tile = moveableTiles[i];
            moveableTileValues.push(tile.getValue());
        }
        
        return moveableTileValues;  
    };

// Board - Player Moves
///////////////////////////////////////////////////////////
    
    Board.prototype.playerMove = function(moveString) {

        /*
        moveString format: "logicX1_logicY1,logicX2_logicY2"
        
        cellID where tile we want to move is located: logicX1_logicY1
        cellID of the cell where we want to drop the tile: logicX2_logicY2

        */

        if(this.getGameOver()) return false;

        var moveArray = moveString.split(",");

        if(!this.isMoveArrayValid(moveArray)) return false;

        this.boardLog("refresh");
        this.moveTileToCell(moveArray);
        
        if (DEBUG_MODE) this.log();   
        return this.boardLog("export");
    };

    Board.prototype.useHints = function(){

        if(this.getGameOver()) return false;
        this.boardLog("refresh");
        this.solveOneEquation();
        if (DEBUG_MODE) this.log();   
        return this.boardLog("export");
    };
 
// Board - setters and getters
///////////////////////////////////////////////////////////

    Board.prototype.setWidth = function(gridWidth) {

        if (typeof gridWidth === "number") this.gridWidth = gridWidth;

        return this;
    };

    Board.prototype.getWidth = function() {

        return this.gridWidth;
    };

    Board.prototype.setHeight = function(gridHeight) {

        if (typeof gridHeight === "number") this.gridHeight = gridHeight;

        return this;
    };

    Board.prototype.getHeight = function() {

        return this.gridHeight;
    };

    Board.prototype.setEquationCount = function(equationCount) {

        if (typeof equationCount === "number") this.equationCount = equationCount;

        return this;
    };

    Board.prototype.getEquationCount = function() {

        return this.equationCount;
    }; 

    Board.prototype.getGrid = function() {

        return this.grid;
    };

    Board.prototype.setBoardData = function(boardData){

        this.boardData = boardData;
        return this;
    };
    
    Board.prototype.getBoardData = function(){

        return this.boardData;
    };

    Board.prototype.setBoardSolutionsSheet = function(solutionCells){

        this.boardSolutionsSheet = solutionCells;
        return this;
    };
    
    Board.prototype.getBoardSolutionsSheet = function(){

        return this.boardSolutionsSheet;
    };

    Board.prototype.setCell = function(index, cellData) {

        this.grid[index] = cellData;

        return this;
    };

    Board.prototype.getCell = function(index) {

        return this.grid[index];
    };

    Board.prototype.checkIfCanAccomodate = function(logicX_logicY) {

        return (this.getCell(logicX_logicY).canAccomodate).asInt();
    };

    Board.prototype.checkIfPartOfEquation = function(logicX_logicY) {

        return (this.getCell(logicX_logicY).isPartOfEquation).asInt();
    };

    Board.prototype.setEquationsList = function(equationsList) {

        this.equationsList = equationsList;

        return this;
    };

    Board.prototype.getEquationsList = function() {

        return this.equationsList;
    };

    Board.prototype.setGameOver = function(boolValue) {

        this.gameOver = boolValue;
        return this;
    };

    Board.prototype.getGameOver = function() {

        return this.gameOver;
    };

    Board.prototype.setGameInitialised = function() {

        this.gameInitialised = true;
        if (DEBUG_MODE) this.log();
        return this;
    };

    Board.prototype.getGameInitialised = function() {

        return this.gameInitialised;
    };

// Tile
///////////////////////////////////////////////////////////

    function Tile() {
        this.id = Tile.prototype.currId++; // tile unique id
        this.value = 0; // tile value will store the numbers/arithmetic operator
        this.ghost = false; // feature to test against inexisting tiles using the this.isGhost() function
        this.isMoveable = false; // boolean to know if tile can move
        this.homeCell = ""; // cellID for a moveable tile in a solved board
        this.board = undefined; // the board on which the tile is
    }

    Tile.prototype.loadConfig = function(config) {

        for (var aVal in config)
            if (config.hasOwnProperty(aVal) && typeof this[aVal] !== "undefined") this[aVal] = config[aVal];

        return this;
    };

// Tile - setters and getters
///////////////////////////////////////////////////////////

    Tile.prototype.getValue = function() {

        if (this.ghost) return "";
        return this.value;
    };

    Tile.prototype.getValueWidth = function() {

        if (this.ghost) return 0;
        return ("" + this.getValue()).length;
    };

    Tile.prototype.setValue = function(value) {

        if (typeof value === "number") this.value = value;
        return this;
    };

    Tile.prototype.getBoard = function() {

        return this.board;
    };

    Tile.prototype.setBoard = function(board) {

        this.board = board;

        return this;
    };

    Tile.prototype.getHomeCell = function() {

        return this.homeCell;
    };

    Tile.prototype.setHomeCell = function(cellID) {

        this.homeCell = cellID;
        return this;
    };

    Tile.prototype.isGhost = function() {

        return this.ghost;
    };

    Tile.prototype.setGhost = function() {

        this.ghost = true;
        this.id = -1;

        return this;
    };

    Tile.prototype.getId = function() {

        return this.id;
    };

    Tile.prototype.canMove = function() {

        return this.isMoveable;
    };

    Tile.prototype.setIsMoveable = function() {

        this.isMoveable = true;
        return this;
    };

// public functions & variables
///////////////////////////////////////////////////////////

    function shuffleArray(array) {

        var m = array.length,
            t, i;
        // While there remain elements to shuffle…
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    function shuffleObject (obj){

        var arrKeys = shuffleArray(Object.keys(obj)),
            newObj = {};

        for (var i = 0; i < arrKeys.length; i++){
            
            var currKey = arrKeys[i];
            
            newObj[currKey] = obj[currKey];
        }

        return newObj;
    }

    function emptyArray(arrayToEmpty) {

        if (arrayToEmpty.length !== 0) arrayToEmpty.length = 0;

        return arrayToEmpty;
    }

    function padValue(value, maxWidth) {

        var valueWidth = ("" + value).length;
        var leftPadding = "";
        var rightPadding = "";
        var j = 0;

        if (valueWidth < maxWidth) {

            for (j = 0; j < maxWidth - valueWidth; j++) {

                if (j % 2 === 0) {

                    leftPadding += " ";

                } else {

                    rightPadding += " ";

                }
            }
        }

        return "[ " + leftPadding + value + rightPadding + " ]";
    }

    function stringifyArray(arrayToStringify, delimiter) {

        var returnString = "";

        if (arrayToStringify.length == 0) return returnString;

        for (var i = 0; i < arrayToStringify.length; i++) {

            if (i === arrayToStringify.length - 1) {

                returnString += arrayToStringify[i];

            } else {

                returnString += arrayToStringify[i] + delimiter;

            }
        }
        return returnString;
    }

    function generateRandom(meanValue) {

        // defining the probabilities of our probability distribution table
        var tableProb = [0.5, 0.8, 1];
        var min = 0;
        var max = 0;

        if (meanValue < 2) meanValue = 2;

        // defining the possibilities of our probability distribution table
        var tableOutput = [meanValue - 1, meanValue, meanValue + 1];

        var random = Math.random();

        for (var i = 0; i < tableProb.length; i++) {

            min = 0;
            max = tableProb[i];

            if (i - 1 >= 0) min = tableProb[i - 1];

            if (min < random && random <= max) return tableOutput[i];

        }
    }

    Boolean.prototype.asInt = function(){

        return (this.valueOf()) ? 1 : 0;
    };

    var logicaLoaded = true;
    

// jS debug only -- game automatic launch in browser --
///////////////////////////////////////////////////////////

    var DEBUG_MODE = false; 
    if (DEBUG_MODE) console.log("Logic Loaded");
    /*
    if (DEBUG_MODE) {
        var levelData = {


                        "level_Beginner":           {
                                                "w": 6,
                                                "h": 7,
                                                "d": "L11,L=,L13,E,E,M+,,M=,E,,M7,L5,M=,,E,,M12,E,,L9,L+,L3,E,E,,,L6,,,L=,,,M-,M2,,L17,,,,,,,"
                                                },
                        "level_Easy":           {
                                                "w": 6,
                                                "h": 7,
                                                "d": "M20,E,E,L5,L*,L4,M1,,,E,M=,M18,M=,L9,E,L8,E,E,,E,M=,E,,M*,,L2,,E,,M+,,E,,,M=,M13,,E,,M-,,,"
                                                },
                        "level_Normal":         {
                                                "w": 7,
                                                "h": 8,
                                                "d": "M=,,L12,E,L4,E,E,,M+,M-,M+,,M3,L-,L18,E,E,E,L8,M=,L4,M5,M=,L=,M=,E,M10,E,,M*,L4,E,E,E,L1,,,E,,E,M=,M+,M=,,L6,E,L3,E,E,M3,,,,M-,,,"
                                                },
                        "level_Hard":           {
                                                "w": 7,
                                                "h": 8,
                                                "d": "M=,M=,E,E,E,E,L1,M3,,L+,M19,,M3,E,M10,M=,L5,E,L8,E,E,M=,M+,E,,E,M-,E,E,E,L9,E,E,M*,L4,M2,,M=,,E,M+,,L4,L=,L2,E,E,M4,M=,M-,,,,M-,,,"
                                                },
                        "level_Master":         {
                                                "w": 7,
                                                "h": 8,
                                                "d": "L7,L-,L6,E,E,M3,M10,E,M5,M1,M=,M-,M1,M+,E,M=,L14,E,E,E,E,E,M=,M18,M9,E,M*,E,E,E,E,E,L9,M+,L6,M=,,M=,M=,E,M+,E,L19,E,E,E,E,M3,L1,M-,,M=,,,,,"
                                                },
                        "level_GrandMaster":    {
                                                "w": 9,
                                                "h": 10,
                                                "d": "M+,E,E,E,E,L2,M=,M=,M-,,M+,,E,M-,M=,,,M=,M*,,M7,E,E,L6,E,E,M4,M+,M=,M1,E,,,M7,E,M=,M5,L5,E,L1,E,E,,L6,,,E,,,,E,,E,M-,,E,E,L1,E,E,M2,L12,M4,M=,E,M4,,M=,E,M2,,M=,,E,,L20,E,L5,L*,E,,,M-,,,,,,,,"
                                                }
                        };
        

        window.console.clear();
        var board = (new Board()).initLevelFromPack(levelData.level_Beginner);
        board.boardLog("export");
    }
	*/

// Game Preparation and External Command lines
///////////////////////////////////////////////////////////

    if (typeof(window.playtouch) !== "object") window.playtouch = {};
    playtouch.Board = Board;
  
    /*
                external command lines
        
    
    To initialise a new board at start of the game ----> 
    window.playtouch.gameMain = (new playtouch.Board()).initLevelFromPack(levelData);

    To move tile 2_0 to grid 1_0 ----> 
    playtouch.gameMain.playerMove("2_0,1_0");

    To get x coordinate corresponding to logic X ----> 
    playtouch.gameMain.computeX(logicX, offsetX, gridCellWidth);

    To get y coordinate corresponding to logic Y ----> 
    playtouch.gameMain.computeY(logicY, offsetY, gridCellHeight);
    
    To get gameData for savegames or board updates ---->
    playtouch.gameMain.exportGameData();

    */