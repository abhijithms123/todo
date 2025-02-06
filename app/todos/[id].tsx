import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput, ColorSchemeName } from "react-native";
import { useState,useEffect,useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import {Inter_500Medium, useFonts} from '@expo-google-fonts/inter';
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Todo } from "@/types/todo";
import { Colors } from "@/constants/Colors";
export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState<Todo>();
    const {colorScheme, setColorScheme,theme} = useContext(ThemeContext);
    const router = useRouter();
 
    const [loaded, error] = useFonts({
        Inter_500Medium,
      })
    
    useEffect(() => {
         const fetchData = async (id: string) => {
            try {
                 const jsonValue = await AsyncStorage.getItem("TodoApp")
                 const storageTodos = jsonValue != null? JSON.parse(jsonValue): null;
                 if(storageTodos && storageTodos.length){
                    const myTodo = storageTodos.find((todo:Todo) => todo.id.toString()===id);
                    setTodo(myTodo);
                 }
            }
            catch(e){
                console.error(e);
                
            }
         }
         fetchData(id.toString());
    },[id])

    if(!loaded && !error) {
        return null;
      }
      
      const styles = createStyles(theme, colorScheme);
      

      const handleSave = async () => {
        try {
           const savedTodo = {...todo,title: todo!.title
           };
           const jsonValue = await AsyncStorage.getItem("TodoApp");
           const storageTodos = jsonValue != null? JSON.parse(jsonValue): null;
           
           if(storageTodos && storageTodos.length){
            const otherTodos = storageTodos.filter((todo:Todo) => todo.id !== savedTodo.id);
            const allTodos = [...otherTodos, savedTodo]
            await AsyncStorage.setItem("TodoApp",JSON.stringify(allTodos))
           }
           else{
            await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]))
           }

           router.push("/");
           
        }
        catch(e){
            console.error(e);
            
        }
      }

    return (
        <SafeAreaView style={styles.container}>
           <View style={styles.inputContainer}>
               <TextInput
               style = {styles.input}
               maxLength={30}
               placeholder="Edit Todo"
               placeholderTextColor="gray"
               value={todo?.title || ""}
               onChangeText={(text:string) => setTodo(prev =>({...prev!,title:text}))}/>
                <Pressable
            onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
          >
            {colorScheme === 'dark' ? (
              <Octicons name="moon" size={36} color="white" selectable={undefined} />
            ) : (
              <Octicons name="sun" size={36} color="black" selectable={undefined} />
            )}
          </Pressable>
           </View>
           <View style={styles.inputContainer}>
            <Pressable
            onPress={handleSave}
            style={styles.saveButton}>
                <Text style={[styles.saveButtonText, { color: 'white' }]}>Save</Text>
            </Pressable>
            <Pressable  
            onPress={() => router.push('/')}
            style={[styles.saveButton, 
            { backgroundColor: 'red' }]}>
             <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
            </Pressable>
           </View>
           <StatusBar style = {colorScheme === "dark" ? "light": "dark"} />
        </SafeAreaView>
    )
}

function createStyles(theme:typeof Colors.light | typeof Colors.dark,colorScheme:ColorSchemeName) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        input: {
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            minWidth: 0,
            color: theme.text,
        },
        saveButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        }
    })
}