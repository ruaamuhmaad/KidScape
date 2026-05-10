import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../services/authService';

export default function Login() {
    const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = (): void => {
    login(email, password)
      .then(() => {
        router.replace('/home' as any);
      })
      .catch((error: any) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Login</Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter email"
        style={styles.input}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          onChangeText={setPassword}
        />

        <Text onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? '🙈' : '👁️'}
        </Text>
      </View>

      {/* Remember + Forgot */}
      <View style={styles.row}>

        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRemember(!remember)}
        >
          <Text>{remember ? '☑' : '⬜'}</Text>
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>

        <Text
          style={styles.forgot}
          onPress={() => router.push('/reset-password' as any)}
        >
          Forgot your password?
        </Text>

      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Social */}
      <Text style={styles.signIn}>Sign in with</Text>

      <View style={styles.socialRow}>
        <View style={styles.circle}>
          <FontAwesome name="whatsapp" size={24} color="#25D366" />
        </View>

        <View style={styles.circle}>
          <FontAwesome name="google" size={22} color="#DB4437" />
        </View>
      </View>

      {/* Sign Up */}
      <Text style={styles.footer}>
        Don’t have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/signup' as any)}>
          Sign up
        </Text>
      </Text>

      {/* Guest */}
      <Text style={styles.guest} onPress={() => router.push('/home' as any)}>
        Or log in as a guest?
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9edf0',
    padding: 20,
    paddingTop: 80
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },

  label: {
    marginBottom: 5
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15
  },

  passwordInput: {
    flex: 1,
    padding: 12
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  rememberContainer: {
    flexDirection: 'row'
  },

  rememberText: {
    marginLeft: 5
  },

  forgot: {
    fontSize: 12
  },

  button: {
    backgroundColor: '#1f3c4c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff'
  },
  signIn: {
    textAlign: 'center',
    marginTop: 20
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },

  footer: {
    textAlign: 'center',
    marginTop: 20
  },

  link: {
    color: '#1f3c4c',
    fontWeight: 'bold'
  },

  guest: {
    textAlign: 'center',
    marginTop: 10
  }
});
