import { Text, View, TextInput, Pressable, StyleSheet,ColorSchemeName } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { data } from "@/data/todos";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Inter_500Medium, useFonts} from '@expo-google-fonts/inter';
import  Animated, {FadeIn, FadeOut, LinearTransition} from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { useRouter} from "expo-router";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import DropdownMenu from "@/components/DropdownMenu";
import MenuOption from "@/components/MenuOption"
export default function Index() {
   
  const [todos, setTodos] = useState(data.sort((a,b) => b.id - a.id));
  const [text, setText] = useState('');
  const {colorScheme, setColorScheme,theme} = useContext(ThemeContext);
  const router = useRouter();
  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
         const jsonValue = await AsyncStorage.getItem("TodoApp")
         const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
         if(storageTodos && storageTodos.length){
              setTodos(storageTodos.sort((a: { id: number; },b: { id: number; }) => b.id - a.id));
         }
         else {
          setTodos(data.sort((a,b) => b.id - a.id));
         }

        }
      catch(e){
        console.error(e);
      }
    }
    fetchData();
  },[data]);

  useEffect(() => {
      const storeData = async () => {
        try {
              const jsonValue = JSON.stringify(todos);
              await AsyncStorage.setItem("TodoApp", jsonValue);
        }
        catch(e){
          console.error(e);
          
        }
      }
      storeData();
  }, [todos])

  if(!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme,colorScheme);

  const addTodo = () => {
    if(text.trim()){
      const newId = todos.length > 0 ? todos[0].id + 1: 1;
      setTodos([{
        id: newId, title: text, isCompleted: false,
      }, ...todos]);
      setText('');
    }
  }

  const updateTodo = (id:number,text:string) => {
    setText(text);
    setTodos(
      todos.map((todo)=>todo.id === id? {...todo,title: text}:todo)
    );
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  const toggleDropdown = (id: number) => {
    console.log("inside toggle dropdown");
    
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, dropdownVisible: true } : todo
      )
    );
  }

  const closeAllDropdowns = () => {
    setTodos(todos.map(todo => ({ ...todo, dropdownVisible: false})));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  const handleLongPress = (id: number) => {
    router.push(`/todos/${id}`);
    // router.push("/todos/[id]",);
  }

  const renderItem = ({ item }: any) => (
    <Animated.View 
    entering={FadeIn.duration(500)}
    exiting={FadeOut.duration(300)}
    style={styles.todoItem}>
      <Pressable onPress={() => toggleTodo(item.id)}
        onLongPress={() => handleLongPress(item.id)}>
      <Text
        style={[styles.todoText, item.isCompleted && styles.completedText]}
        >
        {item.title}
      </Text>
      </Pressable>
      <Pressable>
        <MaterialCommunityIcons name="delete-circle" size={30} color="red" selectable={undefined} onPress={() => removeTodo(item.id)} />
      </Pressable>
      {/* <View style={{marginRight:20}}> */}
        {/* <DropdownMenu
       visible={item.dropdownVisible}
       handleOpen={() => toggleDropdown(item.id)}
       handleClose={() => closeAllDropdowns}
       trigger = {
        <View>
          <MaterialCommunityIcons name="menu" size={24} color="purple" />
        </View>
       }
       dropdownWidth={100}
      >
        <MenuOption onSelect={()=>{
          closeAllDropdowns();
          // Handle edit logic
        }}>
             <Text>Edit</Text>
        </MenuOption >
        <MenuOption onSelect={()=>{
           closeAllDropdowns();
           removeTodo(item.id);
        }}>
           <Text>Delete</Text>
        </MenuOption>
      </DropdownMenu> */}
      {/* </View> */}
      
    </Animated.View>
  )

  return (
    <LinearGradient
      colors={[theme.background, theme.backgroundSecondary]}
      style={styles.container}
    >
    <SafeAreaView style={styles.container}>
      {/* <View><Text>Appweaver Todo</Text></View> */}
      <View style={styles.header}>
          <Text style={styles.headerText}>Todo App</Text>
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
        <TextInput style={styles.input}
        maxLength={30}
        placeholder="Add a new Todo"
        placeholderTextColor="gray"
        value={text}
        onChangeText={setText}/>
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        {/* <Pressable 
        style={{marginLeft: 10}} 
        onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
          {colorScheme === 'dark' ? <Octicons name="moon" size={36} color="white" selectable={undefined} style={{width: 36   }}/> : <Octicons name="sun" size={36} color="black" selectable={undefined} />}
          </Pressable> */}
      </View>
      <Animated.FlatList
       data={todos}
       renderItem={ renderItem}
       keyExtractor={todo=>todo.id.toString()}
       contentContainerStyle={{flexGrow: 1, padding:10}}
       itemLayoutAnimation={LinearTransition}
       keyboardDismissMode="on-drag"/>
       <StatusBar style={colorScheme == "dark" ?"light":"dark"} />
    </SafeAreaView>
    </LinearGradient>
  );
}

function createStyles(theme:typeof Colors.light | typeof Colors.dark,colorScheme:ColorSchemeName) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginRight: 10,
      fontSize: 16,
      fontFamily:"Inter_500Medium",
      backgroundColor: theme.inputBackground,
      color: theme.text
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      width: "100%",
      maxWidth: 1024,
      backgroundColor: theme.inputBackground,
      borderBottomWidth:1,
      borderBottomColor:theme.border,
      marginHorizontal: "auto",
      pointerEvents: "auto"
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      elevation:3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    addButtonText: {
      fontSize: 16,
      // color: colorScheme === "dark" ? "black" : "white",
      color: theme.buttonText,
      fontFamily:"Inter_500Medium",
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // gap: 20,
      padding: 16,
      marginHorizontal: "auto",
      marginVertical: 8,
      backgroundColor: theme.itemBackground,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      maxWidth: 1024,
      width: "100%",
      pointerEvents: "auto"
    }
  ,
    todoText: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      fontFamily:"Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: theme.completedText,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.headerBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: 'Inter_500Medium',
    },
  })
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black"
//   },
//   input: {
//     flex: 1,
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     fontSize: 18,
//     fontFamily:"Inter_500Medium",
//     minWidth:0,
//     color: "white"
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     padding: 10,
//     width: "100%",
//     maxWidth: 1024,
//     marginHorizontal: "auto",
//     pointerEvents: "auto"
//   },
//   addButton: {
//     backgroundColor: "white",
//     borderRadius: 5,
//     padding: 10,
//   },
//   addButtonText: {
//     fontSize: 18,
//     color: "black",
//   },
//   todoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 4,
//     padding: 10,
//     maxWidth: 1024,
//     marginHorizontal: "auto",
//     borderBottomColor: "gray",
//     borderBottomWidth: 1,
//     width: "100%",
//     pointerEvents: "auto"
//   }
// ,
//   todoText: {
//     flex: 1,
//     fontSize: 18,
//     color: "white",
//     fontFamily:"Inter_500Medium",
//   },
//   completedText: {
//     textDecorationLine: "line-through",
//     color: "gray",
//   }
// })
