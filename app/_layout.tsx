import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ingredient-review" />
      <Stack.Screen name="recipe-suggestions" />
      <Stack.Screen name="recipe-detail" />
    </Stack>
  );
}
