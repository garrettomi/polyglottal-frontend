import { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Form from "./Form";
import Timer from "./Timer";
import PokemonList from "./PokemonList";
import PokemonCounter from "./PokemonCounter";

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (pokemonName) => {
    try {
      const lowercaseName = pokemonName.toLowerCase();

      if (
        pokemonData.some(
          (pokemon) => pokemon.name.toLowerCase() === lowercaseName
        )
      ) {
        setErrorMessage("Already typed!");
        return;
      }

      const response = await axios.get(
        `http://localhost:9000/poketype/${lowercaseName}`
      );
      const data = response.data;

      if (response.status === 200) {
        const newPokemon = {
          name: data.name,
          img_url: data.img_url,
        };

        setPokemonData((prevData) => [...prevData, newPokemon]);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setErrorMessage("Pokemon not found");
      } else {
        setErrorMessage("An error occurred");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />
      {showForm ? <Form handleSubmit={handleSubmit} /> : <p>Press Play!</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <PokemonCounter count={pokemonData.length} />
      <PokemonList pokemonData={pokemonData} />
      <Timer setShowForm={setShowForm} setPokemonData={setPokemonData} />
    </div>
  );
}
