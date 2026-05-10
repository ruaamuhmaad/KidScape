import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Onboarding3() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Let’s go!</Text>

      {/* Description */}
      <Text style={styles.desc}>
        Find activities your children will love, connect with
        other parents, and create lasting memories. Let’s begin!
      </Text>

      {/* Image 🔥 */}
      <Image
        source={require('../assets/images/onboarding3.png')}
        style={styles.image}
      />

      {/* Dots */}
      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/login' as any)}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f5f7',
    paddingTop: 80,
    paddingHorizontal: 20
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f3c4c',
    textAlign: 'center',
    marginBottom: 15
  },

  desc: {
    textAlign: 'center',
    color: '#6b7c85',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10
  },

  image: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    marginBottom: 30
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cfd8dc',
    marginHorizontal: 5
  },

  activeDot: {
    backgroundColor: '#1f3c4c',
    width: 10,
    height: 10
  },

  button: {
    backgroundColor: '#1f3c4c',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});