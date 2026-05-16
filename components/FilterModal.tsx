import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterModal = ({ visible, onClose, onApply }: any) => {
  const [city, setCity] = useState('');
  const [interest, setInterest] = useState('');
  const [age, setAge] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);

  const handleReset = () => {
    setCity('');
    setInterest('');
    setAge('');
    setMinPrice('');
    setMaxPrice('');
    setRating(0);
    onApply({});
    onClose();
  };

  const handleApply = () => {
    onApply({
      city,
      interest,
      age,
      minPrice,
      maxPrice,
      rating,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.dragLine} />
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter Options</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#183B4E" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* City Search */}
            <Text style={styles.label}>Location / City</Text>
            <View style={styles.inputBox}>
              <Ionicons name="location-outline" size={20} color="#999" />
              <TextInput
                placeholder="Search by city..."
                placeholderTextColor="#999"
                style={styles.input}
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Interest Search */}
            <Text style={styles.label}>Category / Interest</Text>
            <View style={styles.inputBox}>
              <Ionicons name="sparkles-outline" size={20} color="#999" />
              <TextInput
                placeholder="Sports, Music, Art..."
                placeholderTextColor="#999"
                style={styles.input}
                value={interest}
                onChangeText={setInterest}
              />
            </View>

            {/* Age Group */}
            <Text style={styles.label}>Age Group</Text>
            <View style={styles.ageGrid}>
              {['3-5', '6-9', '10-12', '13-15'].map((group) => (
                <Pressable
                  key={group}
                  style={[styles.ageBtn, age === group && styles.activeBtn]}
                  onPress={() => setAge(age === group ? '' : group)}
                >
                  <Text style={[styles.ageBtnText, age === group && styles.activeBtnText]}>
                    {group} years
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Price Range */}
            <Text style={styles.label}>Price Range</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceInputBox}>
                <Text style={styles.priceSymbol}>$</Text>
                <TextInput
                  placeholder="Min"
                  keyboardType="numeric"
                  style={styles.priceInput}
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceInputBox}>
                <Text style={styles.priceSymbol}>$</Text>
                <TextInput
                  placeholder="Max"
                  keyboardType="numeric"
                  style={styles.priceInput}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            </View>

            {/* Rating */}
            <Text style={styles.label}>Minimum Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setRating(rating === star ? 0 : star)}
                  style={styles.starPressable}
                >
                  <Ionicons
                    name={rating >= star ? "star" : "star-outline"}
                    size={32}
                    color={rating >= star ? "#FFD700" : "#CCC"}
                  />
                </Pressable>
              ))}
            </View>

            <View style={styles.footer}>
              <Pressable style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.resetText}>Reset All</Text>
              </Pressable>
              <Pressable style={styles.applyBtn} onPress={handleApply}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  keyboardView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
  dragLine: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#183B4E',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#183B4E',
    marginTop: 15,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#183B4E',
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    minWidth: '47%',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: '#183B4E',
    borderColor: '#183B4E',
  },
  ageBtnText: {
    color: '#666',
    fontWeight: '500',
  },
  activeBtnText: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 15,
    width: '45%',
    paddingHorizontal: 12,
    height: 50,
  },
  priceSymbol: {
    color: '#999',
    marginRight: 5,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    color: '#183B4E',
  },
  priceDivider: {
    width: 10,
    height: 1,
    backgroundColor: '#CCC',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  starPressable: {
    padding: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  resetBtn: {
    flex: 1,
    height: 55,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  applyBtn: {
    flex: 2,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#183B4E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#183B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
