import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getData } from '../utils/storageHelper';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageEarnings, setAverageEarnings] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchEarningsSummary);
    fetchEarningsSummary();
    return unsubscribe;
  }, [navigation]);

  const fetchEarningsSummary = async () => {
    const earnings = (await getData('earnings')) || [];
    const total = earnings.reduce((sum, entry) => sum + entry.amount, 0);
    const average = earnings.length > 0 ? total / earnings.length : 0;

    setTotalEarnings(total);
    setAverageEarnings(average);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anjanadri Condiments</Text>

      {/* Earnings Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#FFDDC1' }]}>
          <Icon name="usd" size={hp(4)} color="#FF6347" />
          <Text style={styles.cardLabel}>Total Earnings</Text>
          <Text style={styles.cardValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#D4F1F4' }]}>
          <Icon name="bar-chart" size={hp(4)} color="#20B2AA" />
          <Text style={styles.cardLabel}>Average Earnings</Text>
          <Text style={styles.cardValue}>₹{averageEarnings.toFixed(2)}</Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.gridContainer}>
        {menuItems.map((item, index) => (
          <CustomButton key={index} {...item} navigation={navigation} />
        ))}
      </View>
    </View>
  );
}

const menuItems = [
  { text: 'Add Earnings', icon: 'plus-circle', route: 'AddEarnings' },
  { text: 'View Earnings', icon: 'list-alt', route: 'EarningsList' },
  { text: 'Add Expense', icon: 'money', route: 'AddExpense' },
  { text: 'View Expenses', icon: 'credit-card', route: 'ExpensesList' },
  { text: 'Manage Customers', icon: 'user', route: 'CustomerManagement' },
  { text: 'Manage Shops', icon: 'store', route: 'ShopManagement' },
  { text: 'Daily Orders', icon: 'calendar-check', route: 'DailyOrders' },
  { text: 'View Statistics', icon: 'pie-chart', route: 'Statistics' },
  { text: 'Add Items', icon: 'plus', route: 'Additems' },
  { text: 'Bill Items', icon: 'file-text', route: 'Bill' },
];

/* Custom Button Component with Icon */
const CustomButton = ({ text, icon, route, navigation }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: getButtonColor(text) }]}
    onPress={() => navigation.navigate(route)}
  >
    <Icon name={icon} size={hp(3)} color="#fff" style={styles.icon} />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

// Dynamically set button colors
const getButtonColor = (text) => {
  switch (text) {
    case 'Add Earnings':
      return '#FF6347';
    case 'View Earnings':
      return '#20B2AA';
    case 'Add Expense':
      return '#FFD700';
    case 'View Expenses':
      return '#4CAF50';
    case 'Manage Customers':
      return '#FF8C00';
    case 'Manage Shops':
      return '#8A2BE2';
    case 'Daily Orders':
      return '#FF1493';
    case 'View Statistics':
      return '#00BFFF';
    case 'Bill Items':
      return '#009688';
    default:
      return '#1E90FF';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  title: {
    fontSize: hp(3),
    fontWeight: '700',
    color: '#2F4F4F',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp(2),
  },
  summaryCard: {
    flex: 1,
    borderRadius: hp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    marginHorizontal: wp(2),
    alignItems: 'center',
    elevation: 3,
  },
  cardLabel: {
    fontSize: hp(1.8),
    color: '#6C757D',
    fontWeight: '500',
    marginTop: hp(0.5),
  },
  cardValue: {
    fontSize: hp(2.5),
    fontWeight: '600',
    color: '#333',
    marginTop: hp(0.5),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: hp(1),
    margin: wp(1),
    width: wp(42), // Adjust width to fit more buttons
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: hp(2),
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: wp(1),
  },
  icon: {
    marginRight: wp(1),
  },
});
