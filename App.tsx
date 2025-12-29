import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { getProduct, saveProduct, updateProductQuantity } from './utils/database';
import { Product } from './types/Product';

type Screen = 'scanner' | 'product-details' | 'add-product';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [currentScreen, setCurrentScreen] = useState<Screen>('scanner');
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  
  // Form states for new product
  const [photoUri, setPhotoUri] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    setScannedBarcode(data);
    
    try {
      const foundProduct = await getProduct(data);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setQuantity(foundProduct.quantity.toString());
        setCurrentScreen('product-details');
      } else {
        setCurrentScreen('add-product');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al buscar el producto');
      setIsScanning(true);
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSaveProduct = async () => {
    if (!photoUri || !description || !unitOfMeasure || !cost || !price || !quantity) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    try {
      const newProduct: Product = {
        barcode: scannedBarcode,
        photoUri,
        description,
        unitOfMeasure,
        cost: parseFloat(cost),
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      };

      await saveProduct(newProduct);
      Alert.alert('Éxito', 'Producto guardado correctamente');
      resetForm();
      setCurrentScreen('scanner');
      setIsScanning(true);
    } catch (error) {
      Alert.alert('Error', 'Error al guardar el producto');
    }
  };

  const handleUpdateQuantity = async () => {
    if (!product || !quantity) {
      Alert.alert('Error', 'Por favor ingrese la cantidad');
      return;
    }

    try {
      await updateProductQuantity(product.barcode, parseFloat(quantity));
      Alert.alert('Éxito', 'Cantidad actualizada correctamente');
      resetForm();
      setCurrentScreen('scanner');
      setIsScanning(true);
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar la cantidad');
    }
  };

  const resetForm = () => {
    setPhotoUri('');
    setDescription('');
    setUnitOfMeasure('');
    setCost('');
    setPrice('');
    setQuantity('');
    setProduct(null);
    setScannedBarcode('');
  };

  const handleCancel = () => {
    resetForm();
    setCurrentScreen('scanner');
    setIsScanning(true);
  };

  if (!permission) {
    return <View style={styles.container}><Text>Solicitando permisos de cámara...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Otorgar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentScreen === 'scanner') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code39',
              'code128',
              'qr',
            ],
          }}
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.corner} style={[styles.corner, styles.topLeft]} />
              <View style={styles.corner} style={[styles.corner, styles.topRight]} />
              <View style={styles.corner} style={[styles.corner, styles.bottomLeft]} />
              <View style={styles.corner} style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanText}>Escanee el código de barras del producto</Text>
          </View>
        </CameraView>
      </View>
    );
  }

  if (currentScreen === 'product-details' && product) {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Detalles del Producto</Text>
          
          {product.photoUri ? (
            <Image source={{ uri: product.photoUri }} style={styles.productImage} />
          ) : null}
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Código de Barras:</Text>
            <Text style={styles.value}>{product.barcode}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.value}>{product.description}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Unidad de Medida:</Text>
            <Text style={styles.value}>{product.unitOfMeasure}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Costo:</Text>
            <Text style={styles.value}>${product.cost.toFixed(2)}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Precio:</Text>
            <Text style={styles.value}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cantidad Actual:</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Ingrese cantidad"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleUpdateQuantity}>
              <Text style={styles.buttonText}>Actualizar Cantidad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (currentScreen === 'add-product') {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Agregar Nuevo Producto</Text>
          
          <Text style={styles.subtitle}>Código de Barras: {scannedBarcode}</Text>

          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.productImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Tomar Fotografía</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descripción:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Nombre del producto"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Unidad de Medida:</Text>
            <TextInput
              style={styles.input}
              value={unitOfMeasure}
              onChangeText={setUnitOfMeasure}
              placeholder="ej. Pieza, Kg, Litro"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Costo:</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Precio:</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cantidad:</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
              <Text style={styles.buttonText}>Guardar Producto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00ff00',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 280,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#666',
  },
  photoButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  photoPlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
