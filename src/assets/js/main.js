/**
 * Created with IntelliJ IDEA.
 * User: andrew
 * Date: 19/07/13
 * Time: 16:39
 * To change this template use File | Settings | File Templates.
 */
define('main', ['hljs', 'backgroundGlitch', 'webfont'], function(hljs) {
    'use strict';
    hljs.initHighlighting();

    // Prevent font flash by loading afterwards.
    WebFont.load({
        google: {
            families: ['PT Serif', 'PT Sans']
        }
    });
});
