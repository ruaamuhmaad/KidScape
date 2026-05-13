import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function VerifyCode() {
  const router = useRouter();
  const { value } = useLocalSearchParams<{ value?: string }>();

  const [code, setCode] = useState<string[]>(['', '', '', '']);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '');

    const newCode = [...code];
    newCode[index] = digit.slice(-1);
    setCode(newCode);

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const finalCode = code.join('');

    if (finalCode.length < 4) {
      alert('Please enter the 4-digit verification code');
      return;
    }

    alert('Code verified successfully');

    router.replace('/login' as any);
  };

  const handleTryAnotherWay = () => {
    router.replace({
      pathname: '/forgot-password',
      params: {
        method: 'email',
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.iconCircle}>
          <FontAwesome name="mobile" size={48} color="#2f7fa7" />

          <View style={styles.messageBadge}>
            <FontAwesome name="comment" size={16} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Verify Your Phone</Text>

        <Text style={styles.description}>
          We sent a 4-digit code to {value ? value : 'your phone number'}
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Verification code resent')}>
          <Text style={styles.resend}>Resend Code</Text>
        </TouchableOpacity>

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
    padding: 22,
    alignItems: 'center',
  },

  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },

  messageBadge: {
    position: 'absolute',
    right: 8,
    bottom: 13,
    width: 26,
    height: 20,
    borderRadius: 5,
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
    marginBottom: 30,
  },

  codeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
  },

  codeInput: {
    width: 46,
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#123746',
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

  resend: {
    fontSize: 12,
    color: '#6b7c85',
    marginBottom: 28,
  },

  link: {
    fontSize: 13,
    color: '#123746',
    fontWeight: '700',
  },
});