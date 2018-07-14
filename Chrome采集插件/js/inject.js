// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(type,data)
{
	window.postMessage({cmd: type, data: data}, '*');
}

function get1688(){
	//获取抓取的所有信息，然后返回给content
	var data={}
	var title=$("h1")[0].innerText;
	var price=$("meta[property='og:product:price']").attr("content")
	if(price==null||price==undefined||price==""){
		alert("\u4EF7\u683C\u4E3A\u7A7A\uFF0C\u8BF7\u628A\u94FE\u63A5\u53D1\u7ED9\u6280\u672F")
		return;
	}
	$imgli=$("#dt-tab").find("li");
	var imgs=new Array();
	for(var p in $imgli){
		if(undefined!=$imgli[p].dataset){
			var img_json= $.parseJSON($imgli[p].dataset.imgs);
			imgs.push(img_json['original']);
		}
	}
	var $desc_td=$("#mod-detail-attributes").find("tbody td");
	var $remark="";
	for(var p in $desc_td){
		if(undefined==$desc_td[p].innerText)break;
		$remark+=$desc_td[p].innerText;
		if(p%2==0){
			$remark+=": ";
		}
		if(p%2==1){
			$remark+="\n";
		}
	}
	try {
		var $kuajing=$(".kuajing-attribues");
		if(undefined!=$kuajing){
			var $kuajing_wight=$kuajing.find("em")[0].innerText.replace("kg","").trim()
			data["weight"]=parseFloat($kuajing_wight)*1000
		}
	}catch(err){
	}
	if(price.indexOf("-")!=-1){
		price=price.split("-")[1]
	}
	data["urls"]=location.href;
	data["title"]=title;
	data["cost"]=price;
	data["pictures"]=imgs;
	data["details"]=$remark;
	//data["skuMap"]=iDetailData["sku"]["skuMap"];
	var skumap=iDetailData["sku"]["skuMap"];
	var $index=0;
	for(var p in skumap){
		data["slist["+$index+"].sname"]=p;
		if(p.indexOf('&gt;')!=-1){//有颜色尺码
			data["slist["+$index+"].scolor"]=p.split('&gt;')[0];
			data["slist["+$index+"].ssize"]=p.split('&gt;')[1];
		}else{//只有一个规格，当作颜色
			data["slist["+$index+"].scolor"]=p;
		}
		data["slist["+$index+"].sstock"]=skumap[p].canBookCount;
		data["slist["+$index+"].sprice"]=price;
		$index++;
	}
	sendMessageToContentScriptByPostMessage("1688",data)
}

// 通过DOM事件发送消息给content-script
(function() {
	if(location.host == 'detail.1688.com'){
		get1688();
	}else{
		alert(location.host+"抓取功能还未加入")
	}
})();
