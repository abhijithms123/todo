import { ReactNode, } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

interface MenuOptionProps {
    onSelect: () => void;
    children: ReactNode
}
const MenuOption = ({ onSelect, children }: MenuOptionProps) => {
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



