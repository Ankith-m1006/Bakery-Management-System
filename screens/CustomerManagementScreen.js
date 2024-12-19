import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { storeData, getData } from '../utils/storageHelper';

const { width } = Dimensions.get('window'); // Get screen width for responsiveness

export default function ManageCustomersScreen() {
  const [customers, setCustomers] = useState([]); // Customers list
  const [items, setItems] = useState([]); // Available items
  const [customerName, setCustomerName] = useState(''); // Customer name input
  const [selectedItem, setSelectedItem] = useState(''); // Selected item
  const [quantity, setQuantity] = useState(''); // Item quantity
  const [pricePerUnit, setPricePerUnit] = useState(0); // Price per unit of the selected item

  // Load items and customers on mount
  useEffect(() => {
    loadItems();
    loadCustomers();
  }, []);

  const loadItems = async () => {
    const data = await getData('items');
    setItems(data || []); // Fallback to an empty array if data is null
  };

  const loadCustomers = async () => {
    const data = await getData('customers');
    setCustomers(data || []); // Fallback to an empty array if data is null
  };

  // Update pricePerUnit when item changes
  useEffect(() => {
    if (selectedItem) {
      const item = items.find((i) => i.name === selectedItem);
      setPricePerUnit(item?.price || 0);
    }
  }, [selectedItem, items]);

  const addPurchase = () => {
    if (!customerName || !selectedItem || !quantity) {
      alert('Please enter customer name, select an item, and enter quantity!');
      return;
    }

    const cost = pricePerUnit * parseFloat(quantity);
    const purchase = {
      item: selectedItem,
      quantity: parseInt(quantity),
      cost: cost,
    };

    // Check if the customer already exists in the list
    const existingCustomerIndex = customers.findIndex((customer) => customer.name === customerName);

    if (existingCustomerIndex >= 0) {
      // If the customer exists, update their purchase list
      const existingCustomer = customers[existingCustomerIndex];

      // Check if the item already exists in the customer's purchases
      const existingPurchaseIndex = existingCustomer.purchases.findIndex((p) => p.item === selectedItem);
      if (existingPurchaseIndex >= 0) {
        // If the item exists, update the quantity and cost
        const updatedPurchases = [...existingCustomer.purchases];
        updatedPurchases[existingPurchaseIndex].quantity += purchase.quantity;
        updatedPurchases[existingPurchaseIndex].cost += purchase.cost;

        // Calculate the updated total
        const updatedTotal = updatedPurchases.reduce((sum, p) => sum + p.cost, 0);

        // Update the customer
        const updatedCustomer = {
          ...existingCustomer,
          purchases: updatedPurchases,
          total: updatedTotal,
        };

        // Update the customers list
        const updatedCustomers = [...customers];
        updatedCustomers[existingCustomerIndex] = updatedCustomer;
        setCustomers(updatedCustomers);
        storeData('customers', updatedCustomers); // Save after update
      } else {
        // If the item doesn't exist, add the purchase to the list
        const updatedPurchases = [...existingCustomer.purchases, purchase];
        const updatedTotal = existingCustomer.purchases.reduce((sum, p) => sum + p.cost, 0) + purchase.cost;

        const updatedCustomer = {
          ...existingCustomer,
          purchases: updatedPurchases,
          total: updatedTotal,
        };

        const updatedCustomers = [...customers];
        updatedCustomers[existingCustomerIndex] = updatedCustomer;
        setCustomers(updatedCustomers);
        storeData('customers', updatedCustomers); // Save after update
      }
    } else {
      // If the customer doesn't exist, create a new customer
      const newCustomer = {
        id: Date.now(),
        name: customerName,
        purchases: [purchase],
        total: cost,
      };

      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      storeData('customers', updatedCustomers); // Save after adding new customer
    }

    // Clear input fields after adding purchase
    setSelectedItem('');
    setQuantity('');
    setPricePerUnit(0);
    setCustomerName('');
  };

  const deleteCustomer = async (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
    await storeData('customers', updatedCustomers); // Save after deletion
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Customers</Text>

      {/* Customer Name */}
      <TextInput
        placeholder="Enter Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />

      {/* Item Picker */}
      <Picker selectedValue={selectedItem} onValueChange={(value) => setSelectedItem(value)} style={styles.picker}>
        <Picker.Item label="Select Item" value="" />
        {items.map((item, index) => (
          <Picker.Item key={index} label={`${item.name} (₹${item.price})`} value={item.name} />
        ))}
      </Picker>

      {/* Quantity Input */}
      <TextInput
        placeholder="Enter Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.costText}>Cost: ₹{(pricePerUnit * (quantity || 0)).toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={addPurchase}>
        <Text style={styles.buttonText}>Add Purchase</Text>
      </TouchableOpacity>

      {/* Saved Customers */}
      <Text style={styles.customerListTitle}>Saved Customers:</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.customerItem}>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text>
              {item.purchases.map((p) => `${p.item} x ${p.quantity}: ₹${p.cost}`).join('\n')}
            </Text>
            <Text style={styles.totalText}>Total: ₹{item.total.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => deleteCustomer(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: width * 0.9,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    width: width * 0.9,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  costText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.9,
    marginBottom: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  customerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: width * 0.9,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    marginTop: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
  },
});
