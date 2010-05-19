/**
 * <h1>CDN Manager for BLOBbox</h1>
 *
 * @module cdn
 * @namespace TVB
 * @title CDN Manager
 * @requires tvblob
 * @author Francesco Facconi francesco.facconi@tvblob.com
 * @author Emilio Sabatucci emilio.sabatucci@tvblob.com
 */

/**
 * Object for handling the CDN Manager
 * @class cdn
 * @static
 * @namespace TVB
 */
TVB.cdn = {
    provider: null,
    providerConnector: null
};

/**
 * Returns the rtmp url of a given stream for a given cdnType. If the cdn is not specified the algorithm tries
 * to guess it decoding the url
 * @param {String} fileUrl The url of the stream
 * @param {String} cdnType Optional parameter; is the cdn type name
 * @return {String} The real playback url, null if not available
 */
TVB.cdn.getRtmpUrl = function(fileUrl, cdnType) {
    try {
        if (cdnType === null || cdnType === undefined) {
            TVB.cdn.detectProvider(fileUrl);
        } else {
            TVB.cdn.selectConnector(cdnType);
        }
        if (TVB.cdn.providerConnector !== null) {
            return TVB.cdn.providerConnector.getUrl(fileUrl);
        } else {
            return null;
        }
    } catch (e) {
        TVB.warning("TVB.cdn.getRtmpUrl: " + e.message);
        return null;
    }
};

/**
 * The connector to use could be found by looking the url protocol
 * @param {String} url The url of the stream
 */
TVB.cdn.detectProvider = function(url){
    try {
        switch (url.substr(0, 4)) {
            case "cal:":
                TVB.cdn.provider = "Velocix";
                TVB.cdn.providerConnector = TVB.cdn.velocixConnector;
                break;
            case "htp:":
                break;
            case "lv3:":
                TVB.cdn.provider = "Level3";
                TVB.cdn.providerConnector = TVB.cdn.level3Connector;
                break;
            case "fms:":
                break;
            default:
                break;
        }
    } catch (e) {
        TVB.error("TVB.cdn.detectProvider: " + e.message);
        throw e;
    }
};

/**
 * Selects the connector to use by the given cdn type
 * @param {String} cdnType
 */
TVB.cdn.selectConnector = function(cdnType){
    try {
        switch (cdnType) {
            case "smil":
                TVB.log("Use smil connector");
                TVB.cdn.providerConnector = TVB.cdn.smilConnector;
                break;
            case "xspf":
                TVB.log("Use xspf connector");
                TVB.cdn.providerConnector = TVB.cdn.xspfConnector;
                break;
            case "cal:":
                TVB.cdn.provider = "Velocix";
                TVB.cdn.providerConnector = TVB.cdn.velocixConnector;
                break;
            case "htp:":
                break;
            case "lv3:":
                TVB.cdn.provider = "Level3";
                TVB.cdn.providerConnector = TVB.cdn.level3Connector;
                break;
            case "fms:":
                break;
            default:
                break;
        }
    } catch (e) {
        TVB.error("TVB.cdn.selectConnector: " + e.message);
    }
};

TVB.cdn.velocixConnector = {
    getUrl: function(uri){
        try {
            var url = uri.split("cal:/")[1];
            var req = new HTTPRelay();
            url = "http://" + escape(url) + "?format=xml2";
            TVB.log("GET " + url);
            var res = req.get(url);
            var xml = tvblob.parseXml(res);
            var server = "";
            var file = "";
            var nodeList = xml.getAllChildNodes();
            for (var el in nodeList) {
                if (nodeList[el].getName() == "streamname") {
                    file = nodeList[el].getValue();
                }
                if (nodeList[el].getName() == "rtmpurl") {
                    server = nodeList[el].getValue();
                }
            }
            if (server === "" || file === "") {
                return;
            }
            return server + "/" + file;
        } catch (e) {
            TVB.log(e);
            return null;
        }
    }
};

TVB.cdn.level3Connector = {
    getUrl: function(url){
        try {
        
            var start = url.indexOf("/") + 1;
            var med = url.indexOf("/", start) + 1;
            var end = url.indexOf("/", med);
            
            var serverUrl = "";
            if (end != -1) {
                serverUrl = "rtmp://" + url.substring(start, end);
            } else {
                serverUrl = start === 0 ? "" : "rtmp://" + url.substring(start, med);
            }
            start = url.indexOf("/") + 1;
            med = url.indexOf("/", start) + 1;
            end = url.indexOf("/", med);
            file = start === 0 ? url : url.substring(end + 1, url.length);
            
            /*if (file.indexOf("mp4:") == -1 &&
            (file.indexOf(".mp4") != -1 ||
            file.indexOf(".mov") != -1 ||
            file.indexOf(".mpg") != -1 ||
            file.indexOf(".f4v") != -1 ||
            file.indexOf(".m4v") != -1)) {
                file = "mp4:" + file;
            }*/
            return serverUrl + "/" + file;
        } catch (e) {
            TVB.error(e);
            return null;
        }
    }
};

/*
 <smil>
 <head>
 <meta base="rtmp://fl9.maelstrom.jet-stream.nl:1935/vod/" />
 </head>
 <body>
 <video src="vdoxadmin/ws-tvblob/ratatouille_480p.mov" />
 </body>
 </smil>
 */
TVB.cdn.smilConnector = {
    getUrl: function(url){
        try {
            var req = new HTTPRelay();
            
            var res = req.get(url);
            var xml = tvblob.parseXml(res);
            var server = "";
            var file = "";
            var nodeList = xml.getAllChildNodes();
            for (var el in nodeList) {
            
                if (nodeList[el].getName() == "body") {
                    var sub = nodeList[el].getAllChildNodes();
                    for (var s in sub) {
                        if (sub[s].getName() == "video") {
                            file = sub[s].getAttributeValue("src");
                        }
                    }
                    
                }
                if (nodeList[el].getName() == "head") {
                    var sub = nodeList[el].getAllChildNodes();
                    for (var s in sub) {
                        if (sub[s].getName() == "meta") {
                            server = sub[s].getAttributeValue("base");
                            //TVB.log("Server: " + server);
                        }
                    }
                }
            }
            if (server === "" || file === "") {
                return;
            }
            return server + "/" + file;
        } catch (e) {
            TVB.log(e);
            return null;
        }
    }
};

/*
 <playlist version="1">
 <trackList>
 <track>
 <title/>
 <creator/>
 <location>vdoxadmin/ws-tvblob/ratatouille_480p.mov</location>
 <meta rel="streamer">rtmp://fl9.maelstrom.jet-stream.nl:1935/vod/</meta>
 <meta rel="type">rtmp</meta>
 </track>
 </trackList>
 </playlist>
 */
TVB.cdn.xspfConnector = {
    getUrl: function(url){
        try {
            var req = new HTTPRelay();
            
            var res = req.get(url);
            var xml = tvblob.parseXml(res);
            var server = new Array();
            var file = new Array();
            
            var nodeList = xml.getChildNode("trackList").getAllChildNodes();
            var cont = 0;
            for (var el in nodeList) { //el = track
                if (nodeList[el].getName() == "track") {
                    var sub = nodeList[el].getAllChildNodes();
                    for (var s in sub) {
                    
                        if (sub[s].getName() == "location") {
                            file[cont] = sub[s].getValue();
                        } else if (sub[s].getName() == "meta") {
                            if (sub[s].getAttributeValue("rel") == "streamer") {
                                server[cont] = sub[s].getValue();
                            }
                        }
                    }
                    cont++;
                }
            }
            if (server[0] === "" || file[0] === "") {
                return;
            }
            return server[0] + "/" + file[0];
        } catch (e) {
            TVB.log(e);
            return null;
        }
    }
};
