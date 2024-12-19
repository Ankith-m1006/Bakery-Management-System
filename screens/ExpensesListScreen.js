import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';

export default function ExpensesListScreen() {
  const [expenses, setExpenses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('expenses')) || [];
    setExpenses(data);
  };

  const handleDelete = async () => {
    const updatedExpenses = expenses.filter((item) => !selectedIds.includes(item.id));
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.date).toDateString();
    return (
      <View style={styles.itemContainer}>
        <Checkbox
          status={selectedIds.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleSelect(item.id)}
          color="#dc3545" // Red color for expenses
        />
        <View style={styles.itemDetails}>
          <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses List</Text>
      <FlatList data={expenses} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
      <TouchableOpacity
        style={[styles.deleteButton, selectedIds.length === 0 && styles.deleteButtonDisabled]}
        onPress={handleDelete}
        disabled={selectedIds.length === 0}
      >
        <Text style={styles.deleteButtonText}>Delete Selected</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 10 },
  itemDetails: { marginLeft: 10 },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#dc3545' },
  date: { fontSize: 14, color: '#888' },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonDisabled: { backgroundColor: '#aaa' },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
