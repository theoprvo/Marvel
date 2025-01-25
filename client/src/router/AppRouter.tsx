import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Characters from "../pages/Characters";
import CharacterDetails from "../pages/CharacterDetails";
import Comics from "../pages/Comics";
import ComicDetails from "../pages/ComicDetails";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/characters" element={<Characters />} />
      <Route path="/characters/:id" element={<CharacterDetails />} />
      <Route path="/comics" element={<Comics />} />
      <Route path="/comics/:id" element={<ComicDetails />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
