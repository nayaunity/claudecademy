import { Stack } from 'expo-router';
import { THEME } from '../../src/constants/theme';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: THEME.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
