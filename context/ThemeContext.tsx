import { createContext, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import {Colors} from '../constants/Colors'

type ThemeContextType = {
    colorScheme: ColorSchemeName;
    setColorScheme: (scheme: 'light' | 'dark') => void;
    theme: typeof Colors.light | typeof Colors.dark;
  };

// export const ThemeContext = createContext({});

// Create the context with the defined type
export const ThemeContext = createContext<ThemeContextType>({
    colorScheme: 'light', // Default value
    setColorScheme: () => {}, // Default function
    theme: Colors.light, // Default theme
  });

export const ThemeProvider = ({ children }: any) => {
    const [colorScheme, setColorScheme] = useState(Appearance.
        getColorScheme());

    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    return (
        <ThemeContext.Provider value={{colorScheme, setColorScheme,theme}}>{children}</ThemeContext.Provider>
    )


}     