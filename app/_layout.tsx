import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from "../store";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found"/>
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="list" options={{ title: "목록", headerBackButtonDisplayMode: "minimal"}}/>
          <Stack.Screen name="[id]" options={{ title: "상세", headerBackButtonDisplayMode: "minimal"}}/>
          <Stack.Screen name="write" options={{ title: "작성", headerBackButtonDisplayMode: "minimal"}}/>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider></Provider>
  );
}
