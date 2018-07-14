//向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}
//直接提交表单，
window.addEventListener("message", function(e){
	if(e.data && e.data.cmd == '1688') {
		//传递给background
		//chrome.runtime.sendMessage({host:"1688",data:e.data.data}, function(response) {
		//});
		var $data=e.data.data;
		var weight=$data["weight"];
		if(undefined==weight){
			weight=prompt("\u8bf7\u586b\u5199\u91cd\u91cf(\u5355\u4f4dg)","");
			$data["weight"]=weight;
		}
		var url2=prompt("\u8bf7\u586b\u5199\u901f\u5356\u901a\u53c2\u7167\u5730\u5740","");
		if(null==url2){
			url2="";
		}
		$data["url2"]=url2;
		if(null!=weight&&weight!=""){
			$.ajax({
				type: "POST",
			    url: "https://www.chhapp.com/product/spider",
			    data: $data,
			    dataType: "json",
			    success: function(data){
			    	if(data.code=="SUCCESS"){
			    		alert("\u4fdd\u5b58\u6210\u529f\uff0c\u786e\u5b9a\u540e\u8df3\u8f6c\u4ea7\u54c1\u7f16\u8f91\u9875\u9762\u6838\u5bf9")
			    		location.href="https://www.chhapp.com/product/update?id="+data.msg;
			    	}else{
			    		alert(data.msg)
			    	}
			    },
			    error:function(){
			    	alert("\u672a\u767b\u5f55\u7cfb\u7edf\u6216\u8005\u672a\u77e5\u9519\u8bef")
			    }
			})
		}else{
			alert("\u6ca1\u6709\u586b\u5199\u91cd\u91cf\uff0c\u4fdd\u5b58\u5931\u8d25");
		}
	}
}, false);

//监听backgroun的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.greeting == "clickMenu"){
		if(location.host == 'detail.1688.com'){
			injectCustomJs();
		}else{
			alert(location.host+"\u6293\u53D6\u529F\u80FD\u8FD8\u672A\u52A0\u5165")
		}
	}
});

