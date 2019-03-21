# Http协议
首先了解OSI七层模型的每一层都有哪些协议：

> 七层理解:
物理层：物理接口规范，传输比特流,网卡是工作在物理层的。
	将数据转换为可通过物理介质传送的电子信号 相当于邮局中的搬运工人。
数据层：成帧，保证帧的无误传输，MAC地址，形成EHTHERNET帧。
	决定访问网络介质的方式 相当于邮局中的装拆箱工人。
网络层：路由选择，流量控制，IP地址，形成IP包。
	使用权数据路由经过大型网络 相当于邮局中的排序工人。
传输层：端口地址，如HTTP对应80端口。TCP和UDP工作于该层,还有就是差错校验和流量控制。
	提供终端到终端的可靠连接 相当于公司中跑邮局的送信职员。
会话层:组织两个会话进程之间的通信,并管理数据的交换使用NETBIOS和WINSOCK协议。QQ等软件进行通讯因该是工作在会话层的。
	允许用户使用简单易记的名称建立连接 相当于公司中收寄信、写信封与拆信封的秘书。
表示层：使得不同操作系统之间通信成为可能。
	协商数据交换格式 相当公司中简报老板、替老板写信的助理。
应用层：对应于各个应用软件。
	用户的应用程序。
> OSI: 
物理层：EIA/TIA-232, EIA/TIA-499, V.35, V.24, RJ45, Ethernet, 802.3, 802.5, FDDI, NRZI, NRZ, B8ZS
数据链路层：Frame Relay, HDLC, PPP, IEEE 802.3/802.2, FDDI, ATM, IEEE 802.5/802.2 
网络层：IP，IPX，AppleTalk DDP 
传输层：TCP，UDP，SPX 
会话层：RPC,SQL,NFS,NetBIOS,names,AppleTalk,ASP,DECnet,SCP 
表示层:TIFF,GIF,JPEG,PICT,ASCII,EBCDIC,encryption,MPEG,MIDI,HTML 
应用层：FTP,WWW,Telnet,NFS,SMTP,Gateway,SNMP

> TCP/IP: 
数据链路层：ARP,RARP 
网络层： IP,ICMP,IGMP 
传输层：TCP ,UDP,UGP 
应用层：Telnet,FTP,SMTP,SNMP. 

## 什么是HTTP?（全称超文本传输协议）
> HTTP是一个客户端和服务器端请求和响应的标准TCP。其实HTTP就是以 ASCII 码传输建立在TCP/IP协议之上的应用层规范，而TCP协议是面向连接的端到端的协议。
我们打开百度网页时，是这样的： https://www.baidu.com  多了个S，其实S表示TLS、SSL。

那HTTP协议呢？HTTP协议（HyperText Transfer Protocol）,即超文本传输协议是用于服务器传输到客户端浏览器的传输协议。
Web上，服务器和客户端利用HTTP协议进行通信会话。
有OOP思想的得出结论：其会话的结构是一个简单的请求/响应序列，即浏览器发出请求和服务器做出响应。

## 工作过程的HTTP报文
### 请求报文详解:
1、请求行
方法字段 + URL + Http协议版本
2、通用信息头
Cache-Control头域：指定请求和响应遵循的缓存机制。
keep-alive 是其连接持续有效【在下面百度的例子，会得到验证】
3、请求头
Host头域
Referer头域：允许客户端指定请求URL的资源地址。
User-Agent头域：请求用户信息。【可以看出一些客户端浏览器的内核信息】
4、报文主体 query string Parameters中
 一般来说，请求主体少不了请求参数。
 
> GET用于信息获取，而且应该是安全的 和 幂等的。
所谓安全的意味着该操作用于获取信息而非修改信息。换句话说，GET 请求一般不应产生副作用。
就是说，它仅仅是获取资源信息，就像数据库查询一样，不会修改，增加数据，不会影响资源的状态。
幂等的意味着对同一URL的多个请求应该返回同样的结果。

 GET请求报文示例：

 GET /books/?sex=man&name=Professional HTTP/1.1
 Host: www.example.com
 User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
 Gecko/20050225 Firefox/1.0.1
 Connection: Keep-Alive
 
> POST表示可能修改变服务器上的资源的请求。

 POST / HTTP/1.1
 Host: www.example.com
 User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
 Gecko/20050225 Firefox/1.0.1
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 40
 Connection: Keep-Alive

 sex=man&name=Professional  
 
>注意:
GET 可提交的数据量受到URL长度的限制，HTTP 协议规范没有对 URL 长度进行限制。这个限制是特定的浏览器及服务器对它的限制
理论上讲，POST 是没有大小限制的，HTTP 协议规范也没有进行大小限制，出于安全考虑，服务器软件在实现时会做一定限制
参考上面的报文示例，可以发现 GET 和 POST 数据内容是一模一样的，只是位置不同，一个在URL里，一个在 HTTP 包的包体里
 
### POST 提交数据的方式
 HTTP 协议中规定 POST 提交的数据必须在 body 部分中，但是协议中没有规定数据使用哪种编码方式或者数据格式。
 实际上，开发者完全可以自己决定消息主体的格式，只要最后发送的 HTTP 请求满足上面的格式就可以。

但是，数据发送出去，还要服务端解析成功才有意义。一般服务端语言如 php、python 等，以及它们的 framework，都内置了自动解析常见数据格式的功能。
服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。
所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分。下面就正式开始介绍它们：

application/x-www-form-urlencoded
这是最常见的 POST 数据提交方式。浏览器的原生 <form> 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。
上个小节当中的例子便是使用了这种提交方式。
可以看到 body 当中的内容和 GET 请求是完全相同的。

multipart/form-data
这又是一个常见的 POST 数据提交的方式。我们使用表单上传文件时，必须让 <form> 表单的 enctype 等于 multipart/form-data。
直接来看一个请求示例：

POST http://www.example.com HTTP/1.1
Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA

------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="text"

title
------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="file"; filename="chrome.png"
Content-Type: image/png

PNG ... content of chrome.png ...
------WebKitFormBoundaryrGKCBY7qhFd3TrwA--
这个例子稍微复杂点。首先生成了一个 boundary 用于分割不同的字段，为了避免与正文内容重复，boundary 很长很复杂。
然后 Content-Type 里指明了数据是以 multipart/form-data 来编码，本次请求的 boundary 是什么内容。
消息主体里按照字段个数又分为多个结构类似的部分，每部分都是以 --boundary 开始，紧接着是内容描述信息，然后是回车，最后是字段具体内容（文本或二进制）。
如果传输的是文件，还要包含文件名和文件类型信息。
消息主体最后以 --boundary-- 标示结束。关于 multipart/form-data 的详细定义，请前往 RFC1867 查看（或者相对友好一点的 MDN 文档）。

这种方式一般用来上传文件，各大服务端语言对它也有着良好的支持。

上面提到的这两种 POST 数据的方式，都是浏览器原生支持的，而且现阶段标准中原生 <form> 表单也只支持这两种方式（通过 <form> 元素的 enctype 属性指定，
默认为 application/x-www-form-urlencoded。其实 enctype 还支持 text/plain，不过用得非常少）。

随着越来越多的 Web 站点，尤其是 WebApp，全部使用 Ajax 进行数据交互之后，我们完全可以定义新的数据提交方式，
例如 application/json，text/xml，乃至 application/x-protobuf 这种二进制格式，
只要服务器可以根据 Content-Type 和 Content-Encoding 正确地解析出请求，都是没有问题的。
 
### 响应报文详解：
1、状态行
HTTP协议版本 + 状态码 + 状态代码的文本描述
【比如这里，200 代表请求成功】
2、通用信息头
keep-alive 是其连接持续有效【在下面百度的例子，会得到验证】
Date头域：时间描述
3、响应头
Server头：处理请求的原始服务器的软件信息。
4、实体头
Content-Type头：便是接收方实体的介质类型。（这也表示了你的报文主体是什么。）
（空行）
5、报文主体
这里就是HTML响应页面了，在截图tab页中的response中可查看。
一次简单的请求/响应就完成了。

## HTTP协议知识补充

### 持久连接
注意：
HTTP Keep-Alive 简单说就是保持当前的TCP连接，避免了重新建立连接。
HTTP 长连接不可能一直保持，例如 Keep-Alive: timeout=5, max=100，表示这个TCP通道可以保持5秒，max=100，表示这个长连接最多接收100次请求就断开。

HTTP 是一个无状态协议，这意味着每个请求都是独立的，Keep-Alive 没能改变这个结果。
另外，Keep-Alive也不能保证客户端和服务器之间的连接一定是活跃的，在 HTTP1.1 版本中也如此。
唯一能保证的就是当连接被关闭时你能得到一个通知，所以不应该让程序依赖于 Keep-Alive 的保持连接特性，否则会有意想不到的后果。

使用长连接之后，客户端、服务端怎么知道本次传输结束呢？
两部分：1. 判断传输数据是否达到了Content-Length 指示的大小；
		2. 动态生成的文件没有 Content-Length ，它是分块传输（chunked），这时候就要根据 chunked 编码来判断，
		chunked 编码的数据在最后有一个空 chunked 块，表明本次传输数据结束，详见这里。
什么是 chunked 分块传输呢？下面我们就来介绍一下。

### Transfer-Encoding




### 请求报文相关：
请求行-请求方法
GET            请求获取Request-URI所标识的资源
POST          在Request-URI所标识的资源后附加新的数据
HEAD         请求获取由Request-URI所标识的资源的响应消息报头
PUT            请求服务器存储一个资源，并用Request-URI作为其标识
DELETE       请求服务器删除Request-URI所标识的资源
TRACE        请求服务器回送收到的请求信息，主要用于测试或诊断
CONNECT  保留将来使用
OPTIONS   请求查询服务器的性能，或者查询与资源相关的选项和需求

### 响应报文相关：
响应行-状态码
1xx：指示信息–表示请求已接收，继续处理
2xx：成功–表示请求已被成功接收、理解、接受
3xx：重定向–要完成请求必须进行更进一步的操作
4xx：客户端错误–请求有语法错误或请求无法实现
5xx：服务器端错误–服务器未能实现合法的请求

### 常见的状态码:
200 OK 客户端请求成功
301 Moved Permanently 请求永久重定向
302 Moved Temporarily 请求临时重定向
304 Not Modified 文件未修改，可以直接使用缓存的文件。
400 Bad Request 由于客户端请求有语法错误，不能被服务器所理解。
401 Unauthorized 请求未经授权。这个状态代码必须和WWW-Authenticate报头域一起使用
403 Forbidden 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因
404 Not Found 请求的资源不存在，例如，输入了错误的URL
500 Internal Server Error 服务器发生不可预期的错误，导致无法完成客户端的请求。
503 Service Unavailable 服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常。