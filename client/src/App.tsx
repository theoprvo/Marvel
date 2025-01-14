import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
//COMPOSANTS GLOBAUX
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <AppRouter />
      </Router>
    </>
  );
}

export default App;
