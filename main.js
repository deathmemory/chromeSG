// ==UserScript==
// @name: 		sanguofengyun2 helper
// @version:	v1.2
// @author:		DeathMemory
// @email:		DeathMemory@163.com
// @update:		2013/07/03
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

var autoBuild;
var curCount = 0;

withjQuery(function ($, window)
{
	if (window.location.href == "http://x89.sanguo.renren.com/")
	{
		$(document).ready(function()
		{
			//喂马Url
			window.weimaUrl = "http://x89.sanguo.renren.com/index.php?act=horserace.dayFeed&horseid=9354&userid=10876&villageid=14662&w7e1u=e10f24f&rand=203983";
			//押镖 horseid
			window.horseid = 9354;
			//自动建筑
			window.bdtype = 0;	// 0 建筑 1 资源 2 工厂
			window.bdid = 8;	// 对应修建的 Id

			var arr = new Array();
			autoBuild = function(){
				//console.log("tbody toggle !");
				var obj = ".building span[act='index.queueinfo']";
				//$(obj).toggle();
				$(obj).css("background-color","red");
				//$("span.timehook").toggle();
				curCount = $(obj).length;
				if ( 0 == curCount )
				{	//// work finished .
					//alert("building finished");	return;
					if (0 == window.bdtype)
						MM_xmlLoad('build.upgrade&bid='+window.bdid+'&k2caa3s=01d4a27716f');					//建筑
					else if (1 == window.bdtype)
						MM_xmlLoad('resources.detailup&resourceid='+window.bdid+'&k029bes=54286b63eb4');		//资源
					else if (2 == window.bdtype)
						MM_xmlLoad('build.upgrade&bid='+window.bdid+'&k029bes=54286b63eb4');					//工厂
					console.log("building finished !");
				}
				console.log("tbody toggle, current building count :" + curCount);
				setTimeout("autoBuild()", 1000);	// 1203000
			}
			window.doTimefunc = function(){
				var mydate = new Date();
				var hour = mydate.getHours();
				var minute = mydate.getMinutes();
				var second = mydate.getSeconds();
				console.log("h:"+mydate.getHours()+"m:"+mydate.getMinutes()+"s:"+mydate.getSeconds());
				if (hour == 5 && minute == 7 && second == 59){
					MM_xmlLoad('hermithouse.backall&_uintgid=4246141&_uintvid=16832');
					console.log("do the job!");
					return;
				}
				setTimeout("window.doTimefunc()", 1000);
			}
			window.doTimefunc();
			var currentIndex = 0;
			window.getWuJiang = function(){
				MM_xmlLoad('general.detail&itemcate=equip');
				console.log($("#general_name_list li").size());
				var wjIdx = 0;
				$("#general_name_list li").not("#focus_exception").each(function(wjIdx){
					var cellidx = 0;
					var clkval = $(this).find("a"[0]).attr("onclick");
					clkval = clkval.substring(clkval.indexOf("&gid=")+5,clkval.indexOf("&no_glist"));
					arr[wjIdx] = new Array();
					arr[wjIdx][cellidx] = clkval;
					console.log(clkval + " => " + cellidx);
					$(this).find("span").each(function(cellidx){
						cellidx++;
						arr[wjIdx][cellidx] = $(this).text();
						console.log(arr[wjIdx][cellidx] + " => " + cellidx);
					});
					wjIdx++;
				});
				if ( 0 == arr.length ){
					setTimeout("window.getWuJiang()", 1000);
				}else{
					for(var num = 0; num < arr.length; ++num){
						console.log("gid:" + arr[num][0] + " name:" + arr[num][1] + " level:" + arr[num][2]);
					}
				}
			}
			window.pkWuJiang = function(){
				var wjSize = arr.length;
				if ( 0 == wjSize ){
					console.log("wujiang is nil");
					window.getWuJiang();
					return;
				}
				if (currentIndex >= wjSize){
					currentIndex = 0;
					alert("一轮挑战完成");
					return;
				}
				var tgtlevel = parseInt(arr[currentIndex][2]) + 2;
				var gid = arr[currentIndex][0];
				var name = arr[currentIndex][1];
				var wjUrl = "index.php?act=battalion.personal_war&city_id=10&target_level="+tgtlevel+"&kffae7s=49fed0ec5fe&keep=all&gid="+gid+"&userid=10876&villageid=14662&w6c2u=c24fe54&rand=821022";
				console.log("name: " + name +"cidx: " + currentIndex + "/"+wjSize+" url:"+ wjUrl);
				var doit = function(){
					$.get(wjUrl, function(data,status){
						var resYZ = $(data).find("htmls").find('#dialog').text();
						var resCD = $(data).find("game").find('locat').text();
						//console.log("resCD:"+resCD);
						if ( -1 != resYZ.indexOf("请输入验证码") ){
							alertDialog('battalion.personal_war&city_id=25&target_level='+tgtlevel+'&kffae7s=49fed0ec5fe&keep=all&gid='+gid,'军营武将狼牙将:黄口小儿也来挑战老子！');
						}else if ( -1 != resCD.indexOf("解除CD时间") ){
							currentIndex = 0;	//不必再向下循环，直接归0重新等待计数就可以
							MM_xmlLoad('battalion.show_map');
						}else{
							currentIndex ++;
							pkWuJiang();
						}
					});
				}
				if ( arr[currentIndex][2] < 100 )
					doit();
				else{
					console.log(name+"="+arr[currentIndex][2]+" 不加入挑战");
					currentIndex ++;
						pkWuJiang();
				}
			}
			window.yabiao = 0;
			window.weima = function (){
				var obj = $(".subnav [dm='weima']");
				obj.css("background-color","red");
				obj.text("喂中");
				//循环
				$.get(window.weimaUrl, function(data, status){
					var bContinue = true;
					var resWM = $(data).find("game").find('locat').text();
					if ( -1 != resWM.indexOf("距离下次操作时间") ){
						console.log(resWM);
					}else if ( -1 != resWM.indexOf("您的帐户中金币余额不足") ){
						obj.text("喂完");
					}
				});
				MM_xmlLoad('horserace.guardlist&horseid=' + window.horseid);
				obj.text("运"+((window.yabiao - window.yabiao % 3) / 3 + 1));
				$("div a.btn_tz").each(function(){
					if (-1 != $(this).text().indexOf('押镖')){
						console.log($(this).text());
						$(this).click();
					}
				});
				setTimeout("weima()", 1203000);
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
						autoBuild();
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
