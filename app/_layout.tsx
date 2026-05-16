
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AppQueryProvider from '@/providers/QueryProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppQueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="edit-parent-profile" />
          <Stack.Screen name="child-management" />
          <Stack.Screen name="child-list" />
          <Stack.Screen name="add-child" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AppQueryProvider>
  );
}

