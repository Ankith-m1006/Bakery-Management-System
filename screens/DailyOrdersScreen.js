import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from 'react-native-vector-icons';

export default function DailyOrdersScreen() {
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orders, setOrders] = useState([]); // Default to empty array
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [billDetails, setBillDetails] = useState('');

  // Fetch shops, items, and orders on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedShops = await AsyncStorage.getItem('shops');
        const storedItems = await AsyncStorage.getItem('items');
        const storedOrders = await AsyncStorage.getItem('orders');

        // Parse the stored data and handle cases where data might be null
        if (storedShops) {
          setShops(JSON.parse(storedShops));
        }

        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }

        // Safely parse storedOrders and ensure it's an array
        const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
        setOrders(parsedOrders);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Add Order
  const addOrder = async () => {
    if (!selectedShop || !selectedItem || !quantity) {
      alert('Please select a shop, item, and enter a quantity.');
      return;
    }

    const item = items.find((i) => i.name === selectedItem);
    const cost = item.price * parseFloat(quantity);

    // Check if the shop already exists in orders
    const existingOrder = orders.find((order) => order.shop === selectedShop);
    if (existingOrder) {
      // If the shop exists, add the new item to the existing order
      existingOrder.items.push({
        name: selectedItem,
        quantity: parseFloat(quantity),
        cost: cost.toFixed(2),
      });
      const updatedOrders = orders.map((order) =>
        order.shop === selectedShop ? existingOrder : order
      );
      setOrders(updatedOrders);
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    } else {
      // If the shop doesn't exist, create a new order
      const newOrder = {
        id: Date.now(),
        shop: selectedShop,
        items: [{ name: selectedItem, quantity: parseFloat(quantity), cost: cost.toFixed(2) }],
      };
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    }

    setQuantity('');
    setSelectedItem('');
  };

  // Clear an order
  const clearBill = async (id) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    setOrders(updatedOrders);
    await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  // Generate Bill
  const generateBill = (order) => {
    const totalCost = order.items.reduce((sum, item) => sum + parseFloat(item.cost), 0);
    const billContent = order.items
      .map((item) => `${item.name} - ${item.quantity} x ₹${item.cost}`)
      .join('\n');

    const currentDateTime = new Date().toLocaleString();
    const billHTMLContent = `
      Anjanadri Condiments
      Date: ${currentDateTime}
      Shop: ${order.shop}
      Items Purchased:
      ${billContent}

      Total: ₹${totalCost.toFixed(2)}

      Thank you!
    `;

    setBillDetails(billHTMLContent);
    setBillModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Orders</Text>

      {/* Shop Picker */}
      <Picker
        selectedValue={selectedShop}
        onValueChange={(value) => setSelectedShop(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Shop" value="" />
        {shops.map((shop) => (
          <Picker.Item key={shop.id} label={shop.name} value={shop.name} />
        ))}
      </Picker>

      {/* Item Picker */}
      <Picker
        selectedValue={selectedItem}
        onValueChange={(value) => setSelectedItem(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Item" value="" />
        {items.map((item) => (
          <Picker.Item key={item.id} label={`${item.name} (₹${item.price})`} value={item.name} />
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

      {/* Add Order Button */}
      <TouchableOpacity style={styles.button} onPress={addOrder}>
        <Text style={styles.buttonText}>Add Order</Text>
      </TouchableOpacity>

      {/* Orders List */}
      <FlatList
        data={orders} // Make sure this is always an array
        keyExtractor={(item) => item.id?.toString() || item.shop} // Ensure a unique key for each order
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.orderActions}>
              {/* Bill Icon */}
              <TouchableOpacity onPress={() => generateBill(item)}>
                <MaterialIcons name="receipt" size={28} color="#28a745" style={styles.billIcon} />
              </TouchableOpacity>

              {/* Clear Bill (Delete) Button */}
              <TouchableOpacity onPress={() => clearBill(item.id)}>
                <Text style={styles.clearText}>Clear Bill</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.shopName}>{item.shop}</Text>
            {item.items.map((subItem, index) => (
              <Text key={index} style={styles.itemDetails}>
                {`${subItem.name} (${subItem.quantity}) - ₹${subItem.cost}`}
              </Text>
            ))}
          </View>
        )}
      />

      {/* Bill Modal */}
      <Modal
        visible={billModalVisible}
        onRequestClose={() => setBillModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.modalContentContainer}
            style={styles.scrollView}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalClose} onPress={() => setBillModalVisible(false)}>
                Close
              </Text>
              {/* Display bill details as plain text */}
              <Text style={styles.billText}>{billDetails}</Text>
              {/* Display the total separately with a bolder style */}
              <Text style={styles.totalText}>Total: ₹{orders.reduce((sum, order) => sum + order.items.reduce((sum, item) => sum + parseFloat(item.cost), 0), 0).toFixed(2)}</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 20, borderRadius: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  orderItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e7e7e7',
    borderRadius: 8,
  },
  orderActions: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 },
  billIcon: { marginRight: 15 },
  clearText: { color: 'red', fontWeight: 'bold' },
  shopName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  itemDetails: { fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContentContainer: { paddingBottom: 20, alignItems: 'center' },
  scrollView: { marginHorizontal: 20, borderRadius: 8, backgroundColor: 'white' },
  modalContent: { padding: 20, marginHorizontal: 20, borderRadius: 8 },
  modalClose: { textAlign: 'center', fontSize: 18, color: '#ff5c5c', marginBottom: 20 },
  billText: {
    fontSize: 18, // Slightly smaller for regular text
    lineHeight: 25,
  },
  totalText: {
    fontSize: 22, // Make the "Total" larger
    fontWeight: '900', // Bold and prominent
    color: '#000',
    marginTop: 10,
  },
});
