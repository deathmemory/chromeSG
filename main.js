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
			var arr = new Array(
					//['孙权','30687',94],
					['甘宁','39648',14],
					//['廖珝','30684',100],
					['徐荣','40279',84],
					['单虎','33212',81],
					['张翼','33662',65],
					['张承','34353',53],
					['鲁甸','35066',42],
					['马忠','36720',27],
					['张嶷','37588',26],
					['昌充','37739',22],
					['钟离牧','37589',13],
					['乐续','40148',13],
					['邹豫','39172',9],
					['师覈','37984',9],
					['荀匡','38400',7]
					);
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
					MM_xmlLoad('build.upgrade&bid=14&k2caa3s=01d4a27716f');		//建筑
					//MM_xmlLoad('resources.detailup&resourceid=14&k029bes=54286b63eb4');		//资源
					//MM_xmlLoad('build.upgrade&bid=51&k029bes=54286b63eb4');			//工厂
					console.log("building finished !");
					//return;	// stop timer
				}
				//MM_xmlLoad('horserace.dayFeed&horseid=8256');

				console.log("tbody toggle, current building count :" + curCount);
				setTimeout("timedCount()", 1000);	// 1203000
			}
			var currentIndex = 0;
			window.pkWuJiang = function(){
//					for (var i=0;i<arr.length;i++)
//					{
				var intr = arr[currentIndex][2] + 2;
				var wjUrl = "index.php?act=battalion.personal_war&city_id=9&target_level="+intr+"&kffae7s=49fed0ec5fe&keep=all&gid="+arr[currentIndex][1]+"&userid=10876&villageid=14662&w6c2u=c24fe54&rand=821022";
				console.log("cidx" + currentIndex + " url:"+ wjUrl);
				$.get(wjUrl, function(data,status){
					var ttt = $(data).find("htmls").find('#dialog').text();
								
								/*.each(function(i,val){
									console.log(i);
									console.log(val);
									console.log(val.textContent);
								}));*/
//								var resData = data;
//								var inzh = resData.indexOf("看不清");
					var strRes = ttt.indexOf("请输入验证码");
					console.log("res "+strRes);
					if ( -1 != strRes )
					{
						alertDialog('battalion.personal_war&city_id=25&target_level='+intr+'&kffae7s=49fed0ec5fe&keep=all&gid='+arr[i][1],'军营武将狼牙将:黄口小儿也来挑战老子！');
					}else{
						currentIndex ++;
						pkWuJiang();
					}
				});
						//alertDialog('battalion.personal_war&city_id=25&target_level='+intr+'&kffae7s=49fed0ec5fe&keep=all&gid='+arr[i][1],'军营武将狼牙将:黄口小儿也来挑战老子！');
//					}
			}
			//添加Button
			var drawButton = function(){	
				var imgobj = $(".subnav");
				imgobj.prepend("<a href=\"javascript:void(0);\" onclick=\"pkWuJiang();\">武将</a>");
				//document.write("<iframe><input type=button value=\"Go Back\"onClick=\"history.back(-1)\" ></iframe>");
				console.log('drawButton done ' + imgobj.length);
			}
			drawButton();
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