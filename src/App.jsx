import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./frontend/Home";

import Homereg from "./frontend/r2020/Homereg";
import Sandhhome from "./frontend/r2020/sandhr2020/Sandhhome";
import Cser2020home from "./frontend/r2020/cser2020/Cser2020home";
import Itr2020home from "./frontend/r2020/itr2020/Itr2020home";
import Aidsr2020home from "./frontend/r2020/aidsr2020/Aidsr2020home";
import Eeer2020home from "./frontend/r2020/eeer2020/Eeer2020home";
import Mechr2020home from "./frontend/r2020/mechr2020/mechr2020home";
import Homereg2023 from "./frontend/r2023/Homereg2023";
import Ecer2020home from "./frontend/r2020/ecer2020/Ecer2020home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/regulations2020" element={<Homereg />}></Route>
          <Route path="/sandhhome" element={<Sandhhome />}></Route>
          <Route path="/cser2020" element={<Cser2020home />}></Route>
          <Route path="/itr2020" element={<Itr2020home />}></Route>
          <Route path="/aidsr2020" element={<Aidsr2020home />}></Route>
          <Route path="/eeer2020" element={<Eeer2020home />}></Route>
          <Route path="/mechr2020" element={<Mechr2020home />}></Route>
          <Route path="ecer2020" element={<Ecer2020home />}></Route>
          {/* regulation 2023 */}
          <Route path="/regulations2023" element={<Homereg2023 />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
