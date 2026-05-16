import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResetPassword() {
  const router = useRouter();
  const { value } = useLocalSearchParams<{ value?: string }>();

  const handleTryAnotherWay = () => {
    router.replace({
      pathname: '/forgot-password',
      params: {
        method: 'phone',
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.iconCircle}>
          <FontAwesome name="envelope-o" size={42} color="#2f7fa7" />

          <View style={styles.smallBadge}>
            <FontAwesome name="check" size={12} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Check Your Email</Text>

        <Text style={styles.description}>
          We sent a password reset link to your email address.
        </Text>

        {value ? (
          <Text style={styles.emailText}>{value}</Text>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Please open your email and click the reset link to create a new password.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/login' as any)}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>

        <Text style={styles.question}>Didn’t receive anything?</Text>

        <TouchableOpacity onPress={handleTryAnotherWay}>
          <Text style={styles.link}>Try another way</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f5f7',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  card: {
    backgroundColor: '#d4dde2',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },

  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    position: 'relative',
  },

  smallBadge: {
    position: 'absolute',
    right: 5,
    top: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#123746',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#123746',
    textAlign: 'center',
    marginBottom: 10,
  },

  description: {
    fontSize: 12,
    color: '#4f626b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },

  emailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#123746',
    textAlign: 'center',
    marginBottom: 14,
  },

  infoBox: {
    width: '100%',
    backgroundColor: '#b8c8d0',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    marginBottom: 22,
  },

  infoText: {
    fontSize: 12,
    color: '#123746',
    textAlign: 'center',
    lineHeight: 19,
  },

  button: {
    width: '100%',
    backgroundColor: '#123746',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  question: {
    fontSize: 12,
    color: '#6b7c85',
    marginBottom: 14,
  },

  link: {
    fontSize: 13,
    color: '#123746',
    fontWeight: '700',
  },
});