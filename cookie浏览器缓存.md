## Cookie的诞生
由于HTTP协议是无状态的，而服务器端的业务必须是要有状态的。
Cookie是由服务器端生成，发送给User-Agent,浏览器会将Cookie的key/value保存到某个目录下的文本文件内，下次请求同一网站时就发送该Cookie给服务器。
## Cookie的处理分为：
服务器像客户端发送cookie
浏览器将cookie保存
之后每次http请求浏览器都会将cookie发送给服务器端

cookie操作类
```
export default class Cookie {
	//写cookies
	static setCookie = (name, value) => {
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}
	//读取cookies 
	static getCookie = (name) => {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	//删除cookies 
	static delCookie = (name) => {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if(cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}
```

[进一步了解Cookie](https://baike.baidu.com/item/cookie/1119?fr=aladdin#14)
