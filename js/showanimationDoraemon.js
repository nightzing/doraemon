/**
 * Created by liuyubobobo on 14-4-11.
 * my site: http://www.liuyubobobo.com
 */

 //调用按钮文字动画
  $('header .newGameButton').on('click', function() {
    $('.btn-info').removeClass('btn-info');
    $(this).children('.btn-text').addClass('btn-info');
  });
function showNumberWithAnimation( i , j , randNumber ,size){

    getNumberCell(i,j).css({
        backgroundColor : getNumberBackgroundColor( randNumber ),
        color : getNumberColor( randNumber ),
        fontSize : getNumberTextSize(randNumber)
    }).text( getNumberText( randNumber ) ).animate({
        width : size.cellWidth,
        height : size.cellHeight
    },200);
}

function showMoveAnimation( fromx , fromy , tox, toy ,size){
    getNumberCell(fromx,fromy).animate({
        top:getPosTop( tox,toy ,size),
        left:getPosLeft( tox ,toy, size )
    },200);
}

function updateScore( score ){
    $('#score').text( score ).fadeOut(400).fadeIn(200);

}
