import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import AddEarningsScreen from './screens/AddEarningsScreen';
import EarningsListScreen from './screens/EarningsListScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ExpensesListScreen from './screens/ExpensesListScreen';
import CustomerManagementScreen from './screens/CustomerManagementScreen';
import ShopManagementScreen from './screens/ShopManagementScreen';
import DailyOrdersScreen from './screens/DailyOrdersScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AddItemsScreen from './screens/AddItemsScreen';
import BillScreen from './screens/BillScreen';
import ArchivedEarningsScreen from './screens/ArchivedEarningsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bakery Management' }} />
        <Stack.Screen name="AddEarnings" component={AddEarningsScreen} options={{ title: 'Add Earnings' }} />
        <Stack.Screen name="EarningsList" component={EarningsListScreen} options={{ title: 'Earnings List' }} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
        <Stack.Screen name="ExpensesList" component={ExpensesListScreen} options={{ title: 'Expenses List' }} />
        <Stack.Screen name="CustomerManagement" component={CustomerManagementScreen} options={{ title: 'Manage Customers' }} />
        <Stack.Screen name="ShopManagement" component={ShopManagementScreen} options={{ title: 'Manage Shops' }} />
        <Stack.Screen name="DailyOrders" component={DailyOrdersScreen} options={{ title: 'Daily Orders' }} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Statistics' }} />
        <Stack.Screen name="Additems" component={AddItemsScreen} options={{title:'Add items'}} />
        <Stack.Screen name="Bill" component={BillScreen} options={{title:"Bill"}} />
        <Stack.Screen name="ArchivedEarningsScreen" component={ArchivedEarningsScreen} options={{title:"Archived Earnings"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
