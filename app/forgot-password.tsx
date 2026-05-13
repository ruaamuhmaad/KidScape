import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getFirebaseAuth } from '../firebase/config';

export default function ForgotPassword() {
  const router = useRouter();
  const { method: initialMethod } = useLocalSearchParams<{ method?: string }>();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialMethod === 'email' || initialMethod === 'phone') {
      setMethod(initialMethod);
      setValue('');
    }
  }, [initialMethod]);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\s/g, '');
    return /^[0-9+]{8,15}$/.test(cleanedPhone);
  };

  const handleSendCode = async () => {
    const inputValue = value.trim();

    if (inputValue === '') {
      alert(
        method === 'email'
          ? 'Please enter your email'
          : 'Please enter your phone number'
      );
      return;
    }

    if (method === 'email') {
      if (!isValidEmail(inputValue)) {
        alert('Please enter a valid email address');
        return;
      }

      try {
        setLoading(true);

        await sendPasswordResetEmail(getFirebaseAuth(), inputValue);

        router.push({
          pathname: '/reset-password',
          params: {
            value: inputValue,
          },
        } as any);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }

      return;
    }

    if (method === 'phone') {
      if (!isValidPhone(inputValue)) {
        alert('Please enter a valid phone number');
        return;
      }

      router.push({
        pathname: '/verify-code',
        params: {
          value: inputValue,
        },
      } as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Image
          source={require('../assets/images/lock.png')}
          style={styles.lockImage}
        />

        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.description}>
          Don’t worry, choose how you want to reset your password
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              method === 'email' && styles.activeToggle,
            ]}
            onPress={() => {
              setMethod('email');
              setValue('');
            }}
          >
            <Text
              style={[
                styles.toggleText,
                method === 'email' && styles.activeToggleText,
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              method === 'phone' && styles.activeToggle,
            ]}
            onPress={() => {
              setMethod('phone');
              setValue('');
            }}
          >
            <Text
              style={[
                styles.toggleText,
                method === 'phone' && styles.activeToggleText,
              ]}
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formBox}>
          <Text style={styles.inputLabel}>
            {method === 'email'
              ? 'Enter your email address'
              : 'Enter your phone number'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={
              method === 'email'
                ? 'example@email.com'
                : '+970 59 000 0000'
            }
            placeholderTextColor="#b0b8bd"
            keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
            value={value}
            onChangeText={setValue}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.disabledButton]}
            onPress={handleSendCode}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>
              {loading
                ? 'Sending...'
                : method === 'email'
                  ? 'Send Reset Email'
                  : 'Send Verification Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={14} color="#123746" />
          <Text style={styles.backText}>Back to Login</Text>
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

  lockImage: {
    width: 78,
    height: 78,
    resizeMode: 'contain',
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#123746',
    marginBottom: 8,
    textAlign: 'center',
  },

  description: {
    fontSize: 12,
    color: '#4f626b',
    textAlign: 'center',
    marginBottom: 22,
  },

  toggleContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 16,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
  },

  activeToggle: {
    backgroundColor: '#123746',
  },

  toggleText: {
    color: '#123746',
    fontSize: 12,
    fontWeight: '600',
  },

  activeToggleText: {
    color: '#fff',
  },

  formBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 5,
  },

  inputLabel: {
    color: '#123746',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e8',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginBottom: 12,
    color: '#123746',
  },

  sendButton: {
    backgroundColor: '#123746',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  sendButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 8,
  },

  backText: {
    color: '#123746',
    fontSize: 13,
    fontWeight: '600',
  },
});