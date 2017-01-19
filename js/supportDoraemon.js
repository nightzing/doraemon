/**
 * Created by liuyubobobo on 14-4-11.
 * my site: http://www.liuyubobobo.com
 */
documentWitch = window.screen.availWidth;
gridContainerWidth = 0.92*documentWidth;
cellSideLength = 0.18*documentWidth;
cellSpace = 0.04*documentWidth;
function getPosTop( i ,j, size){
    var top = size.paddingTop;
    var height = size.cellHeight + top;
    return top + i*height;
}

function getPosLeft( i , j,size ){
    var left = size.paddingLeft;
    var width = size.cellWidth + left;
    return left + j*width;
}

设置字号
function setFontSize(size){
    var width = size.boardWidth;
    if(width < 320){
        size.fontSize = '5px';
    }else if(width > 320 && width < 800){
        size.fontSize = '10px';
    }else{
        size.fontSize = '20px';
    }

}

function getNumberBackgroundColor( number ){
    switch( number ){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }

    return "black";
}

function getNumberColor( number ){
    if( number <= 4 )
        return "#776e65";

    return "white";
}

//生成单元格
function setGridCell(i,j){
    return $('<div class="grid-cell" id="grid-cell-'+i+'-'+j+'"></div>');
}
//获取单元格
function getGridCell(i,j){
    return $('#grid-cell-'+i+"-"+j);
}

//生成数字块
function setNumberCell(i,j){
    return $('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
}

//获取数字块
function getNumberCell(i,j){
    return $('#number-cell-' + i + "-" + j );
}

function getNumberText( number ){
    switch( number ){
      case 2:return "小夫";break;
      case 4:return "胖虎";break;
      case 8:return "大雄爸";break;
      case 16:return "大雄妈";break;
      case 32:return "静香";break;
      case 64:return "出木彬";break;
      case 128:return "大雄老师";break;
      case 256:return "神成先生";break;
      case 512:return "哆啦美";break;
      case 1024:return "大雄";break;
      case 2048:return "哆啦a梦";break;
      case 4096:return "#a6c";break;
      case 8192:return "#93c";break;
    }

    return "black";
}

//修正字号
function getNumberTextSize(number){
    var str = getNumberText(number);

    switch(str.length){
        case 1 : return '3em';
        case 2 : return '2em';
        case 3 : return '1em';
        default: return 'xx-small';
    }
}

//生成一个0到4之间的随机数
function getRandomNum () {
    return Math.floor( Math.random()  * 4 )
}

//手动找出空闲位置
function setPosition (board) {
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            if( board[i][j] == 0 ){
                return [i,j];
            }
        }
}

function nospace( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ )
            if( board[i][j] == 0 )
                return false;

    return true;
}

function canMoveLeft( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1; j < 4 ; j ++ )
            if( board[i][j] != 0 )
                if( board[i][j-1] == 0 || board[i][j-1] == board[i][j] )
                    return true;

    return false;
}

function canMoveRight( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2; j >= 0 ; j -- )
            if( board[i][j] != 0 )
                if( board[i][j+1] == 0 || board[i][j+1] == board[i][j] )
                    return true;

    return false;
}

function canMoveUp( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( board[i][j] != 0 )
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] )
                    return true;

    return false;
}

function canMoveDown( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
            if( board[i][j] != 0 )
                if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] )
                    return true;

    return false;
}

function noBlockHorizontal( row , col1 , col2 , board ){
    for( var i = col1 + 1 ; i < col2 ; i ++ )
        if( board[row][i] != 0 )
            return false;
    return true;
}

function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}

function nomove( board ){
    if( canMoveLeft( board ) ||
        canMoveRight( board ) ||
        canMoveUp( board ) ||
        canMoveDown( board ) )
        return false;

    return true;
}


function gameover($container){
    var cover = $('<div id="over"></div>');
    cover.html('<p><span>游戏结束!!</span><br/><a class="newGameButton" href="javascript:newGame();">replay</a></p>');

    $container.append(cover);

    cover.on('click',function(e){
        $(this).remove();
    })
}

//修正header的布局
function fixeHeaderLayer(size){
    var header = $('.header'),
        header_height = size.bodyHeight * 0.25,
        per_height = Math.floor(header_height / 3),
        style = {
        height : per_height,
        lineHeight : per_height+'px'
    }

    header.css('height',header_height);
    header.children().each(function(i,ele){
        $(ele).css(style)
    })
}

//音频
function music(){
    var url = 'Doraemon.mp3',
        media = new Audio(url);
    return function(){
        return media.play();
    }
}

function isDesktop(){

    var isDesktop = true,
        href = window.location.href;

    if (/^file/.test(href)) {
        //window PC上调试
        if (/^file:\/\/\/\D?:/.test(href)) {

        } else if (/^file:\/\/localhost/.test(href)) {
            //ios pc调试
        } else {
             //真机上
            isDesktop = false;
        }
    }

    return isDesktop;

}
