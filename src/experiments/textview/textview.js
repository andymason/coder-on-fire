/*
    Title: TextView Mobile
*/

$("#button").click(function () {
    $.getJSON("http://viewtext.org/api/text?format=json&url=" + $("#url").val() + "&callback=?",
    function (data) {
        $("#mainArticle").html(data.content);
    });
   
});

$('#themeSwitcher').click(function() {
    $('body').toggleClass('dark');
});

$('#decreaseFont').click(function() {
    var currentSize = parseInt($('body').css('font-size'));
    currentSize--;
    $('body').css('font-size', currentSize + 'px');
});

$('#increaseFont').click(function() {
    var currentSize = parseInt($('body').css('font-size'));
    currentSize++;
    $('body').css('font-size', currentSize + 'px');
});

$('sansSerifFont').click(function() {
    
});
