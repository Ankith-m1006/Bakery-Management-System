import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';  // For delete icon

export default function EarningsListScreen({ navigation }) {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('earnings')) || [];
    setEarnings(data);
  };

  const handleDelete = async (id) => {
    const updatedEarnings = earnings.filter((item) => item.id !== id);
    await AsyncStorage.setItem('earnings', JSON.stringify(updatedEarnings));
    setEarnings(updatedEarnings);
  };

  const handleArchive = async () => {
    const monthKey = getCurrentMonth();
    const archivedData = earnings;

    // Save current earnings to archive
    const existingArchive = JSON.parse(await AsyncStorage.getItem('archivedEarnings')) || {};
    existingArchive[monthKey] = archivedData;
    await AsyncStorage.setItem('archivedEarnings', JSON.stringify(existingArchive));

    // Clear current earnings
    await AsyncStorage.removeItem('earnings');
    setEarnings([]);
    Alert.alert("Archived", `${monthKey}'s earnings have been archived successfully.`);
  };

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.date).toLocaleDateString();
    return (
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>
    );
  };

  const getCurrentMonth = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[new Date().getMonth()];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.month}>{getCurrentMonth()}</Text>

      <ScrollView horizontal>
        <View style={[styles.table, { width: Dimensions.get('window').width * 0.95 }]}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerCell, { flex: 0.4 }]}>Amount</Text>
            <Text style={[styles.headerCell, { flex: 0.4 }]}>Date</Text>
            <Text style={[styles.headerCell, { flex: 0.2 }]}>Action</Text>
          </View>
          <FlatList
            data={earnings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>

      <View style={styles.actionsContainer}>
        {/* Archive Button */}
        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleArchive}
        >
          <Text style={styles.buttonText}>Archive Month</Text>
        </TouchableOpacity>

        {/* Go to Archived Earnings */}
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('ArchivedEarningsScreen')}
        >
          <Text style={styles.buttonText}>View Archived Earnings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', alignItems: 'center' },
  month: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  table: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f1f1', paddingVertical: 12 },
  headerRow: { backgroundColor: '#f1f1f1', paddingVertical: 10 },
  headerCell: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  cell: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#28a745' },
  date: { fontSize: 18, color: '#777' },
  deleteButton: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 10,
  },
  actionsContainer: { width: '100%', marginTop: 20, alignItems: 'center' },
  smallButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 8,
    width: Dimensions.get('window').width * 0.6,  // Smaller width for smaller buttons
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
