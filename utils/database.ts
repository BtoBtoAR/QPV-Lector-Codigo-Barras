import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

const PRODUCTS_KEY = '@products_database';

export const saveProduct = async (product: Product): Promise<void> => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products: { [barcode: string]: Product } = productsJson 
      ? JSON.parse(productsJson) 
      : {};
    
    products[product.barcode] = product;
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving product:', error);
    if (error instanceof SyntaxError) {
      // If JSON is corrupted, start fresh
      const products: { [barcode: string]: Product } = {};
      products[product.barcode] = product;
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } else {
      throw error;
    }
  }
};

export const getProduct = async (barcode: string): Promise<Product | null> => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    if (!productsJson) return null;
    
    const products: { [barcode: string]: Product } = JSON.parse(productsJson);
    return products[barcode] || null;
  } catch (error) {
    console.error('Error getting product:', error);
    if (error instanceof SyntaxError) {
      // If JSON is corrupted, return null
      return null;
    }
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    if (!productsJson) return [];
    
    const products: { [barcode: string]: Product } = JSON.parse(productsJson);
    return Object.values(products);
  } catch (error) {
    console.error('Error getting all products:', error);
    if (error instanceof SyntaxError) {
      // If JSON is corrupted, return empty array
      return [];
    }
    throw error;
  }
};

export const updateProductQuantity = async (barcode: string, quantity: number): Promise<void> => {
  try {
    const product = await getProduct(barcode);
    if (!product) {
      throw new Error('Product not found');
    }
    
    product.quantity = quantity;
    await saveProduct(product);
  } catch (error) {
    console.error('Error updating product quantity:', error);
    throw error;
  }
};
