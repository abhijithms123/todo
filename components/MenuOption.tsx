import { ReactNode ,} from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

const MenuOption = ({onSelect,children}:{onSelect: ()=> void; children: ReactNode}) => {
      return (
        <TouchableOpacity onPress={onSelect} style={styles.menuOption}>{children}</TouchableOpacity>
      );
}

export default MenuOption;

const styles = StyleSheet.create({ 
    menuOption: {
        padding: 5,
    }
});



