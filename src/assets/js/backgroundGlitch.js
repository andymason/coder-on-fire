/**
 * Created with JetBrains WebStorm.
 * User: andrew
 * Date: 30/07/13
 * Time: 18:29
 * To change this template use File | Settings | File Templates.
 */
define('backgroundGlitch', function() {
    'use strict';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', '300');
    canvas.setAttribute('height', '300');

    var tmpUrl = null;
    var timeoutID = null;

    var ctx = canvas.getContext('2d');
    var imgSrc = '/assets/images/gottfried.jpg';
    var imgElm = new Image();
    imgElm.addEventListener('load', imageLoaded, false);
    imgElm.setAttribute('src', imgSrc);

    var glitchAmount = 0.2;
    var glitchStartPos = 0.3;

    function imageLoaded(e) {
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
        tmpUrl = canvas.toDataURL('image/jpeg');
        //timeoutID = setInterval(corrupt, 2*400);
    }

    function corrupt() {
        var FILE_HEADER = 200;
        var EOI_LENGTH = 10;

        var startPos = FILE_HEADER + Math.round((tmpUrl.length-EOI_LENGTH) * glitchStartPos);
        var errorByteCount = Math.floor(60 * glitchAmount);
        var sectionsLength = (tmpUrl.length - (startPos + EOI_LENGTH)) / errorByteCount;
        sectionsLength = Math.floor(sectionsLength - 10 * Math.random());

        for (var i = 0; i < errorByteCount; i++) {
            var pos = startPos + (sectionsLength * i);
            tmpUrl = tmpUrl.substr(0, pos - 1) + '0' + tmpUrl.substr(pos);
        }

        document.querySelector('body').style.backgroundImage = 'url(' + tmpUrl + ')';
    }
});
