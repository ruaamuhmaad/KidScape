import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../services/authService';

export default function SignUp() {

  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergency, setEmergency] = useState('');
  const [city, setCity] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSignUp = () => {

    if (!agree) {
      alert("Please agree to the privacy policy");
      return;
    }

    signUp(email, password)
      .then(() => {
        alert("Account created ✅");
        router.replace('/login' as any);
      })
      .catch((error: unknown) => {
        alert(error instanceof Error ? error.message : 'Unable to create account');
      });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign up</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full name</Text>
      <TextInput
        placeholder="Enter your full name"
        style={styles.input}
        onChangeText={setFullName}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      {/* Mobile */}
      <Text style={styles.label}>Phone number</Text>
      <TextInput
        placeholder="Enter Phone number"
        style={styles.input}
        onChangeText={setMobile}
      />

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        placeholder="Enter your Address"
        style={styles.input}
        onChangeText={setCity}
      />

      {/* Emergency */}
      <Text style={styles.label}>Emergency number</Text>
      <TextInput
        placeholder="Enter emergency number"
        style={styles.input}
        onChangeText={setEmergency}
      />

      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgree(!agree)}
      >
        <Text style={styles.checkbox}>
          {agree ? '☑' : '⬜'}
        </Text>
        <Text style={styles.checkboxText}>
          I agree to the privacy policy.
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* 🔥 Back to Login */}
      <Text
        style={styles.back}
        onPress={() => router.back()}
      >
        ← Back to Login
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

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },

  checkbox: {
    marginRight: 5
  },

  checkboxText: {
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

  back: {
    textAlign: 'center',
    marginTop: 15,
    color: '#1f3c4c'
  }
})