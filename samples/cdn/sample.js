function init() {

    TVB.remoteInit();
    TVB.remote.disableNav();
    /*TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.BACK);
     TVB.CustomEvent.subscribeEvent(TVB.remote.button.BACK, function(){TVB.player.stop()});
     TVB.remote.disableNav();
     */

    /*var url = TVB.cdn.getRtmpUrl("lv3:/newdealfs.fplive.net/newdeal/district9.mp4");
     TVB.log(url);
     document.getElementById("lv3").innerHTML = url;
     
     
     url = TVB.cdn.getRtmpUrl("cal:/flash.velocix.com/c194/gene_pivi003_mousemen.mp4");
     TVB.log(url);
     document.getElementById("cal").innerHTML = url;
     
     
     url = TVB.cdn.getRtmpUrl("http://vdox1.test.jet-stream.nl/daemon/rediraptor.php?account=ws-tvblob&file=ratatouille_480p.mov&type=streaming&service=wowza&protocol=rtmp&port=1935&output=smil", "smil");
     TVB.log(url);
     document.getElementById("smil").innerHTML = url;
     
     
     url = TVB.cdn.getRtmpUrl("http://vdox1.test.jet-stream.nl/daemon/rediraptor.php?account=ws-tvblob&file=ratatouille_480p.mov&type=streaming&service=wowza&protocol=rtmp&port=1935&output=xspf&playlist=xml", "xspf");
     TVB.log(url);
     document.getElementById("xspf").innerHTML = url;*/
}




function playContent(uid) {
    try {
    	document.getElementById(uid).blur();
        TVB.player.init({
            uri: null,
            switchKey: null,
            autoplay: true,
            fullscreen: true,
            noLittleHole: false,
            disableRemote: false

        });
        
        var url = document.getElementById(uid).innerHTML;
        TVB.player.setContent(url);
        TVB.player.play();
        
        TVB.log("play");
        TVB.CustomEvent.unsubscribeEvent(TVB.remote.button.STOP);
        TVB.CustomEvent.subscribeEvent(TVB.remote.button.STOP, destroyPlayer);
    } catch (e) {
        TVB.log(e);
    }


}

function destroyPlayer() {
    TVB.player.destroy();
    TVB.remoteInit();
}