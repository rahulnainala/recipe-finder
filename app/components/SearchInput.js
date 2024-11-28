"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php`,
        {
          params: {
            s: searchTerm,
          },
        }
      );

      if (response.data.meals) {
        setRecipes(response.data.meals);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      setError("Error fetching recipes");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsPopoverOpen(true);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
    setSelectedRecipe(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        closePopover();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="p-4 max-w-screen-lg mx-auto bg-gray-900 text-white">
      <div className="flex mb-6 space-x-4">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 px-4 border border-gray-600 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-white"
        />
        <button
          onClick={handleSearch}
          className="py-3 px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="relative">
                <div className="bg-gray-700 w-full h-56 rounded-t-lg animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div>
        {!loading && recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.idMeal}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => handleCardClick(recipe)}
              >
                <div className="relative">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                    <h2 className="text-lg font-semibold text-white">
                      {recipe.strMeal}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400">
              No recipes found. Try a different search.
            </p>
          )
        )}
      </div>

      {isPopoverOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            ref={popoverRef}
            className="bg-gray-800 rounded-lg p-6 w-11/12 sm:w-1/2 md:w-1/3 max-h-[90vh] overflow-auto text-white"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {selectedRecipe.strMeal}
              </h2>
              <button
                onClick={closePopover}
                className="text-red-500 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <img
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc pl-6">
                {Object.keys(selectedRecipe)
                  .filter(
                    (key) =>
                      key.includes("strIngredient") && selectedRecipe[key]
                  )
                  .map((key, index) => (
                    <li key={index} className="text-gray-300">
                      {selectedRecipe[key]} -{" "}
                      {selectedRecipe[`strMeasure${key.slice(13)}`]}
                    </li>
                  ))}
              </ul>
              <h3 className="text-xl font-semibold mt-4 mb-2">Instructions:</h3>
              <p className="text-gray-300">{selectedRecipe.strInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
