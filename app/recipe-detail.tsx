import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '../src/constants/tokens';

export default function RecipeDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recipe Detail</Text>
      <Text style={styles.sub}>Full recipe goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.textPrimary,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.black,
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    marginTop: Spacing[2],
  },
});
