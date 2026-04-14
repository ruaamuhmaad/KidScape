import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';

const FilterModal = ({ visible, onClose, onApply }: any) => {
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

        <Text style={styles.label}>City</Text>
        <View style={styles.inputBox}>
          <Text style={styles.placeholder}>Select City</Text>
        </View>

        <Text style={styles.label}>Select Age Group</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.ageBtn, age === '5-9' && styles.active]}
            onPress={() => setAge('5-9')}
          >
            <Text>5-9</Text>
          </Pressable>

          <Pressable
            style={[styles.ageBtn, age === '10-14' && styles.active]}
            onPress={() => setAge('10-14')}
          >
            <Text>10-14</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Range Price</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="enter min price"
            style={styles.priceInput}
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <Text>To</Text>
          <TextInput
            placeholder="enter max price"
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
              style={[styles.starBox, rating >= r && styles.active]}
              onPress={() => setRating(r)}
            >
              <Text>⭐</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.applyBtn}
          onPress={() => {
            onApply({ city, age, minPrice, maxPrice, rating });
            onClose();
          }}
        >
          <Text style={styles.applyText}>Apply Filter</Text>
        </Pressable>

        <Pressable onPress={onClose} style={styles.resetBtn}>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  dragLine: {
    width: 60,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#183B4E',
  },
  inputBox: {
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },
  placeholder: {
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  ageBtn: {
    borderWidth: 1,
    borderColor: '#183B4E',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  active: {
    backgroundColor: '#DCE6F2',
  },
  priceInput: {
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 10,
    width: '40%',
  },
  starBox: {
    borderWidth: 1,
    borderColor: '#183B4E',
    borderRadius: 10,
    padding: 8,
  },
  applyBtn: {
    backgroundColor: '#183B4E',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  resetText: {
    color: '#999',
  },
});