import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../services/authService';

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  emergency: string;
  address: string;
};

export default function SignUp() {
  const router = useRouter();

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      mobile: '',
      emergency: '',
      address: '',
    },
  });

  const getSignUpErrorMessage = (error: any): string => {
    const code = error?.code;

    if (code === 'auth/email-already-in-use') {
      return 'This email is already registered.';
    }

    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }

    if (code === 'auth/weak-password') {
      return 'Password is too weak. Use at least 6 characters.';
    }

    if (code === 'auth/network-request-failed') {
      return 'Network error. Please check your internet connection.';
    }

    return error?.message || 'Unable to create account. Please try again.';
  };

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      if (!agree) {
        alert('Please agree to the privacy policy.');
        return;
      }

      try {
        setLoading(true);

        await signUp({
          email: data.email.trim(),
          password: data.password,
          fullName: data.fullName.trim(),
          mobile: data.mobile.trim(),
          emergency: data.emergency.trim(),
          address: data.address.trim(),
        });

        alert('Account created ✅');
        router.replace('/login' as any);
      } catch (error: any) {
        alert(getSignUpErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [agree, router]
  );

  const toggleAgree = useCallback(() => {
    setAgree((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign up</Text>

      <Text style={styles.label}>Full name</Text>
      <Controller
        control={control}
        name="fullName"
        rules={{
          required: 'Full name is required.',
          minLength: {
            value: 3,
            message: 'Full name must be at least 3 characters.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter your full name"
            style={[styles.input, errors.fullName && styles.inputError]}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter your email"
            style={[styles.input, errors.email && styles.inputError]}
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required.',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter your password"
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Text style={styles.label}>Phone number</Text>
      <Controller
        control={control}
        name="mobile"
        rules={{
          required: 'Phone number is required.',
          pattern: {
            value: /^[0-9+]{8,15}$/,
            message: 'Please enter a valid phone number.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter phone number"
            style={[styles.input, errors.mobile && styles.inputError]}
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}

      <Text style={styles.label}>Address</Text>
      <Controller
        control={control}
        name="address"
        rules={{
          required: 'Address is required.',
          minLength: {
            value: 3,
            message: 'Address must be at least 3 characters.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter your address"
            style={[styles.input, errors.address && styles.inputError]}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

      <Text style={styles.label}>Emergency number</Text>
      <Controller
        control={control}
        name="emergency"
        rules={{
          required: 'Emergency number is required.',
          pattern: {
            value: /^[0-9+]{8,15}$/,
            message: 'Please enter a valid emergency number.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Enter emergency number"
            style={[styles.input, errors.emergency && styles.inputError]}
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.emergency && <Text style={styles.errorText}>{errors.emergency.message}</Text>}

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={toggleAgree}
      >
        <Text style={styles.checkbox}>
          {agree ? '☑' : '⬜'}
        </Text>
        <Text style={styles.checkboxText}>
          I agree to the privacy policy.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

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
    marginBottom: 6,
  },

  inputError: {
    borderWidth: 1,
    borderColor: '#c0392b',
  },

  errorText: {
    color: '#c0392b',
    fontSize: 11,
    marginBottom: 8,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },

  checkbox: {
    marginRight: 5,
  },

  checkboxText: {
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

  back: {
    textAlign: 'center',
    marginTop: 15,
    color: '#1f3c4c',
  },
});