import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name:string;
  image:string;
  imageBack:string;
  types: PokemonType[];
}

interface PokemonType{
  type:{
    name:string;
    url:string;
  }
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



export default function Index() {

  const [pokemons, setPokemons]= useState<Pokemon[]>([]);
  const popValue = useRef(new Animated.Value(0)).current;
  
  
  useEffect(() => {
    //popValue.setValue(0);
    Animated.spring(popValue, {
      toValue: 1,         
      friction: 4,        
      tension: 60,        
      useNativeDriver: true,
    }).start();
  }, [pokemons]);



  useEffect(() => {
      //fetching pokemons
      fetchPokemons();

  },[])

  async function fetchPokemons(currentOffset = 0) {
        try{
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${currentOffset}`)
          const data = await response.json()

          const detailedPokemons = await Promise.all(
            data.results.map(async(pokemon: any)=>{
              const res = await fetch(pokemon.url);
              const details = await res.json();
              return{
                name: pokemon.name,
                image: details.sprites.front_default,//main sprite
                imageBack: details.sprites.back_default,//back sprite
                types: details.types,
              }
            })
          )

          console.log(JSON.stringify(detailedPokemons[0], null, 2))

          setPokemons((prevPokemons) => [...prevPokemons, ...detailedPokemons]);
        } catch(e){
          console.log("an error occured:",e)
        }
      }
 
  return (
    <ScrollView contentContainerStyle={{
      gap:16,
      padding:16,
      backgroundColor:"#f4511e20",
    }}>
      
      {pokemons.map((pokemon)=>(
        
        <Animated.View key = {pokemon.name}
         style={{
          gap:16,
          transform:[{scale:popValue}]
        }}>
        <Link 
          href={{pathname: "/details", params: {name: pokemon.name}}}
          style={{
          //@ts-ignore
          backgroundColor: colorsByType[pokemon.types[0].type.name] +60,
          padding:20,
          borderRadius:16,
        }}
        >
        <View>
          <Text style ={styles.name}>{pokemon.name}</Text>
          <Text style ={styles.type}>{pokemon.types[0].type.name}</Text>
         
          <View style={{
            flexDirection:"row",
            justifyContent:"space-around",
          }}>
            <Image
              source={{uri:pokemon.image}}
              style={{width:150,height:150}}
            />
            <Image
              source={{uri:pokemon.imageBack}}
              style={{width:150,height:150}}
            />
          </View>
        
        </View>
        </Link>
        </Animated.View>
      ))}

      <Pressable
        style={({ pressed }) => [
          styles.loadMoreBtn,
          pressed && styles.loadMoreBtnPressed,
        ]}
        onPress={() =>fetchPokemons(pokemons.length)}
      >
        <Text style={styles.loadMoreBtnText}>Get More Pokemons!</Text>
      </Pressable>
        
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  name:{
    fontSize:28,
    fontWeight:"bold",
    textAlign:"center",
    
  },
  type:{
    fontSize:20,
    fontWeight:"bold",
    color:"grey",
    textAlign:"center",
  },
  loadMoreBtn:{
    borderRadius:12,
    backgroundColor:"#f4511e",
    width:"50%",
    alignSelf:"center",
    padding:8,
  },
  loadMoreBtnPressed:{
    backgroundColor:"#f4511e80",
    transform:[{scale:0.95}]
  },
  loadMoreBtnText:{
    color:"white",
    fontSize:18,
    fontWeight:"bold",
    fontFamily:"arial",
    fontStyle:"italic",
    textAlign:"center",
  }
})