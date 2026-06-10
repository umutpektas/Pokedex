import { Link, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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

const { height: screenHeight } = Dimensions.get("window");

export default function Index() {

  const [pokemons, setPokemons]= useState<Pokemon[]>([]);
  const popValue = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  

  const handleToggle = () => {
    setIsExpanded(prevState => !prevState);
  };
  
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
    <>
    <Stack.Screen options={{ headerShown:false }} 
   
    />

    <View style={styles.container}>

      <View style={styles.circleHeaderLeft}>
          <Text style={styles.headerTitle}>Pokedex</Text>
      </View>


      
      <Pressable
        onPress={handleToggle}
        //@ts-ignore
        style={({ pressed }) => [
          styles.circleHeaderRight,
          isExpanded ? styles.circleHeaderRightPressed : styles.circleHeaderRight,
          pressed
        ]}
      >
        {!isExpanded&&(
          <Text style={styles.headerTitle}>Filters</Text>
        )}
        
        {isExpanded&&(
          <Text style={styles.expandedHeaderTitle}>Search:</Text>
        )}
        {isExpanded&&(
          <Text style={styles.expandedHeaderTitle}>By Type</Text>
        )}
        {isExpanded&&(
          <Text style={styles.expandedHeaderTitle}>A-Z</Text>
        )}
        {isExpanded&&(
          <Text style={styles.expandedHeaderTitle}>Z-A</Text>
        )}
       
        
      </Pressable>

    </View>


    <ScrollView contentContainerStyle={{
      gap:16,
      padding:16,
      backgroundColor:"#f4511e20",
      paddingTop:100,
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
    </>
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
  },


  container: {
    flex: 1,
    width:"100%", 
    position:"relative",
    //flexWrap:"wrap",
  },
  circleHeaderLeft: {
    backgroundColor: "#f4511e",
    position: "absolute",
    left:0,
    // Make width and height large so it crops out smoothly
    width: "55%",                // Doesn't cover full width across top right
    height: 80,                 // Controls depth down the screen canvas
    borderBottomRightRadius: 160, // Large radius gives it that organic circular arc feel
    paddingHorizontal: 24,
    justifyContent: "center",
    zIndex:10,
    
    // Optional shadow properties for depth over background contents
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  circleHeaderRight: {
    backgroundColor: "#f4511e",
    position: "absolute",
    right:0,
    // Make width and height large so it crops out smoothly
    width: "55%",                // Doesn't cover full width across top right
    height: 80,                 // Controls depth down the screen canvas
    borderBottomLeftRadius: 160, // Large radius gives it that organic circular arc feel
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems:"flex-end",
    zIndex:9,
    
    // Optional shadow properties for depth over background contents
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  circleHeaderRightPressed:{
    height: screenHeight*0.5 ,
    zIndex:10,
    alignItems:"flex-start",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginTop: 10,              // Positions title comfortably below status area
  },
  expandedHeaderTitle:{
    color:"#fff",
    fontSize:18,
    fontWeight:"bold",
    marginTop:20,
    letterSpacing:1.2,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  bodyText: {
    fontSize: 16,
    color: "#333",
  }
})