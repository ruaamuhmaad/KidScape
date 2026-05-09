import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterModal = ({ visible, onClose, onApply }: any) => {
  const [interest, setInterest] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.container}>
        <View style={styles.dragLine} />

        <Text style={styles.label}>Interest</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Select Interest"
            placeholderTextColor="#999"
            style={styles.cityInput}
            value={interest}
            onChangeText={setInterest}
          />
          <Ionicons name="chevron-down" size={20} color="#183B4E" />
        </View>

        <Text style={styles.label}>City</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Select City"
            placeholderTextColor="#999"
            style={styles.cityInput}
            value={city}
            onChangeText={setCity}
          />
          <Ionicons name="chevron-down" size={20} color="#183B4E" />
        </View>

        <Text style={styles.label}>Select Age Group</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.ageBtn, age === '5-9' && styles.active]}
            onPress={() => setAge('5-9')}
          >
            <Text style={[styles.ageText, age === '5-9' && styles.activeText]}>5-9</Text>
          </Pressable>

          <Pressable
            style={[styles.ageBtn, age === '10-14' && styles.active]}
            onPress={() => setAge('10-14')}
          >
            <Text style={[styles.ageText, age === '10-14' && styles.activeText]}>10-14</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Range Price (₪)</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="enter min price"
            placeholderTextColor="#999"
            style={styles.priceInput}
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <Text style={{color: '#183B4E', fontWeight: 'bold'}}>To</Text>
          <TextInput
            placeholder="enter max price"
            placeholderTextColor="#999"
            style={styles.priceInput}
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>

        <Text style={styles.label}>Rating</Text>
        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map((r) => (
            <Pressable
              key={r}
              style={[styles.starBox, rating >= r && styles.activeStarBox]}
              onPress={() => setRating(r)}
            >
              <Ionicons
                name="star"
                size={20}
                color={rating >= r ? "#183B4E" : "#C4C4C4"}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.applyBtn}
          onPress={() => {
            onApply({ interest, city, age, minPrice, maxPrice, rating });
            onClose();
          }}
        >
          <Text style={styles.applyText}>Apply Filter</Text>
        </Pressable>

        <Pressable onPress={() => {
            setInterest('');
            setCity('');
            setAge('');
            setMinPrice('');
            setMaxPrice('');
            setRating(0);
        }} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset All</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  dragLine: {
    width: 60,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    color: '#183B4E',
  },
  inputBox: {
    backgroundColor: '#EAEFEF',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    color: '#999',
  },
  cityInput: {
    flex: 1,
    color: '#183B4E',
    padding: 0,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  ageBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#183B4E',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: '#EAEFEF',
  },
  ageText: {
    color: '#183B4E',
    fontWeight: '500',
  },
  activeText: {
    fontWeight: 'bold',
  },
  priceInput: {
    backgroundColor: '#EAEFEF',
    borderRadius: 20,
    padding: 12,
    width: '42%',
    textAlign: 'center',
    color: '#183B4E',
  },
  starBox: {
    borderWidth: 1.5,
    borderColor: '#183B4E',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  activeStarBox: {
    backgroundColor: '#E3E0EE',
    borderColor: '#183B4E',
  },
  applyBtn: {
    backgroundColor: '#183B4E',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetBtn: {
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  resetText: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
