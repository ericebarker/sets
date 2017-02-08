// functions for Sets based invader game

//set attributes for invader objects
var possShapes = ["heart", "club", "diamond", "spade"];
var possColors = ["blue", "green", "red"];
var possShading = ["empty", "opaque", "full"];
var possValues = [1, 2, 3];

var eachObject = {s:'',c:'',o:'',v:0,i:''};
var allObjs = [];
var selectedTiles = [];
var score = 0;

function cloneObj(uniqueO) {
    var clone ={};
    for( var key in uniqueO ){
        if(uniqueO.hasOwnProperty(key)) //ensure not adding inherited props
            clone[key]=uniqueO[key];
    }
    return clone;
}

function setObjectAttr (x){
        var y =  Math.floor(Math.random() * 4);
        x.s = possShapes[y];
        y = Math.floor(Math.random() * 3);
        x.c = possColors[y];
        y = Math.floor(Math.random() * 3);
        x.o = possShading[y];
        y = Math.floor(Math.random() * 3);
        x.v = possValues[y];
        x.i = x.v.toString()+x.o+x.c+x.s+'.png';
        
        if (checkDupes(x)){
            allObjs.push(cloneObj(x));    
        }
        else {           
            setObjectAttr(eachObject);
        }
        return x;
}

function checkDupes(d) {
    for (var i=0; i<allObjs.length; i++){
        if (d.i==allObjs[i].i) {return false;}
    }
    return true;
}

function setTile(r) {
    var tile = document.createElement('div');
    $(tile).addClass('tile');    
    for(var i=0; i<r.v; i++){
        var d = document.createElement('span');
        $(d).addClass(r.o);
        $(d).addClass(r.c);
        $(d).addClass(r.s);
        $(tile).append(d);
    }
    return tile;
}

function setBoard(t, r) {
    var board = document.createElement('div');
    $(board).addClass('board');
    var allTiles = [];
    for(var i=0; i<t; i++){
        var thisObj = eachObject;
        thisObj = setObjectAttr(thisObj);
        
        allTiles[i] = setTile(thisObj);
        $(allTiles[i]).addClass('tile_'+(i+1).toString());
        $(board).append(allTiles[i]); 
    }
    $('.main').html(board);
    setBoardRows(r);
}

function setBoardRows(r) {
    var divs = $(".tile");
    for(var i = 0; i < divs.length; i+=r) {
        divs.slice(i, i+r).wrapAll("<div class='row'></div>");
    } 
}


$(document).ready(function(){
setBoard(36, 4);
setMsgBox();
    
$('.tile').on("click", tileClick);
    
    // end doc ready
});

function setMsgBox() {
    var scoreBoard = document.createElement('div');
    var showScore = document.createElement('div');
    var showBox = document.createElement('div');
    var count = document.createElement('span');
    $(scoreBoard).addClass('game-stats');
    $(showBox).addClass('message-box');
    $(showScore).addClass('score');
    $(count).addClass('count');
    $(showScore).html("Score: ");
    $(showScore).append(count);
    $(scoreBoard).append(showScore);
    $(scoreBoard).append(showBox);
    $('.main').prepend(scoreBoard);
}

function displayMsg(m) {
    $('.message-box').html('').show();
    $('.message-box').html(m.toString());
    $('.message-box').fadeOut(2500);
}

function tileClick() {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            $('.show-select-count').html($('.selected').length.toString());
            var index = $(this).attr("class").split("_")[1];
            index = index.split(" ")[0];
            var pullThis = selectedTiles.indexOf(allObjs[index-1]);
            selectedTiles.splice(pullThis, 1);
        }
        else {
            $(this).addClass('selected');
            $('.show-select-count').html($('.selected').length.toString());
            var index = $(this).attr("class").split("_")[1];
            index = index.split(" ")[0];
            selectedTiles.push(allObjs[index-1]);
        }
        
        if (selectedTiles.length == 3){
            if(checkMatch(selectedTiles[0], selectedTiles[1], selectedTiles[2])){
                score++;
                displayMsg('You have found '+score+' matches!');
                $('.count').html(score);
                for (c=0; c<3; c++){
                    replaceTile(selectedTiles[c]);
                }
                resetSelect();
            } else {
                displayMsg('That is not a match!');
                resetSelect();
            }
            
        }
        
    }

function checkMatch(a, b, c){
    var shapeBool = false;
    var colorBool = false;
    var shadeBool = false;
    var valueBool = false;
    //check shape
    if ((a.s!=b.s&&a.s!=c.s)&&(b.s!=c.s)){shapeBool = true;}
    else if (a.s==b.s&&a.s==c.s){shapeBool = true;}
    else {return false;}
    //check color
    if ((a.c!=b.c&&a.c!=c.c)&&(b.c!=c.c)){colorBool = true;}
    else if (a.c==b.c&&a.c==c.c){colorBool = true;}
    else {return false;}
    //check shading
    if ((a.o!=b.o&&a.o!=c.o)&&(b.o!=c.o)){shadeBool = true;}
    else if (a.o==b.o&&a.o==c.o){shadeBool = true;}
    else {return false;}
    //check value
    if ((a.v!=b.v&&a.v!=c.v)&&(b.v!=c.v)){valueBool = true;}
    else if (a.v==b.v&&a.v==c.v){valueBool = true;}
    else {return false;}
    return true;
}

function resetSelect() {
    function timed(){
        $('.selected').removeClass("selected");
        selectedTiles = [];
    }
    setTimeout(timed, 300);    
    $('.tile').unbind("click");
    $('.tile').on("click", tileClick);   
}

function replaceTile(t) {  
    var index=0;    
    for (i=0; i<allObjs.length; i++){
        if (allObjs[i]==t){
            index = allObjs.indexOf(allObjs[i]);
        } 
    }
    var thisObj = {};
    thisObj = setObjectAttr(thisObj);
    allObjs[index] = thisObj;
    allObjs.pop();
    var newTile = setTile(thisObj);
    var tileNum = 'tile_'+(index+1).toString();
    $(newTile).addClass(tileNum);
    tileNum = '.'+tileNum;
    $(tileNum).replaceWith(newTile);   
}
