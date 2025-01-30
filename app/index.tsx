import { Text, View, TextInput, Pressable, StyleSheet, FlatList, ColorSchemeName } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { data } from "@/data/todos";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Inter_500Medium, useFonts} from '@expo-google-fonts/inter';
import  Animated, {LinearTransition} from "react-native-reanimated";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/constants/Colors";
export default function Index() {
   
  const [todos, setTodos] = useState(data.sort((a,b) => b.id - a.id));
  const [text, setText] = useState('');
  const {colorScheme, setColorScheme,theme} = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  if(!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme,colorScheme);

  const addTodo = () => {
    if(text.trim()){
      const newId = todos.length > 0 ? todos[0].id + 1: 1;
      setTodos([{id: newId, title: text, isCompleted: false}, ...todos]);
      setText('');
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    )
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.isCompleted && styles.completedText]}
        onPress={() => toggleTodo(item.id)}>
        {item.title}
      </Text>
      <Pressable>
        <MaterialCommunityIcons name="delete-circle" size={30} color="red" selectable={undefined} onPress={() => removeTodo(item.id)}/>
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* <View><Text>Appweaver Todo</Text></View> */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input}
        placeholder="Add a new Todo"
        placeholderTextColor="gray"
        value={text}
        onChangeText={setText}/>
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable 
        style={{marginLeft: 10}} 
        onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
          {colorScheme === 'dark' ? <Octicons name="moon" size={36} color="white" selectable={undefined} style={{width: 36   }}/> : <Octicons name="sun" size={36} color="black" selectable={undefined} />}
          </Pressable>
      </View>
      <Animated.FlatList
       data={todos}
       renderItem={ renderItem}
       keyExtractor={todo=>todo.id.toString()}
       contentContainerStyle={{flexGrow: 1, padding: 10}}
       itemLayoutAnimation={LinearTransition}
       keyboardDismissMode="on-drag"/>

    </SafeAreaView>
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
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily:"Inter_500Medium",
      minWidth:0,
      color: theme.text
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto"
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
      padding: 10,
      maxWidth: 1024,
      marginHorizontal: "auto",
      // borderBottomColor: "gray",
      // borderBottomWidth: 1,
      width: "100%",
      pointerEvents: "auto"
    }
  ,
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
      fontFamily:"Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    }
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
