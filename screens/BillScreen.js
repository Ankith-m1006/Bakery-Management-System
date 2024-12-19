import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview'; // Import WebView
import { Picker } from '@react-native-picker/picker'; // Corrected Picker import

export default function BillScreen() {
  const [items, setItems] = useState([]); // List of items fetched from AsyncStorage
  const [selectedItem, setSelectedItem] = useState(''); // Currently selected item
  const [quantity, setQuantity] = useState(''); // Quantity of the selected item
  const [billItems, setBillItems] = useState([]); // Items added to the bill
  const [totalCost, setTotalCost] = useState(0); // Total cost of the bill
  const [billModalVisible, setBillModalVisible] = useState(false); // Modal visibility
  const [htmlContent, setHtmlContent] = useState(''); // Bill HTML content

  // Fetch items from AsyncStorage on load
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  // Add selected item and quantity to the bill
  const addToBill = () => {
    if (!selectedItem || !quantity) {
      alert('Please select an item and enter a valid quantity.');
      return;
    }

    const item = items.find((i) => i.name === selectedItem);
    if (!item) return;

    const cost = item.price * parseFloat(quantity);
    const newItem = {
      id: Date.now(),
      name: item.name,
      price: item.price,
      quantity: parseFloat(quantity),
      total: cost.toFixed(2),
    };

    setBillItems([...billItems, newItem]);
    setTotalCost((prev) => prev + cost);
    setQuantity('');
    setSelectedItem('');
  };

  // Remove item from the bill
  const removeFromBill = (id, cost) => {
    const updatedBillItems = billItems.filter((item) => item.id !== id);
    setBillItems(updatedBillItems);
    setTotalCost((prev) => prev - cost);
  };

  // Generate improved colorful HTML bill content with rows and columns in vertical layout
  const generateBill = () => {
    if (billItems.length === 0) {
      alert('No items added to the bill.');
      return;
    }

    let billDetails = billItems
      .map(
        (item) => `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
            <div style="flex: 1; font-size: 20px; color: #555;">${item.name}</div>
            <div style="flex: 1; font-size: 20px; text-align: center; color: #555;">${item.quantity}</div>
            <div style="flex: 1; font-size: 20px; text-align: right; color: #555;">₹${item.total}</div>
          </div>
        `
      )
      .join('');

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color:rgb(236, 225, 225);
              padding: 20px;
              color: #333;
              margin: 0;
              width: 100%;
              box-sizing: border-box;
            }
            .bill-container {
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
              width: 80%; /* Adjust to 80% of the screen width */
              margin: auto;
            }
            .bill-title {
              text-align: center;
              font-size: 30px;
              font-weight: bold;
              margin-bottom: 25px;
              color:rgb(33, 150, 243);
            }
            .bill-header {
              display: flex;
              justify-content: space-between;
              padding-bottom: 10px;
              border-bottom: 2px solid #2196F3;
              margin-bottom: 10px;
            }
            .bill-header div {
              font-size: 22px;
              font-weight: bold;
              color:rgb(33, 150, 243);
            }
            .bill-details {
              margin-bottom: 26px;
            }
            .total-cost {
              font-size: 24px;
              font-weight: bold;
              color:rgb(0, 0, 0);
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="bill-title">Anjanadri Condiments</div>
            <div class="bill-header">
              <div>Item</div>
              <div>Quantity</div>
              <div>Cost</div>
            </div>
            <div class="bill-details">
              ${billDetails}
            </div>
            <div class="total-cost">
              Total: ₹${totalCost.toFixed(2)}
            </div>
          </div>
        </body>
      </html>
    `;

    setHtmlContent(html); // Set HTML content for WebView
    setBillModalVisible(true); // Open the modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Bill</Text>

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

      {/* Add to Bill Button */}
      <TouchableOpacity style={styles.button} onPress={addToBill}>
        <Text style={styles.buttonText}>Add to Bill</Text>
      </TouchableOpacity>

      {/* Bill Items List */}
      <FlatList
        data={billItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <Text style={styles.billItemText}>
              {item.name} - {item.quantity} x ₹{item.price} = ₹{item.total}
            </Text>
            <TouchableOpacity onPress={() => removeFromBill(item.id, parseFloat(item.total))}>
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total Cost */}
      <Text style={styles.totalCost}>Total: ₹{totalCost.toFixed(2)}</Text>

      {/* Generate Bill Button */}
      <TouchableOpacity style={styles.billButton} onPress={generateBill}>
        <Text style={styles.billButtonText}>Generate Bill</Text>
      </TouchableOpacity>

      {/* Bill Modal */}
      <Modal
        visible={billModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBillModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }} // Render HTML bill in WebView
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={() => setBillModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  picker: { marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  billItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e7e7e7',
    borderRadius: 8,
  },
  billItemText: { fontSize: 18, color: '#333' },
  deleteText: { color: 'red', fontWeight: 'bold' },
  totalCost: { fontSize: 22, fontWeight: 'bold', marginTop: 10, textAlign: 'right' },
  billButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  billButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  closeButton: { marginTop: 20, backgroundColor: '#f44336', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
});
