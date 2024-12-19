import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!amount) return alert('Please enter expense amount!');

    const newExpense = { id: Date.now(), date: date.toISOString(), amount: parseFloat(amount) };

    const existingExpenses = JSON.parse(await AsyncStorage.getItem('expenses')) || [];
    existingExpenses.push(newExpense);
    await AsyncStorage.setItem('expenses', JSON.stringify(existingExpenses));

    alert('Expense saved successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      {/* Expense Amount Input */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter expense amount"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar" size={20} color="#fff" />
        <Text style={styles.dateText}>
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* DateTime Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: width - 40,
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  dateButton: {
    width: width - 40,
    padding: 15,
    backgroundColor: '#20B2AA',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#fff',
  },
  saveButton: {
    width: width - 40,
    padding: 15,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
