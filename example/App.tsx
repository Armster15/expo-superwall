import { StyleSheet, Text, View } from 'react-native';

import * as ExpoSuperwall from 'expo-superwall';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoSuperwall.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
