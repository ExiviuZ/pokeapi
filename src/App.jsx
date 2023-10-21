import React, { useEffect, useState } from "react";
import "./style.css";
import Pokedex from "./assets/pokedex.png";

const pokemonTypesAndColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  steel: "#B7B7CE",
  dragon: "#6F35FC",
  dark: "#705746",
  fairy: "#D685AD",
};

const pokeApiGenerations = {
  generation1: {
    name: "Generation 1 (Kanto)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=151",
    totalPokemon: 151,
  },
  generation2: {
    name: "Generation 2 (Johto)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=100&offset=151",
    totalPokemon: 100,
  },
  generation3: {
    name: "Generation 3 (Hoenn)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=135&offset=251",
    totalPokemon: 135,
  },
  generation4: {
    name: "Generation 4 (Sinnoh)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=107&offset=386",
    totalPokemon: 107,
  },
  generation5: {
    name: "Generation 5 (Unova)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=156&offset=493",
    totalPokemon: 156,
  },
  generation6: {
    name: "Generation 6 (Kalos)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=72&offset=649",
    totalPokemon: 72,
  },
  generation7: {
    name: "Generation 7 (Alola)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=88&offset=721",
    totalPokemon: 88,
  },
  generation8: {
    name: "Generation 8 (Galar)",
    url: "https://pokeapi.co/api/v2/pokemon?limit=89&offset=809",
    totalPokemon: 89,
  },
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState(pokeApiGenerations.generation1);

  useEffect(() => {
    async function fetchKantoPokemon() {
      setLoading(true);
      try {
        const response = await fetch(generation.url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const pokemonsToSet = [];

        await Promise.all(
          data.results.map(async (entry) => {
            const res = await fetch(entry.url);
            if (!res.ok) {
              throw new Error(`Failed to fetch data for ${entry.name}`);
            }
            const pokemonData = await res.json();
            pokemonsToSet.push(pokemonData);
          })
        );
        setPokemons(pokemonsToSet);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    }
    async function fetchPokemonTypes() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const types = await response.json();
        setPokemonTypes(types.results);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    }

    fetchKantoPokemon();
    fetchPokemonTypes();
  }, [generation]);

  function changeGeneration(generation) {
    setGeneration(pokeApiGenerations[generation]);
  }

  function isTypeMatch(typesArray, matchWord) {
    for (const type of typesArray) {
      if (type.type.name === matchWord) {
        return true;
      }
    }
    return false;
  }

  return (
    <div>
      <header>
        <div className="brand">
          <img className="brand-logo" src={Pokedex} alt="" />
          <h1>Pokedex</h1>
        </div>

        <div className="form">
          <select
            id="generationSelect"
            onChange={(e) => changeGeneration(e.target.value)}
          >
            <option value={"generation1"}>Select a Pokémon Generation</option>
            {Object.keys(pokeApiGenerations).map((generationKey) => {
              const generation = pokeApiGenerations[generationKey];
              return (
                <option key={generationKey} value={generationKey}>
                  {generation.name}
                </option>
              );
            })}
          </select>
          <select
            name="type"
            style={{
              color: pokemonTypesAndColors[filter],
            }}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value={""}>Filter by type</option>;
            {pokemonTypes.map((type) => {
              return (
                <option
                  key={type.name}
                  value={type.name}
                  style={{
                    color: pokemonTypesAndColors[type.name],
                  }}
                >
                  {type.name}
                </option>
              );
            })}
          </select>
        </div>
        <p className="total">
          Total Pokemon: <b>{`${generation.totalPokemon}`}</b>
        </p>
      </header>
      {loading ? (
        <div className="loading-container">
          Catching Pokemons!! <div className="spinner"></div>
        </div>
      ) : (
        <div className="pokemon-list">
          {filter
            ? (() => {
                const filteredPokemons = pokemons.filter((pokemon) => {
                  return isTypeMatch(pokemon.types, filter.toLowerCase());
                });

                if (filteredPokemons.length === 0) {
                  return <p>No matching Pokémon found.</p>;
                }

                return filteredPokemons.map((filteredPokemon, index) => {
                  return <Pokemon key={index} pokemon={filteredPokemon} />;
                });
              })()
            : pokemons.map((pokemon, index) => (
                <Pokemon key={index} pokemon={pokemon} />
              ))}
        </div>
      )}
    </div>
  );
}

function Pokemon({ pokemon }) {
  const getTypeColor = (type) => {
    return pokemonTypesAndColors[type] || "#000000"; // Default to black if type is not found
  };

  return (
    <div
      className="pokemon"
      style={{
        ...(pokemon
          ? {
              border: `2px solid ${getTypeColor(pokemon.types[0].type.name)}`,
            }
          : {}),
      }}
    >
      {pokemon && (
        <div className="pokemon-data">
          <div className="img-container">
            <img
              className="poke-img"
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={name}
            />
          </div>
          <p className="pokemon-name">{pokemon.name}</p>
          <div className="pokemon-types">
            {pokemon.types.map((type) => {
              return (
                <span
                  key={`${pokemon.name}-${type.type.name}`}
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {type.type.name}
                </span>
              );
            })}
          </div>

          <div className="pokemon-ability">
            <p>Base Stats</p>
            <div className="wrap">
              {pokemon.stats.map((stats) => {
                return (
                  <p
                    key={`${pokemon.name}-${stats.stat.name}`}
                    className="stats-name"
                  >
                    <span style={{ fontWeight: "300" }}>
                      {stats.stat.name.replace("ecial-", ". ")}
                    </span>{" "}
                    <span style={{ fontWeight: "600" }}>{stats.base_stat}</span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
