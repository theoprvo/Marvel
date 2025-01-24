import { useContext } from "react";
import AuthContext from "../contexts/authProvider";

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>Home</h1>
      {isAuthenticated ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}

export default Home;
