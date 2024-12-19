import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data grouped by month (used for orders, earnings, etc.)
 * @param {string} key - Base key name (e.g., 'orders', 'earnings').
 * @param {object} value - Data object to store (e.g., new order data).
 */
export const storeMonthlyData = async (key, value) => {
  try {
    const date = new Date(value.date || new Date()); // Use provided date or current date
    const monthKey = `${key}_${date.getFullYear()}_${date.getMonth() + 1}`; // Format: key_2024_6

    const existingData = JSON.parse(await AsyncStorage.getItem(monthKey)) || [];
    existingData.push(value);

    await AsyncStorage.setItem(monthKey, JSON.stringify(existingData));
    console.log(`Data saved successfully under key: ${monthKey}`);
  } catch (error) {
    console.error('Error saving monthly data:', error);
  }
};

/**
 * Retrieve data grouped by month
 * @param {string} key - Base key name (e.g., 'orders', 'earnings').
 * @param {number} year - Year (e.g., 2024).
 * @param {number} month - Month (e.g., 6 for June).
 * @returns {Promise<Array>} - Array of stored data objects.
 */
export const getMonthlyData = async (key, year, month) => {
  try {
    const monthKey = `${key}_${year}_${month}`;
    const data = await AsyncStorage.getItem(monthKey);
    console.log(`Data fetched for key: ${monthKey}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    return [];
  }
};

/**
 * Store generic data
 * @param {string} key - Key to store the data.
 * @param {any} value - Value to store (will be stringified).
 */
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`Data stored under key: ${key}`);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

/**
 * Retrieve generic data
 * @param {string} key - Key to retrieve data.
 * @returns {Promise<any>} - Parsed data from storage.
 */
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`Data retrieved for key: ${key}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

/**
 * Remove specific data
 * @param {string} key - Key to remove.
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed for key: ${key}`);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

/**
 * Refresh daily data: archive current data and reset
 * @param {string} dataKey - Key for today's data.
 * @param {string} archiveKey - Key for archived data.
 */
export const refreshDailyData = async (dataKey, archiveKey) => {
  try {
    const currentData = (await getData(dataKey)) || [];
    const archivedData = (await getData(archiveKey)) || [];

    const updatedArchive = [...archivedData, ...currentData];
    await storeData(archiveKey, updatedArchive);
    await storeData(dataKey, []); // Clear today's data
    console.log('Daily data archived and reset successfully.');
  } catch (error) {
    console.error('Error refreshing daily data:', error);
  }
};

/**
 * Retrieve all keys from AsyncStorage
 * @returns {Promise<Array>} - List of all keys in AsyncStorage.
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('All keys fetched:', keys);
    return keys;
  } catch (error) {
    console.error('Error fetching all keys:', error);
    return [];
  }
};
