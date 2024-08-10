import './App.css';
import Sidebar from './side_bar';
import Module1 from'./module1.js';
import Module2 from'./module2.js';
import Module3 from'./module3.js';
import Module4 from'./module4.js';
import Module5 from'./module5.js';

import { BrowserRouter as Router , Routes,Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Module3/>}></Route>
          <Route path="/module1" element={<Module1/>}></Route>
          <Route path="/module2" element={<Module2/>}></Route>
          <Route path="/module3" element={<Module3/>}></Route>
          <Route path="/module4" element={<Module4/>}></Route>
          <Route path="/module5" element={<Module5/>}></Route>

        </Routes>
        {/* <Sidebar/> */}
      </div>












































































































































    </Router>
  );
}

export default App;