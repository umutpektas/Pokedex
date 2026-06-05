import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

interface PokemonData {
  abilities: any[];
  image: string | null;
  types: string[];
}

const colorsByType:Record<string,string>={
  normal:"#A8A77A" ,
  fire: "#EE8130",
  water: "#6390F0" ,
  electric: "#F7D02C" ,
  grass: "#7AC74C" ,
  ice: "#96D9D6" ,
  fighting: "#C22E28" ,
  poison: "#A33EA1" ,
  ground: "#E5BF3C" ,
  flying: "#A33EA1" ,
  psychic: "#F95587" ,
  bug: "#A6B91A" ,
  rock: "#B6A136" ,
  ghost: "#7B3F9E" ,
  dragon: "#6F35FC" ,
  dark: "#705746" ,
  steel: "#B7B7CE" ,
  fairy: "#D685AD"
}


export default function Details() {

    const params = useLocalSearchParams();
    const pokemonName= params.name as string;

    console.log(pokemonName)
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

    useEffect(() => {
          //fetching pokemons
          fetchPokemons(pokemonName);
    
      },[])

    async function fetchPokemons(pokemonName: string) {
        try{
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
          const details = await response.json()

          const pokemonData = {
              abilities: details.abilities,
              image:details.sprites.front_default,
              types: details.types.map((typeInfo:any) => typeInfo.type.name),
          }
          setPokemonData(pokemonData);
          console.log(JSON.stringify(pokemonData, null, 2))

        } catch(e){
          console.log("an error occured:",e)
        }
      }
  
 
  return (
    <>
    <Stack.Screen options={{ 
      title : pokemonName.toUpperCase(),
      headerStyle:{
        backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5",
      }
    
    }} 
   
    />


    <ScrollView contentContainerStyle={{
      gap:16,
      padding:16,
    }}>


      
    </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
 
})