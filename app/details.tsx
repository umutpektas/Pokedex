import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";



export default function Details() {

    const params = useLocalSearchParams();
    const pokemonName= params.name as string;

    console.log(pokemonName)

  
 
  return (
    <>
    <Stack.Screen options={{ 
      title : pokemonName.toUpperCase(),
      headerStyle:{
        backgroundColor:"green",
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