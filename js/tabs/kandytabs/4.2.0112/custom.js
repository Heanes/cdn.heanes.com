$(function(){
	// 以下不是效果演示部分，请跳过！
	var $intro = $("#intro").KandyTabs({
		trigger:"click",
		action:"slide",
		except:".tip",
		child:["dl.feature",{action:"fade"}],
		current:7,
		nav:true,
		done:function(){$(".changelog").wrapInner("<div/>")}
	});
	$(".changelog div").KandyTabs({
		classes:"kandyFold",
		type:"fold",
		trigger:"click",
		action:"slide",
		current:2
	});
	var $featrue = $("dl.feature")[0].KandyTabs;
	$("a.see-defect").click(function(){
		$featrue.tab($("#defect"));
		$(".nest").animate({paddingLeft:20},500).animate({paddingLeft:0},400).animate({paddingLeft:10},300).animate({paddingLeft:0},200).animate({paddingLeft:5},100).animate({paddingLeft:0},50);
		return false;
	});
	$("a.see-options").click(function(){
		$intro.tab("#options");
		return false;
	});
	$("a.see-codestruct").click(function(){
		$intro.tab($(this).attr("href"));
		return false;
	});
	// 以上不是效果演示部分，请跳过！
	
	// Tab选项卡效果演示
	$("#simple").KandyTabs();
	
	$("#fade").KandyTabs({
		action:"fade",
		delay:1000
	});
	$("#slifade").KandyTabs({
		action:"slifade",
		delay:500
	});
	$("#slide").KandyTabs({
		action:"slide",
		trigger:"click"
	});
	$("#roll button").live("click",function(){
		$("#roll")[0].KandyTabs&&alert("不是已经生成好了么？")
		$("#roll").KandyTabs({
			btn:"dt>span",
			cont:"dd>div",
			action:"roll",
			trigger:"mousedown",
			current:2,
			nav:true,
			ready:function(t){
				t.find(".tabcont").first().find("p").toggle();
			},
			done:function(b,c,t){
				c.first().find("input").click(function(){
					t.KandyTabs(false)
				});
			}
		});
	});
	$("#rollleft").KandyTabs({
		action:"roll",
		trigger:"mouseup",
		direct:"right"
	});
	// fold折叠效果演示
	$("#fold-simple").KandyTabs({
		classes:"kandyFold",
		type:"fold"
	});
	$("#fold-slide").KandyTabs({
		classes:"kandyFold",
		action:"slide",
		type:"fold"
	});
	$("#fold-fade").KandyTabs({
		classes:"kandyFold",
		action:"fade",
		type:"fold",
		trigger:"click"
	});
	
	$("#fold-left").KandyTabs({
		classes:"kandyFold",
		type:"fold",
		action:"fade",
		direct:"left",
		trigger:"click",
		last:800
	})
	$("#fold-right").KandyTabs({
		classes:"kandyFold",
		type:"fold",
		direct:"right",
		action:"slide",
		delay:300
		//easing:"easeOutBack"
	})
	// Slide幻灯片效果演示
	$("#imgslide").KandyTabs({
		classes:"kandySlide",
		action:"slifade",
		stall:5000,
		type:"slide",
		auto:true,
		process:true,
		direct:"left",
		resize:false
	});
	$("#imgnavslide").KandyTabs({
		classes:"kandySlide",
		action:"roll",
		stall:5000,
		type:"slide",
		auto:true,
		nav:true,
		process:"60h+45#f60",
		direct:"left",
		lang:{
			prev:["点一下就显示前一张图片"],
			next:["点一下就显示下一张图片"]
		},
		resize:false,
		last:1000,
		easing:"easeInOutExpo"
	});
	$("#customslide").KandyTabs({
		classes:"kandySlide",
		action:"roll",
		direct:"bottom",
		stall:5000,
		type:"slide",
		auto:true,
		loop:true,
		custom:function(b,c,i){
				$("p",c).fadeOut();
				c.eq(i).find("p").slideDown(1500);
			  },
		done:function(b,c,t){
				$("p",c).fadeTo(500,.7).hide();
				c.first().find("p").slideDown(1500);
			  },
		last:1000,
		easing:"easeOutBounce"
	});
	// Loop多列循环（旋转木马）效果演示
	$("#imgloop").KandyTabs({
		type:"slide",
		column:3,
		classes:"kandyLoop",
		action:"roll",
		trigger:"click",
		except:"h4",
		auto:true,
		nav:true,
		resize:false,
		last:1000,
		easing:"easeInOutBack"
	});
	$("#imgscroll").KandyTabs({
		type:"slide",
		column:2,
		classes:"kandyLoop",
		action:"roll",
		direct:"right",
		trigger:"click",
		except:"h4",
		auto:true,
		nav:true,
		loop:true,
		resize:false,
		last:1000,
		easing:"easeInOutBack"
	});
	$nlr=$("#nolooproll").KandyTabs({
		type:"slide",
		column:1,
		action:"roll",
		direct:"left",
		stall:2000,
		nav:true,
		resize:false,
		done:function(b,c,t){
			var nlrplayed=false;
			$(document).scroll(function(){
				if(t.position().top-$(window).height()/2<$(this).scrollTop()){
					if(nlrplayed===true)return false;
					$nlr.play(1);
					nlrplayed=true;
				}
			})
		}
	})
	// Step/Guide步骤表单/向导效果演示
	$("#simplestep").KandyTabs({
		trigger:"step",
		classes:"kandyStep",
		nav:true,
		action:"slide",
		lang:{
			prev:["上一步","上一步"],
			next:["下一步","下一步"]
		},
		custom:function(b,c,i,t){
			b.eq(i).removeClass("tabok").prev().addClass("tabok").next().removeClass("tabok")
		}
	});
	$("#verifystep").KandyTabs({
		trigger:"step",
		classes:"kandyStep",
		nav:true,
		lang:{
			prev:["上一步","上一步"],
			next:["下一步","下一步"]
		},
		custom:function(b,c,i,t){
			i == 0 ? $(".tabprev",t).hide() : $(".tabprev",t).show()
			i == b.length-1 ? $(".tabnext",t).hide() : $(".tabnext",t).show()
			b.eq(i).removeClass("tabok").prev().addClass("tabok").next().removeClass("tabok")
			c.eq(i).find("input").keyup(function(){
				if (this.value != "") {
					$(".tabnext",t).removeClass("tabnextno")
					$(this).removeClass("err")
				} else {
					$(".tabnext",t).addClass("tabnextno")
					$(this).addClass("err")
				}
			})
			setTimeout(function(){c.eq(i).find("input").trigger("keyup")},1)
		},
		done:function(b,c,t){
			$("input",t).each(function(){
				this.value == "" ?  $(this).addClass("err") : $(this).removeClass("err")
			})
			b.first().trigger("step")
		}
	});
	//选项卷轴/内容增删/外部控制演示
	$("#scroll").KandyTabs({
		scroll:true,
		done:function(b,c,t,i){
			i.add();
			i.del();
		}
	});
	$("#deladd").KandyTabs({
		action:"fade",
		trigger:"click",
		add:true,
		del:true,
		scroll:true,
		nav:true
	});
	tab = $("#api").KandyTabs({
		action:"slide"
	});
	$("#tabapi b").attr("title",function(){
		return this.onclick;
	})
	$full = $("#full").KandyTabs(fullSlifade);
})
var tab,$nlr,$full,
fullSlifade={
	id:"full",
	classes:"kandySlide",
	type:"slide",
	action:"slifade",
	full:true,
	auto:true,
	nav:true,
	last:2000
},
fullRoll={
	classes:"kandySlide",
	type:"slide",
	action:"roll",
	full:true,
	auto:true,
	nav:true,
	last:1000
};

function resize(dir,pm){
	//alert($(obj)[dir]())
	var $sizer=$("#fullwrap"),
			size=$sizer[dir]()+pm;
	if(dir=="width"&&size>1000) return false;
	$sizer[dir](size)
}