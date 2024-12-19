import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatisticsScreen() {
  const [earnings, setEarnings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const earningsData = JSON.parse(await AsyncStorage.getItem('earnings')) || [];
    const expensesData = JSON.parse(await AsyncStorage.getItem('expenses')) || [];

    const earningsSum = earningsData.reduce((sum, item) => sum + item.amount, 0);
    const expensesSum = expensesData.reduce((sum, item) => sum + item.amount, 0);

    setEarnings(earningsData);
    setExpenses(expensesData);
    setTotalEarnings(earningsSum);
    setTotalExpenses(expensesSum);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      <View style={styles.statBox}>
        <Text style={styles.statText}>Total Earnings: ₹{totalEarnings.toFixed(2)}</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statText}>Total Expenses: ₹{totalExpenses.toFixed(2)}</Text>
      </View>
      <View style={[styles.statBox, totalEarnings - totalExpenses < 0 ? styles.loss : styles.profit]}>
        <Text style={styles.statText}>
          Net Profit: ₹{(totalEarnings - totalExpenses).toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  statBox: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profit: {
    backgroundColor: '#d4edda',
  },
  loss: {
    backgroundColor: '#f8d7da',
  },
});
