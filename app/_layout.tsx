import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerStyle:{
        backgroundColor:"#f4511e",

      },
      headerTintColor:"#fff",
      headerTitleAlign:"left",
      headerTitleStyle:{
        fontWeight:"bold",
        fontSize:20,
        fontFamily:"arial",
      },
      

    }}
  >
    <Stack.Screen name="index" options ={{title:"Pokedex"}}/>
    <Stack.Screen name="details" options ={{
      title:"Details",
      headerBackButtonDisplayMode:"minimal",
      presentation: "modal",
      }}/>
  </Stack>;
}
