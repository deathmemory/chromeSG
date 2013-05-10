// ==UserScript==  
// @name         12306 Booking Assistant
// @version		 1.4.0
// @author       zzdhidden@gmail.com
// @namespace    https://github.com/zzdhidden
// @description  description
// @include      *://dynamic.12306.cn/otsweb/*
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript== 

function withjQuery(callback, safe){
	if (window.location.href != "http://x89.sanguo.renren.com/")
		return;
	if(typeof(jQuery) == "undefined") {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
		//script.src = "http://code.jquery.com/jquery-1.9.1.min.js";
		if(safe) {
			var cb = document.createElement("script");
			cb.type = "text/javascript";
			cb.textContent = "jQuery.noConflict();(" + callback.toString() + ")(jQuery, window);";
			script.addEventListener('load', function() {
				document.head.appendChild(cb);
			});
		}
		else {
			var dollar = undefined;
			if(typeof($) != "undefined") dollar = $;
			script.addEventListener('load', function() {
				jQuery.noConflict();
				$ = dollar;
				callback(jQuery, window);
			});
		}
		document.head.appendChild(script);
	} else {
		setTimeout(function() {
			//Firefox supports
			callback(jQuery, typeof unsafeWindow === "undefined" ? window : unsafeWindow);
		}, 30);
	}
}

var timedCount;
var curCount = 0;
withjQuery(function ($, window)
{
	if (window.location.href == "http://x89.sanguo.renren.com/")
	{
		$(document).ready(function()
		{	
			timedCount = function(){
				//console.log("tbody toggle !");
				var obj = ".building span[act='index.queueinfo']";
				//$(obj).toggle();
				$(obj).css("background-color","red");
				//$("span.timehook").toggle();
				curCount = $(obj).length;
				if ( 0 == curCount )
				{	// work finished .
					//alert("building finished");
					//MM_xmlLoad('build.upgrade&bid=14&k2caa3s=01d4a27716f');		//建筑
					MM_xmlLoad('resources.detailup&resourceid=14&k029bes=54286b63eb4');		//资源
					//MM_xmlLoad('build.upgrade&bid=51&k029bes=54286b63eb4');			//工厂
					console.log("building finished !");
					//return;	// stop timer
				}
				//MM_xmlLoad('horserace.dayFeed&horseid=8256');

				console.log("tbody toggle, current building count :" + curCount);
				setTimeout("timedCount()", 1000);	// 1203000
			}
			console.log("document loaded !");
			$(".chenmi").click(function(){
					console.log("click");
					//if ( 0 == curCount )
						timedCount();
			});
			/*
			$("#nav_js").click(function(){
					console.log("click");
					MM_xmlLoad('build.upgrade&bid=7&k2caa3s=01d4a27716f');
			});
			*/
		})
	}
}, true);
/*
if (window.location.href == "http://x89.sanguo.renren.com/")
{
	
	//alert("test");
	console.log("load dmhelper");
	var rightcontent = document.getElementById("rightcontent");
	console.log("rightcontent length : " + rightcontent.length);
	var elements = indexqueue.getElementsByTagName("span");
	//var len = elements.length;
	console.log("element length : " + document.getElementsByTagName("A")[0].href);
	
	/*
	for (var i = 0; i < elements.length; ++i)
	{
		var a = elements[i];
		a.onclick = function() { return true; };

		// 获取 taskid
		var par = a.parentElement.parentElement.parentElement;
		var id = par.getAttribute("taskid");

		// 填充地址
		var addr = document.getElementById ("dl_url" + id).value;
		a.href = addr;
	}
	
}
*/