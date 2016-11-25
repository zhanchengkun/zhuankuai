function isWeiXin(){ 
var ua = window.navigator.userAgent.toLowerCase(); 
if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
return true; 
}else{ 
return false; 
} 
}
/*  微信登录
if (isWeiXin()) {
    window.location.href = "http://cxc0912.hbcnhls.com/index.html";
}
*/

/* 基于ajax请求的同步引用其他js
*/
function GetHttpRequest() {
    if (window.XMLHttpRequest) // Gecko
        return new XMLHttpRequest();
    else if (window.ActiveXObject) // IE
        return new ActiveXObject("MsXml2.XmlHttp");
}

function ajaxPage(sId, url) {
    var oXmlHttp = GetHttpRequest();
    oXmlHttp.onreadystatechange = function () {
        if (oXmlHttp.readyState == 4) {
            includeJS(sId, url, oXmlHttp.responseText);
        }
    }
    oXmlHttp.open('GET', url, false);//同步操作
    oXmlHttp.send(null);
}


function includeJS(sId, fileUrl, source) {
    if ((source != null) && (!document.getElementById(sId))) {
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.id = sId;
        oScript.text = source;
        oHead.appendChild(oScript);
    }
}
if (GameName == 'youxizhongxin') {
    ajaxPage("scrview", "/Content/plugins/weui/dist/example/zepto.min.js");
} else {
    ajaxPage("scrview", "/Content/plugins/weui/dist/example/zepto.min.js");
}
//time 单位天
function cookie(name, value, time) {
    if (name) {
        if (value) {
            if (time) {
                var date = new Date();

                date.setTime(date.getTime() + 864e5 * time),
                time = date.toGMTString();

            }
            return document.cookie = name + "=" + escape(toStr(value)) + (time ? "; expires=" + time + (arguments[3] ? "; domain=" + arguments[3] + (arguments[4] ? "; path=" + arguments[4] + (arguments[5] ? "; secure" : "") : "") : "") : ""), !0;
        }
        return value = document.cookie.match("(?:^|;)\\s*" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)"), value = value && "string" == typeof value[1] ? unescape(value[1]) : !1, (/^(\{|\[).+\}|\]$/.test(value) || /^[0-9]+$/g.test(value)) && eval("value=" + value), value;
    }
    var data = {};
    value = document.cookie.replace(/\s/g, "").split(";");
    for (var i = 0; value.length > i; i++) name = value[i].split("="), name[1] && (data[name[0]] = unescape(name[1]));
    return data;
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}




if (sharedomain.length >= 1 && sharedomain != window.location.host) {

    if (window.location.href.indexOf("?") >= 0) {

        shareurl = window.location.href.replace(window.location.host, sharedomain) + "&directto=" + encodeURI(window.location.host);
    } else {

        shareurl = window.location.href.replace(window.location.host, sharedomain) + "?directto=" + encodeURI(window.location.host);
    }
}








 
var urlDomain = ""; //自动更换的域名
//var PaymentUrl = "http://zbkjpay.91wzs.com/example/payauth.aspx?total_fee=20";
var sharetitle = ""; // 分享标题
var sharedesc = ""; // 分享描述window.location='../index.html?ti='+Q.ti+'&fens='+Q.fens+'&gailv='+gailv;
var sharelink = "";// 分享链接
var shareimgUrl = ""; // 分享图标
var isRedict = false;
var CNZZID = "";
var CNZZWebID = "";

//如果URL中带有directto的参数，则之间诶跳转至那个域名
 
var directto = GetQueryString("directto");
if (directto != null && directto.length >= 1) {
    var newdirctURL = window.location.href.replace(window.location.host, decodeURI(directto)).replace(/directto/g, "enddirectto");
    window.location.href = newdirctURL;
    returns;
}

 
try {

    $.ajax({
        type: "GET",
        //url: "http://localhost:16560/Games/Kaisuo/GetKSUserInfo", //跨域URL
        //url: "http://101.200.144.38:81/Games/Kaisuo/GetKSUserInfo", //跨域URL
        url: "http://admin.91wzs.com/Games/Kaisuo/GetKSUserInfo", //跨域URL
        data: {
            "host": window.location.host,
            "url": window.location.href,
            "refer": window.location.origin
        },
        cache: false,
        async: false,
        dataType: "json",
        success: function (result) {
            CNZZID = result.CNZZID;
            CNZZWebID = result.CNZZWebID;
            //   alert(result.URL);
            if (result.URL == "" || result.URL == null) {
                //是否自动跳转
                
                if (autoPaymentDirect == 1) {
                    //如果是支付成功的人  跳转到一个公用的新域名 或者是状态为2的域名上
                    //debugger;
                    var scc = GetQueryString("scc");
                    var cookiescc = cookie("cookiescc");
                   
                    if (redictDomain != window.location.host) {
                        //alert(scc);
                        // alert(cookiescc);
                        if (scc == '1' || cookiescc == '1') {
                            //加cookie
                            cookie("cookiescc", 1, 30)
                            //所有已经支付的人转到一个固定的URL上
                            //1.hyz6.51zhaigo.com
                            var dirctURL = window.location.href.replace(window.location.host, redictDomain);

                            dirctURL = dirctURL.replace('scc=1', 'end=1');//随便替换一个参数 以免在新的域名下 认为是支付了
                            //跳转走
                            window.location.href = dirctURL;
                        }
                    } else {//等于当前跳转的域名 也要把Scc拿掉

                        var dirctURL = window.location.href;
                        if (dirctURL.indexOf('scc=1') >= 0) {
                            dirctURL = dirctURL.replace('scc=1', 'end=1');//随便替换一个参数 以免分享出去认为是支付了
                            //跳转走
                            window.location.href = dirctURL;
                        }
                    }
                }
                //不跳转
            } else {
                var currentURL = window.location.href.replace(window.location.host, result.URL);
                window.location.href = currentURL;
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown); // 调用本次AJAX请求时传递的options参数

        }
    });


} catch (e)
{
    alert(e);
 //should be send SMS.....
}





////自动更换域名逻辑
//
//if (urlDomain != "" && urlDomain != window.location.host)
//{
//    isRedict = true;
//    currentURL = currentURL.replace(window.location.host, urlDomain);

//}
 
////alert(new Date().Format('yyyyMMddHHmmss'));
//var parmtimeid = GetQueryString("timeid");//参数里的timeid

////alert(parmtimeid);
//var currenttimeid = parmtimeid;
//var timeidCookie = toStr(cookie(GameName));

// //alert('url time:'+parmtimeid);
// //alert('cookie time:' + timeidCookie);
//if (parmtimeid !=null && parmtimeid.toString().length>1) {
//    //如果cookie 存在，则表示是自己进来的 或者已经进来过。
//    if ((timeidCookie == false || timeidCookie.indexOf(parmtimeid + ',') < 0) && currentURL.indexOf("from=timeline") >= 0)
//    {
//        //todo 记录log 如果已经记录过就不用在记录了
//        cookie(GameName, timeidCookie+parmtimeid + ",", 100);
//         //alert('log');
//        //alert('log save:'+toStr(cookie(GameName)));

//    }
 


//    //alert(new Date().Format('yyyyMMddHHmmss') - parmtimeid);
//    if (new Date().Format('yyyyMMddHHmmss') - parmtimeid > 3000)//时间过期 重新给一个时间戳
//    {
//        isRedict = true;
//        currenttimeid = new Date().Format('yyyyMMddHHmmss');
//        currentURL = currentURL.replace(parmtimeid, currenttimeid);
//    }

//} else { 
//    if (currentURL.indexOf("?") < 0) {
//        currenttimeid = new Date().Format('yyyyMMddHHmmss');
//        isRedict = true;
//        currentURL = currentURL + "?timeid=" + currenttimeid
//    } else {
//        currenttimeid = new Date().Format('yyyyMMddHHmmss');
//        isRedict = true;
//        currentURL = currentURL + "&timeid=" + currenttimeid
//    }
//}
//if (isRedict) {
//    //add cookie timeid
//    timeidCookie = toStr(cookie(GameName));
//    cookie(GameName, timeidCookie + currenttimeid + ",", 100);
//    window.location.href = currentURL;
//}


 
//声明_czc对象:
var _czc = _czc || [];
//绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
_czc.push(["_setAccount", CNZZWebID]);
_czc.push(['_trackEvent', '游戏访问量', GameName, '浏览次数', '1', '7']);

function toStr(obj) {
    if (typeof obj == 'object') {
        return JSON.stringify(obj);
    } else {
        return obj;
    }
    return '';
}




var dsDIV = " <div id=\"divuserds\" style=\"display:none; position:absolute;left:0px;top:0px; margin:auto; width:100%;height:100%;opacity: 1;  z-index:99999999;\">";
dsDIV += " <div style=\"position:relative;width:80%; color:#faca9f; background-color:#e1544a; text-align:center; margin:auto; margin-top:5%;-moz-border-radius: 15px;   -webkit-border-radius: 15px; border-radius:15px;  \">";
dsDIV += "  <span onclick=\"hidenDIVds()\" style=\"text-align:right;float:right;margin-right:15px;margin-top:10px;\">X</span>  ";
dsDIV += "   <br><br>";
dsDIV += "    <span style=\"font-size:30px;\">游戏打赏</span>";
dsDIV += "   <br /><br><br>";
dsDIV += "  <a onclick=\"_czc.push(['_trackEvent', 'all', 'ds', 'click', '1', '7']);\" href=\"" + paymenturl + "/example/payment.aspx?total_fee=22&type=88\" style='text-decoration:none;'> <div style=\" color:black; padding-top:35px; font-size:36px; -moz-border-radius: 50%; background-color:#dcbc83; text-align:center;vertical-align:central; width:120px;height:85px;margin:auto;  -webkit-border-radius: 50%; border-radius:50%; border:1px solid #f8be89; \">";
dsDIV += "   打赏";
dsDIV += "   </div></a>";
dsDIV += "   <br>";
dsDIV += "   <span onclick=\"hidenDIVds()\">果断拒绝>></span>";
dsDIV += "   <br>";
dsDIV += "   <br><br>";
dsDIV += "   <span id=\"divtimer\" style=\"font-size:18px; color:#ccc;\">(10)秒后自动关闭打赏按钮..</span>";
dsDIV += "   <br><br>";
dsDIV += " </div>";
dsDIV += "</div>";



dsDIV += " <div id=\"divuserds2\" style=\"display:none; position:absolute;left:0px;top:0px;background-color:#000; margin:auto; width:100%;height:100%;opacity: 0.8;  z-index:99999998;\">";
 
dsDIV += "</div>";


document.write(dsDIV);
var sjns = 10, sjnt;
function sjntimes() {
    sjns--;
    document.getElementById("divtimer").innerText = "(" + sjns + ")秒后自动关闭打赏按钮..";
    sjnt = setTimeout('sjntimes();', 1000);
    if (sjns <= 0) {
        sjns = 10;
        clearTimeout(sjnt);
        hidenDIVds();
    }
}


function hidenDIVds() {

    document.getElementById("divuserds").style.display = "none";
    document.getElementById("divuserds2").style.display = "none";
}
function showDIVds() {
    if (GameName) {

        var cookename = 'isFirst' + GameName;
        var bast = cookie(cookename);

        console.log("bast:" + cookename);
        if (bast == '3') {//第4次以后就不弹了

        }
        else if (bast == '2') {//第3次  15%概率
            var rund = Math.random();
            if (rund <= 0.15) {
                _czc.push(['_trackEvent', 'all', 'ds', 'dsshow3', '1', '7']);
                document.getElementById("divuserds").style.display = "block";
                document.getElementById("divuserds2").style.display = "block";
                clearTimeout(sjnt);
                sjntimes();
                cookie(cookename, 3, 1);
            }

        } else if (bast == '1') { //第2次  40%概率
            var rund = Math.random();
            if (rund <= 0.4) {
                _czc.push(['_trackEvent', 'all', 'ds', 'dsshow2', '1', '7']);
                document.getElementById("divuserds").style.display = "block";
                document.getElementById("divuserds2").style.display = "block";
                clearTimeout(sjnt);
                sjntimes();
                cookie(cookename, 2, 1);
            }
        } else { //第一次  不弹

            cookie(cookename, 1, 1);
        }

    } else {
        alert(GameName);
    }
}
 

