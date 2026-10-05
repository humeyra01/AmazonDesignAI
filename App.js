import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// Kendi bilgisayarının yerel IP adresi veya localhost bağlantısı
// Not: Fiziksel telefonda test ediyorsan localhost yerine bilgisayarının IP adresini (örn: http://192.168.1.X:3000) yazmalısın.
// Eski satır: const API_URL = 'http://localhost:3000/generate-image';
// Yeni satır:
const API_URL = 'http://192.168.1.14:3000/generate-image';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('white');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Güncellendi
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setGeneratedImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      Alert.alert('Uyarı', 'Lütfen önce bir ürün fotoğrafı seçin.');
      return;
    }

    setLoading(true);
    try {
      let promptText = "White background studio product shot";
      if (selectedStyle === 'wooden') {
        promptText = "Product on a premium sleek wooden table with soft lighting";
      } else if (selectedStyle === 'podium') {
        promptText = "Product standing on a modern minimalist luxury podium, studio render";
      }

      const response = await axios.post(API_URL, { prompt: promptText });

      if (response.data && response.data.imageUrl) {
        setGeneratedImage(response.data.imageUrl);
      } else {
        Alert.alert('Hata', 'Görsel oluşturulamadı.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Sunucuya bağlanırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>AmazonDesignAI</Text>
        <Text style={styles.subtitle}>Profesyonel Ürün Fotoğrafı Oluşturucu</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>
            {selectedImage ? '📸 Fotoğrafı Değiştir' : '📷 Ürün Fotoğrafı Yükle'}
          </Text>
        </TouchableOpacity>

        {selectedImage && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionLabel}>Yüklenen Görsel:</Text>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            </View>
        )}

        <Text style={styles.sectionLabel}>Stil Seçimi:</Text>
        <View style={styles.styleContainer}>
          <TouchableOpacity
              style={[styles.styleChip, selectedStyle === 'white' && styles.styleChipSelected]}
              onPress={() => setSelectedStyle('white')}
          >
            <Text style={selectedStyle === 'white' ? styles.chipTextSelected : styles.chipText}>
              {selectedStyle === 'white' ? '✓ ' : ''}Beyaz Arka Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.styleChip, selectedStyle === 'wooden' && styles.styleChipSelected]}
              onPress={() => setSelectedStyle('wooden')}
          >
            <Text style={selectedStyle === 'wooden' ? styles.chipTextSelected : styles.chipText}>
              {selectedStyle === 'wooden' ? '✓ ' : ''}Ahşap Masa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.styleChip, selectedStyle === 'podium' && styles.styleChipSelected]}
              onPress={() => setSelectedStyle('podium')}
          >
            <Text style={selectedStyle === 'podium' ? styles.chipTextSelected : styles.chipText}>
              {selectedStyle === 'podium' ? '✓ ' : ''}Lüks Podyum
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={[styles.generateButton, loading && styles.disabledButton]}
            onPress={handleGenerate}
            disabled={loading}
        >
          {loading ? (
              <ActivityIndicator color="#fff" />
          ) : (
              <Text style={styles.generateButtonText}>✨ Görsel Oluştur</Text>
          )}
        </TouchableOpacity>

        {generatedImage && (
            <View style={styles.resultContainer}>
              <Text style={styles.sectionLabel}>Oluşturulan Görsel:</Text>
              <Image source={{ uri: generatedImage }} style={styles.imagePreview} />
            </View>
        )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#232f3e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 10,
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  styleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    width: '100%',
  },
  styleChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  styleChipSelected: {
    backgroundColor: '#ff9900',
    borderColor: '#ff9900',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: '#ff9900',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 40,
  },
});
