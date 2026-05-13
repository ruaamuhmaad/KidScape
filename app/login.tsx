import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../services/authService';

const REMEMBER_EMAIL_KEY = 'rememberedEmail';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(REMEMBER_EMAIL_KEY);

        if (savedEmail) {
          setEmail(savedEmail);
          setRemember(true);
        }
      } catch {
        console.log('Unable to load remembered email');
      }
    };

    loadRememberedEmail();
  }, []);

  const getLoginErrorMessage = (error: any): string => {
    const code = error?.code;

    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }

    if (code === 'auth/user-not-found') {
      return 'No account found with this email.';
    }

    if (code === 'auth/wrong-password') {
      return 'Incorrect password. Please try again.';
    }

    if (code === 'auth/invalid-credential') {
      return 'Invalid email or password.';
    }

    if (code === 'auth/too-many-requests') {
      return 'Too many attempts. Please try again later.';
    }

    return error?.message || 'Login failed. Please try again.';
  };

  const handleLogin = useCallback(async (): Promise<void> => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      alert('Please enter your email.');
      return;
    }

    if (!password) {
      alert('Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      await login(cleanEmail, password);

      if (remember) {
        await AsyncStorage.setItem(REMEMBER_EMAIL_KEY, cleanEmail);
      } else {
        await AsyncStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      router.replace('/home' as any);
    } catch (error: any) {
      alert(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [email, password, remember, router]);

  const handleToggleRemember = useCallback(() => {
    setRemember((prev) => !prev);
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter password"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />

        <Text onPress={handleTogglePassword}>
          {showPassword ? '🙈' : '👁️'}
        </Text>
      </View>

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={handleToggleRemember}
        >
          <Text>{remember ? '☑' : '⬜'}</Text>
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>

        <Text
          style={styles.forgot}
          onPress={() => router.push('/forgot-password' as any)}
        >
          Forgot your password?
        </Text>

      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSection}>

        <Text style={styles.signIn}>Sign in with</Text>

        <View style={styles.socialRow}>
          <View style={styles.circle}>
            <FontAwesome name="whatsapp" size={24} color="#25D366" />
          </View>

          <View style={styles.circle}>
            <FontAwesome name="google" size={22} color="#DB4437" />
          </View>
        </View>

        <Text style={styles.footer}>
          Don’t have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/signup' as any)}>
            Sign up
          </Text>
        </Text>

        <Text style={styles.guest} onPress={() => router.push('/home' as any)}>
          Or log in as a guest?
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9edf0',
    padding: 20,
    paddingTop: 80,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  rememberContainer: {
    flexDirection: 'row',
  },

  rememberText: {
    marginLeft: 5,
  },

  forgot: {
    fontSize: 12,
  },

  button: {
    backgroundColor: '#1f3c4c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
  },

  bottomSection: {
    marginTop: 80,
  },

  signIn: {
    textAlign: 'center',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  footer: {
    textAlign: 'center',
    marginTop: 20,
  },

  link: {
    color: '#1f3c4c',
    fontWeight: 'bold',
  },

  guest: {
    textAlign: 'center',
    marginTop: 10,
  },
});