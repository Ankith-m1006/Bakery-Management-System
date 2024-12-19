import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ArchivedEarningsScreen() {
  const [archivedData, setArchivedData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    loadArchivedData();
  }, []);

  const loadArchivedData = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('archivedEarnings')) || {};
    setArchivedData(data);
  };

  const handleDeleteMonth = async () => {
    if (!selectedMonth) {
      Alert.alert("Error", "No month selected to delete.");
      return;
    }
    const updatedArchivedData = { ...archivedData };
    delete updatedArchivedData[selectedMonth]; // Remove the selected month's data
    await AsyncStorage.setItem('archivedEarnings', JSON.stringify(updatedArchivedData));
    setArchivedData(updatedArchivedData);
    setSelectedMonth(null);
    Alert.alert("Deleted", `${selectedMonth}'s earnings have been deleted.`);
  };

  const renderMonths = () => {
    return Object.keys(archivedData).map((month) => (
      <TouchableOpacity key={month} style={styles.monthButton} onPress={() => setSelectedMonth(month)}>
        <Text style={styles.monthText}>{month}</Text>
      </TouchableOpacity>
    ));
  };

  const calculateTotalEarnings = () => {
    if (!selectedMonth || !archivedData[selectedMonth]) return 0;
    return archivedData[selectedMonth].reduce((total, item) => total + item.amount, 0);
  };

  const renderEarnings = () => {
    if (!selectedMonth) return null;
    const earnings = archivedData[selectedMonth];

    return (
      <View style={styles.earningsContainer}>
        {/* Total Earnings */}
        <Text style={styles.totalEarningsText}>Total Earnings: ₹{calculateTotalEarnings().toFixed(2)}</Text>

        {/* Earnings List */}
        {earnings.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>₹{item.amount.toFixed(2)}</Text>
            <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archived Earnings</Text>

      {/* List of Archived Months */}
      <View style={styles.monthsContainer}>{renderMonths()}</View>

      {/* Selected Month's Earnings */}
      {selectedMonth && (
        <>
          <Text style={styles.selectedMonthTitle}>Earnings for {selectedMonth}</Text>
          {renderEarnings()}
          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMonth}>
            <Text style={styles.buttonText}>Delete This Month</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  monthsContainer: { marginBottom: 20 },
  monthButton: { backgroundColor: '#007bff', padding: 12, marginVertical: 5, borderRadius: 8 },
  monthText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  selectedMonthTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  earningsContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  cell: { fontSize: 16, color: '#333' },
  totalEarningsText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#28a745', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  deleteButton: { backgroundColor: '#d9534f', paddingVertical: 12, borderRadius: 8, marginTop: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
