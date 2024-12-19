# Bakery Management App

## Overview
The **Bakery Management App** is a mobile application designed to streamline daily bakery operations. The app helps manage daily earnings, expenses, customer dues, shop orders, and more. It provides features like local data storage, monthly archiving, and order tracking, making it easier to monitor and manage bakery business activities efficiently.

---

## Features
- **Add and Track Earnings:** Add daily earnings and view them by month or date.  
- **Expense Management:** Record and track daily expenses.  
- **Customer Dues:** Manage customer payments and outstanding dues.  
- **Shop Orders:** Track orders from nearby shops and generate detailed bills.  
- **Monthly Archive:** Archive earnings for each month to maintain clean records.  
- **Offline Support:** Data is stored locally using AsyncStorage for offline access.  
- **Responsive UI:** Optimized layout for multiple screen sizes.  

---

## Tech Stack
- **Frontend**: React Native  
- **Storage**: AsyncStorage (for local data persistence)  
- **Libraries**:  
  - `react-native-paper` for UI components  
  - `react-navigation` for app navigation  
  - `react-native-async-storage` for data management  

---

## Project Structure

```
bakery-management-app/
│
├── App.js                   # Entry point of the application
├── Screens/ 
    |__ HomeScreen.js             # Homscreen
│   ├── EarningsListScreen.js     # View and manage earnings
│   ├── ArchivedEarningsScreen.js # View and manage archived earnings
│   ├── ExpenseListScreen.js      # View and manage expenses
│   ├── AddEarningsScreen.js      # Add new earnings
│   ├── AddExpenseScreen.js       # Add new expenses
│   └── ShopOrdersScreen.js       #View and Manage shops
    |__ BillScreen.js             #Make Invoice of items
    |__CustomerManagementScreen.js   #add and manage Customers
    |__DailyOrdersScreen.js          #add and manage Daily orders
    |__AddItemsSCreen.js             #add and manage items
    |__StatisticsScreen.js           #view statistics
│
├── assets/                  # Static assets like images                  
│
├── utils/                   # Helper functions
│   └── storageHelpers.js    # AsyncStorage helper functions
│
├── README.md                # Documentation for the project
├── package.json             # App metadata and dependencies
└── .gitignore               # Git ignored files and directories
```

---

## Installation

### Prerequisites
- Node.js (>= 16.x)
- React Native CLI or Expo
- Android Studio/ Xcode (for emulators)

### Steps
1. Clone the repository:
   ```
   git clone <repository-url>
   cd bakery-management-app
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the application:
   - For Android:
     ```
     npx react-native run-android
     ```
   - For iOS:
     ```
     npx react-native run-ios
     ```

---

## Usage
1. Open the app and navigate through the home screen to access features like **Add Earnings**, **Add Expenses**, **Manage Orders**, etc.  
2. Use the **View Earnings** or **Archived Earnings** screens to review financial records.  
3. Use the **Shop Orders** feature to manage daily shop transactions and generate bills.

---

## Future Enhancements
- Implement cloud sync for backup and multi-device support.  
- Add push notifications for reminders about customer dues or shop orders.  
- Include graphical statistics for better insights into earnings and expenses trends.

---

## Contributing
Contributions are welcome! If you would like to improve this app, feel free to fork the repository and create a pull request.  

---

## License
This project is licensed under the MIT License.

--- 

