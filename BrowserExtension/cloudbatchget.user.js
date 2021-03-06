// ==UserScript==

// @name          CloudBatchGet

// @namespace     PTScript.ptsang.net

// @description   PTScript: get download links and cookies from thunder/QQ cloud.

// @match         http://*.cloud.vip.xunlei.com/*

// @match         http://lixian.qq.com/*

////// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// ==/UserScript==

console.log("gm run");
var $ = jQuery;

var API_BASE = "http://127.0.0.1:8080";

$(function () {
    console.log("ready run, ");
    console.log(document.URL);

    // thunder
    if (document.URL.indexOf("xunlei") != -1) {
        console.log("begin insert link, thunder");
        $('<h2 class="saveside"><a id="batchget_insert" href="#"><em class="ic_sf"></em>InsertDownLink</a></h2>').insertAfter("h2.saveside:last");
        $('<h2 class="saveside"><a id="batchget_changeserver" href="#"><em class="ic_sf"></em>ChangeServer</a></h2>').insertAfter("h2.saveside:last");
    
        $("#batchget_changeserver").click(function (){
                API_BASE = prompt("BatchWget Server", "http://127.0.0.1:8080");
                if ( API_BASE.substr(-1) === "/") 
                    API_BASE = API_BASE.substring(0, API_BASE.lastIndexOf('/'));
        });

        $("#batchget_insert").click(function () {
                console.log("Insert");
                if ($("#rowbox_list").is(":visible")) {
                    console.log("rowbox_list visible");

                    $("div.rwbox div.rw_list").each(function () {
                        icon = $(this).find("img.png");
                        if ($(icon).attr("src").indexOf("bt") == -1) {
                            var tid = $(this).attr("taskid"); 
                            console.log("tid", tid);
                            var btns = $(this).find("div.rwset p:first");
                            $('<a class="rwbtn ic_redownloca batchget" href="#">Down</a>')
                                .click(function () { 
                                    var pardiv = $(this).parents("div.rw_inter");
                                    dl_name = $(pardiv).children('input[id^="durl"]').attr("value");
                                    dl_url = $(pardiv).children('input[id^="dl_url"]').attr("value");
                                    console.log("dl_url", dl_url);
                                    console.log("dl_name", dl_name);
                                    $.get(API_BASE + "/thunder_single_task", 
                                            { name: dl_name, url: dl_url, cookies: document.cookie });
                                }).appendTo(btns);
                        }
                    }); // single files


                    var downall_btn = $('<a style="margin-left: 15px;" class="batchget" href="#">DownAll(Files)</a>')
                        .click(function (){
                            $("div.rwbox_list div.rw_list input[type=checkbox]:checked").each(function () { 
                                var list = $(this).parents("div.rw_list");
                                icon = list.find("img.png");
                                if ($(icon).attr("src").indexOf("bt") == -1) {
                                    dl_name = list.find('input[id^="durl"]').attr("value");
                                    dl_url = list.find('input[id^="dl_url"]').attr("value");
                                    console.log("dl_url", dl_url);
                                    console.log("dl_name", dl_name);
                                    //request_for_download(dl_name, dl_url);
                                    $.get(API_BASE + "/thunder_single_task", 
                                            { name: dl_name, url: dl_url, cookies: document.cookie });
                                }
                            });
                    }).appendTo("div.sellection:visible p");// all single files

                } // insert main view

                if ($("#rwbox_bt_list").is(":visible")) {
                    console.log("rwbox_bt_list visible");

                    // each one
                    $("div#rwbox_bt_list div.rw_list").each(function () { 
                        var btns = $(this).find("div.rwset p:first");
                        $('<a class="rwbtn ic_redownloca batchget" href="#">Down</a>')
                            .click(function () { 
                                var btid  = $(this).parents("div.rw_list").attr('i');
                                dl_name = $('#bt_taskname' + btid).attr("value");
                                dl_url = $('#btdownurl' + btid).attr("value");
                                console.log("dl_url", dl_url);
                                console.log("dl_name", dl_name);
                                $.get(API_BASE + "/thunder_single_task", 
                                        { name: dl_name, url: dl_url, cookies: document.cookie });
                        }).appendTo(btns);
                    });

                    // down all
                    var downall_btn = $('<a style="margin-left: 15px;" href="#">DownAll</a>')
                        .click(function (){
                            //$('input[name="bt_taskname"]').each(function () {
                            $('div.rw_list input[name=bt_list_ck]:checked').each(function () {
                                var list = $(this).parents("div.rw_list");
                                var span = list.find("span.namelink span:first-child");

                                var dl_name = span.attr("title");
                                var dl_url = span.attr("href");
                                console.log("dl_name", dl_name);
                                console.log("dl_url", dl_url);
                                //request_for_download(dl_name, dl_url);
                                $.get(API_BASE + "/thunder_single_task", { name: dl_name, url: dl_url, cookies: document.cookie });
                            });
                    }).appendTo("div.sellection:visible p");

                } // insert bt view

                return false;
            });

    }

    // QQ
    else if (document.URL.indexOf("qq") != -1) {
        console.log("begin insert link, qq");
        $('<a href="#">WgetLink</a>').click(function () { 
            $("td[id^='task_file_']").each(function (){
                $('<a href="#">WgetDown</a>').click(function () {
                    var url= $($(this).prevAll("a[id^=task_normal_down_]")[0]).attr("href");
                    var name = $($(this).prevAll("a[id^=task_dk_lc_]")[0]).attr("filename");
                    console.log(url, name);

                    if (url != "###") {
                        $.get(API_BASE + "/qq_single_task", 
                                { name: name, url: url, cookies: document.cookie });
                    }

                    return false;

                }).appendTo($(this).children("p.p2"));

            });
        }).appendTo($("#task_share_multi").parent());
    }
});

