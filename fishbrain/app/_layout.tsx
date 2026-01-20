import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../src/context/GameContext';
import { THEME } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: THEME.background },
          animation: 'fade',
        }}
      />
    </GameProvider>
  );
}
