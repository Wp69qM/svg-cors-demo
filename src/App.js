import logo from "./logo_reactsvg.svg";
import logo1 from "./logo_img.svg";
import logo3 from "./logo_object.svg";
import logo4 from "./logo_embed.svg";
import logo5 from "./logo_iframe.svg";
import { ReactSVG } from "react-svg";
import CircleSvg from "./circle";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>2. img标签引入</div>
        <img src={logo1} className="App-logo" alt="logo" />

        <div>3. 内嵌到 HTML中</div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle
            cx="100"
            cy="50"
            r="40"
            stroke="black"
            stroke-width="2"
            fill="deepskyblue"
          />
        </svg>

        <div>4. css背景图 </div>
        <div className="svg_bg"></div>

        <div style={{ marginTop: 50 }}>5. object标签引入 </div>
        <object data={logo3} type="image/svg+xml" width="300" height="300" />

        <div> 6. embed 标签引入 </div>
        <embed src={logo4} width="500" height="500" />

        <div> 7. iframe标签引入 </div>
        <iframe src={logo5} width="200" height="200"></iframe>

        <div style={{ marginTop: 50 }}> 8. ReactSvg组件引入 </div>
        <div style={{ width: "80px", height: "80px" }} className="App-logo">
          <ReactSVG src={logo}></ReactSVG>
        </div>

        <div style={{ marginTop: 50 }}> 9. 封装为svg组件引入 </div>
        <div style={{ width: "80px", height: "80px" }} className="App-logo">
          <CircleSvg />
        </div>
      </header>
    </div>
  );
}

export default App;
