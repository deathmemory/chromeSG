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
					['孙权','30687',100],
					['甘宁','39648',31],
					['廖珝','30684',100],
					['单虎','33212',100],
					['徐荣','40279',97],
					['张翼','33662',87],
					['张承','34353',76],
					['鲁甸','35066',60],
					['张嶷','37588',58],
					['马忠','36720',54],
					['乐续','40148',31],
					['昌充','37739',30],
					['钟离牧','37589',25], 
					['师覈','37984',24],
					['邹豫','39172',24],
					['荀匡','38400',22],
					['圆月','42472',17],
					['沮圃','41389',10],
					['祖茂','43536',6],
					['路舆','41186',4],
					['柳淮','43537',1]
					);
			timedCount = function(){
				//console.log("tbody toggle !");
				var obj = ".building span[act='index.queueinfo']";
				//$(obj).toggle();
				$(obj).css("background-color","red");
				//$("span.timehook").toggle();
				curCount = $(obj).length;
				if ( 0 == curCount )
				{	//// work finished .
					//alert("building finished");	return;
					//MM_xmlLoad('build.upgrade&bid=12&k2caa3s=01d4a27716f');		//建筑
					MM_xmlLoad('resources.detailup&resourceid=12&k029bes=54286b63eb4');		//资源
					//MM_xmlLoad('build.upgrade&bid=50&k029bes=54286b63eb4');			//工厂
					console.log("building finished !");
				}
				//MM_xmlLoad('horserace.dayFeed&horseid=8256');

				console.log("tbody toggle, current building count :" + curCount);
				setTimeout("timedCount()", 1000);	// 1203000
			}
			var currentIndex = 0;
			window.pkWuJiang = function(){
				var wjSize = arr.length;
				if (currentIndex >= wjSize)
				{
					currentIndex = 0;
					alert("一轮挑战完成");
					return;
				}
				var intr = arr[currentIndex][2] + 2;
				var wjUrl = "index.php?act=battalion.personal_war&city_id=19&target_level="+intr+"&kffae7s=49fed0ec5fe&keep=all&gid="+arr[currentIndex][1]+"&userid=10876&villageid=14662&w6c2u=c24fe54&rand=821022";
				console.log("name: " + arr[currentIndex][0] +"cidx: " + currentIndex + "/"+wjSize+" url:"+ wjUrl);
				var doit = function(){
					$.get(wjUrl, function(data,status){
						var resYZ = $(data).find("htmls").find('#dialog').text();
						var resCD = $(data).find("game").find('locat').text();
						//console.log("resCD:"+resCD);
						if ( -1 != resYZ.indexOf("请输入验证码") )
						{
							alertDialog('battalion.personal_war&city_id=25&target_level='+intr+'&kffae7s=49fed0ec5fe&keep=all&gid='+arr[i][1],'军营武将狼牙将:黄口小儿也来挑战老子！');
						}
						else if ( -1 != resCD.indexOf("解除CD时间") )
						{
							currentIndex = 0;	//不必再向下循环，直接归0重新等待计数就可以
							MM_xmlLoad('battalion.show_map');
						}
						else
						{
							currentIndex ++;
							pkWuJiang();
						}
					});
				}
				if ( arr[currentIndex][2] < 100 )
					doit();
				else{
					console.log(arr[currentIndex][0]+"="+arr[currentIndex][2]+" 不加入挑战");
					currentIndex ++;
						pkWuJiang();
				}
			}
			window.weima = function (){
				var obj = $(".subnav [dm='weima']");
				obj.css("background-color","red");
				obj.text("喂中");
				//循环
				var wmUrl = "http://x89.sanguo.renren.com/index.php?act=horserace.dayFeed&horseid=9113&userid=10876&villageid=14662&w180u=80608b2&rand=569687";
				$.get(wmUrl, function(data, status){
					var bContinue = true;
					var resWM = $(data).find("game").find('locat').text();
					if ( -1 != resWM.indexOf("距离下次操作时间") )
					{
						console.log(resWM);
					}
					else if ( -1 != resWM.indexOf("您的帐户中金币余额不足") )
					{
						obj.text("喂完");
						bContinue = false;
					}
					if ( bContinue )
					{
						console.log("还在喂");
						setTimeout("weima()", 1203000);
					}
					else
						console.log("喂完, 停止计时");
				});
			}	
			//战争预警
			window.warWarnning = function(){
					var bAttacked = false;
					var obj = $(".subnav [dm='yujing']");
					obj.css("background-color","red");
					obj.text("警中");
					MM_xmlLoad('vmanage.status');
					$("tbody tr").each(function(){
						$(this).find(".green").each(function(){
							var text = $(this).attr("onclick");
							if ( -1 != text.indexOf('vmanage') )
							{
								window.vmname = $(this).text();
								return;
							}
						});
						attactedcount = $(this).find("strong").text();
						console.log(window.vmname + "\t\t" + attactedcount);
						if ( ! isNaN(attactedcount) && 0 != attactedcount)
						{//被攻击，开始报警
							bAttacked = true;
							obj.text("被攻击");
							return false;
						}
					});
					if (! bAttacked )
						setTimeout("warWarnning()", 60000);
					else
					{
						var musicurl = "http://down.srworld.net/music/single/P4/eva6.mp3?stdfrom=3%20";
						window.open(musicurl,'','height=600,width=800,scrollbars=yes,status =yes');
					}
			}
			//添加Button
			var drawButton = function(){	
				var imgobj = $(".subnav");
				imgobj.prepend("<a dm=\"weima\" href=\"javascript:void(0);\" onclick=\"weima();\">喂马</a>");
				imgobj.prepend("<a href=\"javascript:void(0);\" onclick=\"pkWuJiang();\">武将</a>");
				imgobj.prepend("<a dm=\"yujing\" id=\"div2\" href=\"javascript:void(0);\" onclick=\"warWarnning();\">预警</a>");
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

