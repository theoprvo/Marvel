import { useAuth } from "../contexts/authProvider";
import { Link } from "react-router-dom";

function Home() {
  const { accessToken, isAuthenticated } = useAuth();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-100">
      <h1 className="text-x30 font-abc-h uppercase">Homepage</h1>
      <p className="italic">
        Welcome on the MARVEL app ! isAuth = {isAuthenticated}
      </p>
      {isAuthenticated ? (
        <div>Connecte : {accessToken}</div>
      ) : (
        <div>
          <p>Pas connecte</p>
          <Link className="text-blue-700 hover:underline" to={"/login"}>
            go to login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
