import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokemonData {
  abilities: any[];
  imageFront: string | null;
  sImageFront: string| null;
  imageBack: string | null;
  sImageBack: string | null;
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
              imageFront:details.sprites.front_default,
              sImageFront:details.sprites.front_shiny,
              imageBack:details.sprites.back_default,
              sImageBack:details.sprites.back_shiny,
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
      backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "25" : "#f5f5f5",
      width:"100%",
      height:"100%",
    }}>
      <View style={{
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-around",
        padding:10,
        backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "55" : "#f5f5f5",
        height:"100%",
        maxHeight:400,
        borderRadius:16,
        borderWidth:1,
        borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5",
      }}
      >
        <View style={styles.imageWrapper}>
          <Text style={styles.imageText}>Default:</Text>
          <Image
            source={{uri:pokemonData?.imageFront||"undefined"}}
            style={{width:"100%",height:"45%"}}
          />
          <Image
            source={{uri:pokemonData?.imageBack||"undefined"}}
            style={{width:"100%",height:"45%"}}
          />
        </View>

        <View style={styles.imageWrapper}>
          <Text style={styles.imageText}>Shiny:</Text>
          <Image
          source={{uri:pokemonData?.sImageFront||"undefined"}}
          style={{width:"100%",height:"45%"}}
          />
          <Image
          source={{uri:pokemonData?.sImageBack||"undefined"}}
          style={{width:"100%",height:"45%"}}
          />
        </View>     
        
        
      </View>

      
    </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  imageWrapper:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-around",
    width:"45%",
    height:"100%",
  },
  imageText:{
    fontSize:16,
    fontWeight:"bold",
    textAlign:"left",
    //backgroundColor:"#f3f3f3",
    color:"#333333",
    textShadowColor:"#555555",
    textShadowOffset:{
      width:1,
      height:1
    },
    textShadowRadius:1,
    letterSpacing:1.2,
    marginTop:5,
    fontFamily:"arial",
    fontStyle:"italic",
    width:"100%",


  }
})