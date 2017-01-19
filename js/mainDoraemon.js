/**
 * update by xiaobo on 2016-4-11.
 *
 */

var board = new Array();
var score = 0;
var hasConflicted = new Array();
var size = {};
var container;
var player;

$(document).ready(function(){
  // prepareForMobile();
  // newgame();


    if(isDesktop()){
        newGame();
    }else{
        //针对移动端进行加载
        //deviceready事件需要引入cordova.js
        document.addEventListener("deviceready", newGame, false);
    }

});
// function  prepareForMobile() {
//   $('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
//   $('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
//   $('#grid-container').css('padding',cellSpace);
//   $('#grid-container').css('border-radius', 0.02*gridContainerWidth);
//
//   $('.grid-cell').css('width', cellSideLength );
//   $('.grid-cell').css('height', cellSideLength );
//   $('.grid-cell').css('border-radius', 0.02*cellSideLength );
// }
function newGame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

//调用按钮文字动画
 $('header .newGameButton div').on('click', function() {
   $('.btn-info').removeClass('btn-info');
   $(this).addClass('btn-info');
 });

function init(){

    //获取棋盘布局信息
    getLayerInfo();
    //设置全局字体大小
    setFontSize(size);
    //修正header;
    fixeHeaderLayer(size);
    //创建格子
    createBoard(size);

    //初始化数据
    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    //更新视图
    updateBoardView();

    score = 0;

    $('#score').text( score );

    addEvent();

    player = music();
}

//获取棋盘的宽高信息
function getLayerInfo(){
    var _height = window.innerHeight || 500,
        _width  = window.innerWidth  || 500,

        board_width = Math.floor(Math.min(_width,_height)),
        board_height = Math.floor(_height * 0.7),
        //单个格子的最大宽度
        max_cell_width = board_width / 4,
        max_cell_height = board_height / 4,
        //取格子宽度的10%作间隔
        cell_blank_left = Math.round(max_cell_width * 0.1),
        cell_blank_top = Math.round(max_cell_height * 0.1),

        // 棋盘宽度 = 格子宽 * 4 + 间距 * 5
        cell_width = Math.round((board_width - 5 * cell_blank_left) / 4),
        cell_height = Math.round((board_height - 5 * cell_blank_top) / 4);

    size = {
        bodyWidth   : _width,
        bodyHeight  : _height,
        boardWidth  : board_width,
        boardHeight : board_height,
        paddingLeft : cell_blank_left,
        paddingTop  : cell_blank_top,
        cellWidth   : cell_width,
        cellHeight  : cell_height
    };
}


//创建棋盘
function createBoard(size){
    var cell,frame = $('<div></div>');

    //缓存父容器的引用
    $container = container || $('#grid-container');

    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){
            cell  = setGridCell(i,j);
            cell.css({
                width : size.cellWidth,
                height : size.cellHeight,
                left : getPosLeft(i,j,size),
                top : getPosTop(i,j,size)
            })
            frame.append(cell);
        }
    }

    $container.html(frame.html()).css({
        width : size.boardWidth,
        height: size.boardHeight,
        fontSize : size.fontSize
    });

}

//更新界面
function updateBoardView(){
    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){

            var theNumberCell = setNumberCell(i,j);

            if( board[i][j] == 0 ){
                theNumberCell.css({
                    width : 0,
                    height : 0,
                    top : getPosTop(i,j,size),
                    left : getPosLeft(i,j,size),
                    lineHeight : size.cellHeight+'px'
                })
            }else{
                theNumberCell.css({
                    width : size.cellWidth,
                    height: size.cellHeight,
                    lineHeight : size.cellHeight+'px',
                    top : getPosTop(i,j,size),
                    left : getPosLeft(i,j,size),
                    color : getNumberColor( board[i][j] ),
                    backgroundColor : getNumberBackgroundColor(board[i][j]),
                    fontSize : getNumberTextSize(board[i][j])
                }).text( getNumberText( board[i][j] ) );
            }

            $container.append(theNumberCell);
            hasConflicted[i][j] = false;
        }
    }
}

//生成一个随机数
function generateOneNumber(){
    var randx,randy,times=0,pos,randNumber;

    if( nospace( board ) )
        return false;

    //随机一个位置
    randx = getRandomNum();
    randy = getRandomNum();

    while( times < 50 ){
        if( board[randx][randy] == 0 ){
            break;
        }

        randx = getRandomNum();
        randy = getRandomNum();

        times ++;
    }

    //随机超时，手动指派空位
    if( times == 50 ){
        pos = setPosition(board);
        randx = pos[0];
        randy = pos[1];
    }

    //随机一个数字
    randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber ,size);
}

function addEvent(){
    var element = $container[0];
    //监听滑动操作
    var mc = Hammer(element,{
        swipeVelocityX: 0.1,
        swipeVelocityY: 0.1
    });

    mc.on("swipeleft", moveLeft);
    mc.on("swiperight", moveRight);
    mc.on("swipeup", moveUp);
    mc.on("swipedown", moveDown);

    //监听键盘操作
    $(document).keydown( function( event ){
        switch( event.keyCode ){
            case 37: //left
                moveLeft();
                break;
            case 38: //up
                moveUp();
                break;
            case 39: //right
                moveRight();
                break;
            case 40: //down
                moveDown();
                break;
            default: //default
                break;
        }
    });
}

function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover($container);
    }
}

function next () {

    setTimeout(function(){
        updateBoardView();
    },200);

    setTimeout(function() {
        generateOneNumber();
    },210);

    setTimeout(function(){
        isgameover();
    },300);
}

/**
 *移动格子
 * @param array a1
 * @param array a2
 * @param array b1
 */
function move(a1,a2,b1,s1,noBlock){
    //导入全局变量
    b1.push(board);
    s1.push(size);
    if( board[a1[0]][a1[1]] == 0 && noBlock.apply(this,b1) ){
        //move
        showMoveAnimation.apply(this,s1);
        board[a1[0]][a1[1]] = board[a2[0]][a2[1]];
        board[a2[0]][a2[1]] = 0;
    }
    else if( board[a1[0]][a1[1]] == board[a2[0]][a2[1]] && noBlock.apply(this,b1) && !hasConflicted[a1[0]][a1[1]] ){
        //move
        showMoveAnimation.apply(this,s1);
        //add
        board[a1[0]][a1[1]] += board[a2[0]][a2[1]];
        board[a2[0]][a2[1]] = 0;
        //add score
        score += board[a1[0]][a1[1]];
        updateScore( score );
        //To test whether the last time have stack
        hasConflicted[a1[0]][a1[1]] = true;
        player();
    }

}

function moveLeft(){

    if( !canMoveLeft( board ) ){
        return false;
    }

    //moveLeft
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < j ; k ++ ){
                    move([i,k],[i,j],[i , k , j],[i , j , i , k],noBlockHorizontal)
                }
            }
        }
    }

    next();
}

function moveRight(){
    if( !canMoveRight( board ) ){
        return false;
    }

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){
                    move([i,k],[i,j],[i , k , j],[i , j , i , k],noBlockHorizontal);
                }
            }
        }
    }

    next();
}

function moveUp(){

    if( !canMoveUp( board ) ){
        return false;
    }

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){
                    move([k,j],[i,j],[j , k , i],[i , j , k , j],noBlockVertical)
                }
            }
        }
    }

    next();
}

function moveDown(){
    if( !canMoveDown( board ) ){
        return false;
    }

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){
                    move([k,j],[i,j],[j , i , k],[i , j , k , j],noBlockVertical)
                }
            }
        }
    }

    next();
}
