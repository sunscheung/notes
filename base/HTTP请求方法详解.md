# HTTP请求方法详解
 **请求方法：指定了客户端想对指定的资源/服务器作何种操作下面我们介绍HTTP/1.1中可用的请求方法：**
## 【GET：获取资源】
GET方法用来请求已被URI识别的资源。指定的资源经服务器端解析后返回响应内容（也就是说，如果请求的资源是文本，那就保持原样返回；如果是CGI[通用网关接口]那样的程序，则返回经过执行后的输出结果）。
     最常用于向服务器查询某些信息。必要时，可以将查询字符串参数追加到URL末尾，以便将信息发送给服务器。
     使用GET请求时经常会发生的一个错误，就是查询字符串的格式有问题。查询字符串中每个参数的名称和值都必须使用encodeURLComponent()进行编码，然后才能放到URL的末尾；而且所有的名-值对都必须由（&）分离，如下面的例子：
         `xhr.open("get","01.php?name=foodoir&age=21",true);`
     下面这个函数可以辅助现有URL的末尾添加查询字符串参数：
```
function addURLParam(url,name,value){
        url += (url.indexOf("?") == -1 ? "?" : "&");
        url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
        return url;
    }
```
这个addURLParam函数接受三个参数：要添加参数的URL、参数的名称和参数的值。
    下面是使用这个函数来构建URL的示例:
```
 var url = "example.php";
    //添加参数
    url = addURLParam(url,"name","foodoir");
    url = addURLParam(url,"age","21");
    //初始化请求
    xhr.open("get",url,false);
``` 

## 【POST：传输实体文本】  
      
POST方法用来传输实体的主体。虽然用GET方法也可以传输实体的主体，但一般不用GET方法进行传输，而是用POST方法；虽然GET方法和POST方法很相似，但是POST的主要目的并不是获取响应的主体内容。
POST请求的主体可以包含非常多的数据，而且格式不限。下面举一个例子：
    ` xhr.open("post","01.php",true);`
发送POST请求的第二步就是向send方法中传入某些数据，由于XHR最初的设计是为了处理XML，因此也可以在此处理XML DOM文档，传入的文档经过序列化之后将作为请求主体被提交到服务器。
默认情况下，服务器对于POST请求和提交WEB表单的请求并不会一视同仁，我们来看下面一段代码： 

```
function(){
    var xhr = CreateXHR();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){//检测XHR的readyState属性
            if((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304){
                alert(xhr.responseText);
            }else{
                alert("Request was unsuccessful:" + xhr.status);
            }
        }
    };
    
    xhr.open("post","post.php",true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    var form = document.getElementById("ID");
    xhr.send(serialize(form));
}
``` 

我们可以模仿XHR表单提交：首先将Content-Type头部信息设置为application/x-www-form-urlencoded，也就是表单提交时的类型，其次是以适当的格式创建一个字符串（POST数据格式与查询字符串的格式相同），如果需要将页面中表单的数据进行序列化，然后再通过XHR函数发送到服务器，那么可以使用序列化函数serialize()，（表单序列化，这里不作具体介绍）

### 在这里我们来比较GET方法和POST方法本质上的区别：

　　1、GET方法用于信息获取，它是安全的（安全：指非修改信息，如数据库方面的信息），而POST方法是用于修改服务器上资源的请求；

　　2、GET请求的数据会附在URL之后，而POST方法提交的数据则放置在HTTP报文实体的主体里，所以POST方法的安全性比GET方法要高；

　　3、GET方法传输的数据量一般限制在2KB，其原因在于：GET是通过URL提交数据，而URL本身对于数据没有限制，但是不同的浏览器对于URL是有限制的，比如IE浏览器对于URL的限制为2KB，而Chrome，FireFox浏览器理论上对于URL是没有限制的，它真正的限制取决于操作系统本身；POST方法对于数据大小是无限制的，真正影响到数据大小的是服务器处理程序的能力。

### post请求上传文件和文本时http格式
服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式*编码*，再对主体进行解析。所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分。
**application/x-www-form-urlencoded**
最基本的form表单结构,用于传递字符参数的键值对,请求结构如下
```
POST  HTTP/1.1
Host: www.demo.com
Cache-Control: no-cache
Postman-Token: 81d7b315-d4be-8ee8-1237-04f3976de032
Content-Type: application/x-www-form-urlencoded

key=value&testKey=testValue
```
请求头中的Content-Type设置为application/x-www-form-urlencoded; 提交的的数据,请求body中按照 key1=value1&key2=value2 进行编码,key和value都要进行urlEncode;

**multipart/form-data**
这是上传文件时,最常见的数据提交方式,看一下请求结构
```
POST  HTTP/1.1
Host: www.demo.com
Cache-Control: no-cache
Postman-Token: 679d816d-8757-14fd-57f2-fbc2518dddd9
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="key"

value
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="testKey"

testValue
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="imgFile"; filename="no-file"
Content-Type: application/octet-stream  //  文件的扩展名.tif


<data in here>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```
首先请求头中的Content-Type 是multipart/form-data; 并且会随机生成一个boundary, 用于区分请求body中的各个数据; 每个数据以 –boundary 开始, 紧接着换行,下面是内容描述信息, 接着换2行, 接着是数据; 然后以 –boundary– 结尾, 最后换行;

文本数据和文件,图片的内容描述是不相同的 
文本参数:
```
Content-Disposition: form-data; name="key"
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
```
文件参数:
```
Content-Disposition: form-data; name="imgFile"; filename="no-file"
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
```
每个换行都是 \r\n ;

application/json

text/xml

text/plain

请求头的Content-Type设置为这几个也很常见, 不过一般是在web前端开发中,请求body没有固定结构, 直接传输对应数据的数据流, 不必和上面2种样, 还要用固定的结构包起来, 只不过数据对应的是json, xml, 文本;

总结
注意： 
(1)服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。 
(2)如果传输的是文件，还要包含文件名(filename)和文件类型信息(content-type) 
(3)注意：content-type在请求头可以设置，在请求实体也可以设置；在请求头的作用是指明提交的表单的类型和编码方式；在请求实体的作用指明所在部分的文件类型(比如：content-type：image/png)

# HTTP请求中的form data和request payload的区别
在下面的例子中，表单数据会在未编码的情况下进行发送：
```
<form action="" enctype="text/plain">
  <p>First name: <input type="text" name="fname" /></p>
  <p>Last name: <input type="text" name="lname" /></p>
  <input type="submit" value="Submit" />
</form>
```
定义和用法

enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码。

默认地，表单数据会编码为 “application/x-www-form-urlencoded”。就是说，在发送到服务器之前，所有字符都会进行编码（空格转换为 “+” 加号，特殊符号转换为 ASCII HEX 值）。

enctype（Content-Type）值和意义:

> application/x-www-form-urlencoded     在发送前编码所有字符（默认）
> multipart/form-data       不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。
> text/plain                空格转换为 "+" 加号，但不对特殊字符编码。

HTTP请求中，如果是get请求，那么表单参数以name=value&name1=value1的形式附到url的后面，如果是post请求，那么表单参数是在请求体中，也是以name=value&name1=value1的形式在请求体中。通过chrome的开发者工具可以看到如下（这里是可读的形式，不是真正的HTTP请求协议的请求格式）：
**get请求：**
```
RequestURL:http://127.0.0.1:8080/test/test.do?name=mikan&address=street 
Request Method:GET 
Status Code:200 OK 

Request Headers 
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8 
Accept-Encoding:gzip,deflate,sdch 
Accept-Language:zh-CN,zh;q=0.8,en;q=0.6 
AlexaToolbar-ALX_NS_PH:AlexaToolbar/alxg-3.2 
Connection:keep-alive 
Cookie:JSESSIONID=74AC93F9F572980B6FC10474CD8EDD8D 
Host:127.0.0.1:8080 
Referer:http://127.0.0.1:8080/test/index.jsp 
User-Agent:Mozilla/5.0 (Windows NT 6.1)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36 

Query String Parameters 
name:mikan 
address:street 

Response Headers 
Content-Length:2 
Date:Sun, 11 May 2014 10:42:38 GMT 
Server:Apache-Coyote/1.1
```
**jquery的Post请求：** 
注意：这里要注意post请求的Content-Type默认值为application/x-www-form-urlencoded，参数是在请求体中，即上面请求中的Form Data
```
RequestURL:http://127.0.0.1:8080/test/test.do 
Request Method:POST 
Status Code:200 OK 

Request Headers 
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8 
Accept-Encoding:gzip,deflate,sdch 
Accept-Language:zh-CN,zh;q=0.8,en;q=0.6 
AlexaToolbar-ALX_NS_PH:AlexaToolbar/alxg-3.2 
Cache-Control:max-age=0 
Connection:keep-alive 
Content-Length:25 
Content-Type:application/x-www-form-urlencoded 
Cookie:JSESSIONID=74AC93F9F572980B6FC10474CD8EDD8D 
Host:127.0.0.1:8080 
Origin:http://127.0.0.1:8080 
Referer:http://127.0.0.1:8080/test/index.jsp 
User-Agent:Mozilla/5.0 (Windows NT 6.1)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36 

Form Data 
name:mikan 
address:street 

Response Headers 
Content-Length:2 
Date:Sun, 11 May 2014 11:05:33 GMT 
Server:Apache-Coyote/1.1
```
**原生AJAX POST请求：** 
注意请求的Content-Type 默认值为text/plain;charset=UTF-8，而请求表单参数在RequestPayload中。
```
RequestURL:http://127.0.0.1:8080/test/test.do 
Request Method:POST 
Status Code:200 OK 

Request Headers 
Accept:*/* 
Accept-Encoding:gzip,deflate,sdch 
Accept-Language:zh-CN,zh;q=0.8,en;q=0.6 
AlexaToolbar-ALX_NS_PH:AlexaToolbar/alxg-3.2 
Connection:keep-alive 
Content-Length:28 
Content-Type:text/plain;charset=UTF-8 
Cookie:JSESSIONID=C40C7823648E952E7C6F7D2E687A0A89 
Host:127.0.0.1:8080 
Origin:http://127.0.0.1:8080 
Referer:http://127.0.0.1:8080/test/index.jsp 
User-Agent:Mozilla/5.0 (Windows NT 6.1)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36 

Request Payload 
name=mikan&address=street 

Response Headers 
Content-Length:2 
Date:Sun, 11 May 2014 11:49:23 GMT 
Server:Apache-Coyote/1.1
```
HTTP POST表单请求和jquery的ajax请求时，使用的Content-Type是application/x-www-form-urlencoded，而使用原生AJAX的POST请求如果不指定请求头RequestHeader，默认使用的Content-Type是text/plain;charset=UTF-8。
```
Content-Type是application/x-www-form-urlencoded，tomcat服务器端可以通过`request.getParameter(name)` 获取值；
Content-Type是text/plain;charset=UTF-8，tomcat服务器端不能通过`request.getParameter(name)`获取值；
```
为什么呢？而这样的参数又该怎么样获取呢？ 

HTTP POST表单请求提交时，使用的Content-Type是application/x-www-form-urlencoded，而使用原生AJAX的POST请求如果不指定请求头RequestHeader，默认使用的Content-Type是text/plain;charset=UTF-8。

由于Tomcat对于Content-Type为 multipart/form-data（文件上传）和application/x-www-form-urlencoded（POST请求）做了“特殊处理”。下面来看看相关的处理代码。

Tomcat的HttpServletRequest类的实现类为org.apache.catalina.connector.Request（实际上是org.apache.coyote.Request），而它对处理请求参数的方法为protected void parseParameters()，这个方法中对Content-Type为 multipart/form-data（文件上传）和application/x-www-form-urlencoded（POST请求）的处理代码如下：
```
protectedvoid parseParameters() { 
           //省略部分代码...... 
           parameters.handleQueryParameters();// 这里是处理url中的参数 
           //省略部分代码...... 
           if ("multipart/form-data".equals(contentType)) { // 这里是处理文件上传请求 
                parseParts(); 
                success = true; 
                return; 
           } 

           if(!("application/x-www-form-urlencoded".equals(contentType))) {// 这里如果是非POST请求直接返回，不再进行处理 
                success = true; 
                return; 
           } 
           //下面的代码才是处理POST请求参数 
           //省略部分代码...... 
           try { 
                if (readPostBody(formData, len)!= len) { // 读取请求体数据 
                    return; 
                } 
           } catch (IOException e) { 
                // Client disconnect 
                if(context.getLogger().isDebugEnabled()) { 
                    context.getLogger().debug( 
                            sm.getString("coyoteRequest.parseParameters"),e); 
                } 
                return; 
           } 
           parameters.processParameters(formData, 0, len); // 处理POST请求参数，把它放到requestparameter map中（即request.getParameterMap获取到的Map，request.getParameter(name)也是从这个Map中获取的） 
           // 省略部分代码...... 
} 

   protected int readPostBody(byte body[], int len) 
       throws IOException { 

       int offset = 0; 
       do { 
           int inputLen = getStream().read(body, offset, len - offset); 
           if (inputLen <= 0) { 
                return offset; 
           } 
           offset += inputLen; 
       } while ((len - offset) > 0); 
       return len; 
    }
```
从上面代码可以看出，Content-Type不是application/x-www-form-urlencoded的POST请求是不会读取请求体数据和进行相应的参数处理的，即不会解析表单数据来放到request parameter map中。所以通过request.getParameter(name)是获取不到的。

那么这样提交的参数我们该怎么获取呢？

当然是使用最原始的方式，读取输入流来获取了，如下所示：
```
private String getRequestPayload(HttpServletRequest req) { 
    StringBuilder sb = new StringBuilder(); 
    BufferedReader reader = req.getReader();
    try{ 
        char[]buff = new char[1024]; 
        intlen; 
        while((len = reader.read(buff)) != -1) { 
                 sb.append(buff,0, len); 
        } 
   }catch (IOException e) { 
       e.printStackTrace(); 
   } 
   return sb.toString(); 
} 
```
所以，在使用原生AJAX POST请求时，需要明确设置Request Header，即：

xhr.setRequestHeader(“Content-Type”,”application/x-www-form-urlencoded”);

服务器为什么会对表单提交和文件上传做特殊处理，因为表单提交数据是名值对的方式，且Content-Type为application/x-www-form-urlencoded，而文件上传服务器需要特殊处理，普通的post请求（Content-Type不是application/x-www-form-urlencoded）数据格式不固定，不一定是名值对的方式，所以服务器无法知道具体的处理方式，所以只能通过获取原始数据流的方式来进行解析。

jquery在执行post请求时，会设置Content-Type为application/x-www-form-urlencoded，所以服务器能够正确解析，而使用原生ajax请求时，如果不显示的设置Content-Type，那么默认是text/plain，这时服务器就不知道怎么解析数据了，所以才只能通过获取原始数据流的方式来进行解析请求数据。


# 【HEAD：获得报文首部】  
      
HEAD方法和GET方法一样， 知识不返回豹纹的主体部分，用于确认URI的有效性及资源更新的日期时间等。具体来说：1、判断类型； 2、查看响应中的状态码，看对象是否存在（响应：请求执行成功了，但无数据返回）； 3、测试资源是否被修改过。HEAD方法和GET方法的区别： GET方法有实体，HEAD方法无实体。

# 【PUT：传输文件】   
PUT方法用来传输文件，就像FTP协议的文件上传一样，要求在请求报文的主体中包含文件内容，然后保存在请求URI指定的位置。但是HTTP/1.1的PUT方法自身不带验证机制，任何人都可以上传文件，存在安全问题，故一般不用。

# 【DELETE：删除文件】  
    指明客户端想让服务器删除某个资源，与PUT方法相反，按URI删除指定资源
    
# 【OPTIONS：询问支持的方法】 
   OPTIONS方法用来查询针对请求URI指定资源支持的方法（客户端询问服务器可以提交哪些请求方法）
 
> 常见于跨域请求和文件上传的场景

# 【TRACE：追踪路径】 

    客户端可以对请求消息的传输路径进行追踪，TRACE方法是让Web服务器端将之前的请求通信还给客户端的方法
    
# 【CONNECT：要求用隧道协议连接代理】 

CONNECT方法要求在与代理服务器通信时建立隧道，实现用隧道协议进行TCP通信。主要使用SSL（安全套接层）和TLS（传输层安全）协议把通信内容加密后经网络隧道传输。


 
