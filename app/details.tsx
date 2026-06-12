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
  weight: number;
  description: string;
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

    async function fetchPokemonDescription(pokemonName: string): Promise<string> {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`);
        if (!response.ok) return "No description available.";

        const speciesDetails = await response.json();
        
        // Find the English entry
        const englishEntry = speciesDetails.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        );

        if (englishEntry) {
          // Clean up legacy ROM formatting characters (\f, \n, etc.)
          return englishEntry.flavor_text
            .replace(/\f/g, '\n')
            .replace(/\u00ad\n/g, '')
            .replace(/\u00ad/g, '')
            .replace(/ \n/g, ' ')
            .replace(/\n/g, ' ');
        }
        return "No English description available.";
      } catch {
        return "Error fetching description.";
      }
    }  


  

    async function fetchPokemons(pokemonName: string) {
        try{
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
          const details = await response.json()
          const description = await fetchPokemonDescription(pokemonName);

          const pokemonData = {
              abilities: details.abilities.map((abilityInfo:any)=>abilityInfo.ability.name),
              imageFront:details.sprites.front_default,
              sImageFront:details.sprites.front_shiny,
              imageBack:details.sprites.back_default,
              sImageBack:details.sprites.back_shiny,
              types: details.types.map((typeInfo:any) => typeInfo.type.name),
              weight: details.weight/10,
              description: description,
          }
          setPokemonData(pokemonData);
          console.log(JSON.stringify(pokemonData, null, 2))

        } catch(e){
          console.log("an error occured:",e)
        }
      }

    const typeName1= pokemonData?.types[0].toUpperCase()||""
    const typeName2 = pokemonData?.types[1]?.toUpperCase() ?? "---";
    const abilityName1 = pokemonData?.abilities[0]?.charAt(0).toUpperCase() + pokemonData?.abilities[0]?.slice(1).toLowerCase();
    const abilityName2 = pokemonData?.abilities[1]?.charAt(0).toUpperCase() + pokemonData?.abilities[1]?.slice(1).toLowerCase();


 
  return (
    <>
    <Stack.Screen options={{ 
      title : "Pokemon Card",
      headerStyle:{
        backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5",
      }
    
    }} 
   
    />


    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{
      gap:16,
      padding:16, 
      backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "25" : "#f5f5f5",
      width:"100%",      
      flexGrow:1,
      
    }}>
      <View style={{
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-around",
        padding:10,
        backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "55" : "#f5f5f5",
        //height:"100%",
        minHeight:300,
        borderRadius:16,
        borderWidth:1,
        borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5",
        boxShadow:"0px 4px 10px 2px rgba(0,0,0,0.35)",
        //marginTop:50,
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

      <View style={[styles.descriptionContainer, 
        {backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "55" : "#f5f5f5",
         borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5", 
        }]}>
        <Text style={styles.descriptionHeader}>{pokemonName.toUpperCase()}</Text>
        <View style={[styles.divider,]}></View>
        <Text style={styles.description}>{pokemonData?.description || "No description available"}</Text>

      </View>

      <View style={styles.detailsType}>
          <Text style={[styles.textTypes,
            {backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]]:"#3333"}]}> 
              {typeName1}
          </Text>
          <Text style={[styles.textTypes,
            {backgroundColor:pokemonData?.types[1] ? colorsByType[pokemonData?.types[1]]:"#3333"}]}>
              {typeName2}
          </Text>
      </View>

      <View style={[styles.weightContainer, 
        {backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "55" : "#f5f5f5",
         borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5", 
        }]}>
        <Text style={styles.weightText}>Weight: {pokemonData?.weight} KG</Text>
        {/* <Text></Text> */}
      </View>

      <View style={[styles.abilitiesContainer,{backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "55" : "#f5f5f5",
         borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] : "#f5f5f5", 
        }]}>
        <Text style={[styles.abilitiesText,]}>Abilities</Text>
          <View style={[styles.divider,]}></View>
          <View style={[styles.abilitiesWrapper,
            {borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]]:"#f5f5f5",
              backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "25" : "#f5f5f5"
            }]}>
            <Text style={[styles.abilitiesHeader,]}>{abilityName1||"---"}</Text>
            <Text style={[styles.abilitiesInnerText,]}></Text>
          </View>
          <View style={[styles.abilitiesWrapper,
            {borderColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]]:"#f5f5f5",
              backgroundColor:pokemonData?.types[0] ? colorsByType[pokemonData?.types[0]] + "25" : "#f5f5f5"

            }]}>
            <Text style={[styles.abilitiesHeader,]}>{abilityName2||"---"}</Text>
            <Text style={[styles.abilitiesInnerText,]}>lorem10</Text>
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
  },

  descriptionContainer:{
    flexDirection:"column",
    padding:24,
    //backgroundColor:"#f5f5f5",
    borderWidth:1,
    borderColor:"#3333",
    borderRadius:16,
    boxShadow:"0px 4px 10px 2px rgba(0,0,0,0.35)",
  },
  descriptionHeader:{
    //padding:12,
    //paddingBottom:8,
    fontSize:24,
    fontWeight:"bold",
    color:"#111111",
    letterSpacing:1,
  },
  description:{
    fontSize:16,
    padding:6,
    paddingLeft:0,
    color:"#333333",
    letterSpacing:.5,
  },


  detailsType:{
    //flex:1,
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"flex-start",
    //justifyContent:"space-around",
    //width:"100%",
    //borderWidth:1,
    //borderColor:"#3333",
    

  },
  textTypes:{
    fontSize:16,
    fontWeight:"bold",
    letterSpacing:.5,
    fontStyle:"italic",
    textAlign:"center",
    width:"30%",
    padding:12,
    marginRight:15,
    borderRadius:160,
    color:"#ffff",
    boxShadow:"0px 4px 10px 1px rgba(0,0,0,0.35)",
    
  },

  weightContainer:{
    flexDirection:"column",
    padding:12,
    marginTop:12,
    marginBottom:24,
    borderWidth:1,
    borderRadius:160,
    width:"45%",
    alignItems:"center",
    boxShadow:"0px 4px 10px 2px rgba(0,0,0,0.35)",
  },
  weightText:{
    fontSize:16,
    fontWeight:"bold",
    color:"#111111",
    letterSpacing:.4,    
  },

  abilitiesContainer:{
    flexDirection:"column",
    padding:12,
    borderWidth:1,
    borderRadius:16,
    width:"100%",
    boxShadow:"0px 4px 10px 2px rgba(0,0,0,0.35)",
    
  },

  abilitiesText:{
    fontSize:22,
    fontWeight:"bold",
    //paddingBottom:2,
    paddingLeft:8,
    letterSpacing:.5,
    fontStyle:"italic",
    textAlign:"left",
  },
  divider:{
    height:1,
    width:"75%",
    backgroundColor:"#333333",
    borderRadius:160,
    borderWidth:1,
    marginBottom:8,
  },

  abilitiesHeader:{
    fontSize:18,
    fontWeight:"bold",
  },
  
  abilitiesWrapper:{
    flexDirection:"column",
    padding:8,
    borderLeftWidth:4,
    borderRadius:16,
    width:"100%",
    marginBottom:8,
  },
  abilitiesInnerText:{
    fontSize:16,
    fontStyle:"italic",
    color:"#333333"
  }


  
})