import { useEffect, useState } from "react";
import useAxiosWithAuth from "../hooks/useAxiosWithAuth";

const ENDPOINT_URL = `/user/favorites`;

interface Favorite {
  favoriteID: string;
  favoriteType: string;
}

interface Data {
  totalFavorites: number;
  favorites: Favorite[];
}

function Profile() {
  const axiosWithAuth = useAxiosWithAuth();
  const [data, setData] = useState<Data | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFavorites = async () => {
    try {
      const response = await axiosWithAuth.get(`${ENDPOINT_URL}`, {
        params: { page: 1, limit: 10 },
      });
      setData(response.data);
      console.log("result => ", data);
      setFavorites(response.data.favorites);
      console.log("favorites => ", favorites);

      setErrorMessage("");
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Please try again");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>
      {isLoading ? (
        <p>Chargement des favoris...</p>
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            I have {data.totalFavorites} favorites :
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map((fav) => (
              <li
                key={fav.favoriteID}
                className="p-4 border rounded shadow-sm bg-gray-50"
              >
                <p className="text-lg font-medium">
                  {fav.favoriteType === "character" ? "Personnage" : "Comics"}
                </p>
                <p>ID : {fav.favoriteID}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Profile;
