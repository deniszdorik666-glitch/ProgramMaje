import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUALITY_OPTIONS = ['минимум', 'стандарт', 'высоко', 'очень высоко', 'ультра'];
const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const [showGraphics, setShowGraphics] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPoliceModal, setShowPoliceModal] = useState(false);
  const [showDownloadingModal, setShowDownloadingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Graphics settings
  const [textureQuality, setTextureQuality] = useState(2);
  const [drawDistance, setDrawDistance] = useState(2);
  const [shadowQuality, setShadowQuality] = useState(2);
  const [waterQuality, setWaterQuality] = useState(2);
  const [reflectionQuality, setReflectionQuality] = useState(2);
  const [brightness, setBrightness] = useState(50);
  const [gamma, setGamma] = useState(50);
  
  // Control settings
  const [sensitivityX, setSensitivityX] = useState(50);
  const [sensitivityY, setSensitivityY] = useState(50);
  const [cameraHeight, setCameraHeight] = useState(50);

  // Download state
  const [downloadProgress, setDownloadProgress] = useState(0);
  const downloadInterval = useRef<NodeJS.Timeout | null>(null);
  const cancelTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const graphics = await AsyncStorage.getItem('graphicsSettings');
      if (graphics) {
        const settings = JSON.parse(graphics);
        setTextureQuality(settings.textureQuality);
        setDrawDistance(settings.drawDistance);
        setShadowQuality(settings.shadowQuality);
        setWaterQuality(settings.waterQuality);
        setReflectionQuality(settings.reflectionQuality);
        setBrightness(settings.brightness);
        setGamma(settings.gamma);
      }

      const controls = await AsyncStorage.getItem('controlSettings');
      if (controls) {
        const settings = JSON.parse(controls);
        setSensitivityX(settings.sensitivityX);
        setSensitivityY(settings.sensitivityY);
        setCameraHeight(settings.cameraHeight);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveGraphicsSettings = async () => {
    try {
      await AsyncStorage.setItem('graphicsSettings', JSON.stringify({
        textureQuality,
        drawDistance,
        shadowQuality,
        waterQuality,
        reflectionQuality,
        brightness,
        gamma,
      }));
      setShowGraphics(false);
    } catch (error) {
      console.error('Error saving graphics settings:', error);
    }
  };

  const saveControlSettings = async () => {
    try {
      await AsyncStorage.setItem('controlSettings', JSON.stringify({
        sensitivityX,
        sensitivityY,
        cameraHeight,
      }));
      setShowControls(false);
    } catch (error) {
      console.error('Error saving control settings:', error);
    }
  };

  const handleDownloadGTA = () => {
    setShowPurchaseModal(true);
  };

  const handlePurchaseYes = () => {
    setShowPurchaseModal(false);
    startDownload();
  };

  const handlePurchaseNo = () => {
    setShowPurchaseModal(false);
    setShowPoliceModal(true);
  };

  const startDownload = () => {
    setShowDownloadingModal(true);
    setDownloadProgress(0);

    // 5 minutes for 0-100%, then 2 more minutes for "overflow"
    // Total: 7 minutes = 420 seconds
    // First 5 minutes (300 sec) = 0-100%
    // Next 2 minutes (120 sec) = 100-140% (visual overflow)
    
    let progress = 0;
    downloadInterval.current = setInterval(() => {
      progress += 100 / 300; // 100% over 300 seconds (5 min)
      setDownloadProgress(progress);

      if (progress >= 140) { // After 7 minutes (140%)
        if (downloadInterval.current) {
          clearInterval(downloadInterval.current);
        }
        setShowDownloadingModal(false);
        setShowErrorModal(true);
      }
    }, 1000);
  };

  const handleCancelDownload = () => {
    setShowCancelModal(true);
    
    cancelTimeout.current = setTimeout(() => {
      if (downloadInterval.current) {
        clearInterval(downloadInterval.current);
      }
      setShowCancelModal(false);
      setShowDownloadingModal(false);
    }, 10000);
  };

  const QualitySelector = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void;
  }) => (
    <View style={styles.qualitySelectorContainer}>
      <Text style={styles.qualityLabel}>{label}</Text>
      <View style={styles.qualityButtons}>
        {QUALITY_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.qualityButton,
              value === index && styles.qualityButtonActive,
            ]}
            onPress={() => onChange(index)}
          >
            <Text style={[
              styles.qualityButtonText,
              value === index && styles.qualityButtonTextActive,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Настройки</Text>

      <ScrollView style={styles.menuList}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowGraphics(true)}
        >
          <Ionicons name="image" size={24} color="#ff1493" />
          <Text style={styles.menuText}>Графика</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowControls(true)}
        >
          <Ionicons name="game-controller" size={24} color="#ff1493" />
          <Text style={styles.menuText}>Управление</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleDownloadGTA}
        >
          <Ionicons name="download" size={24} color="#ff1493" />
          <Text style={styles.menuText}>Скачать GTA V</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.versionText}>v{APP_VERSION}</Text>
      </ScrollView>

      {/* Graphics Modal */}
      <Modal visible={showGraphics} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Графика</Text>
          
          <ScrollView style={styles.modalScroll}>
            <QualitySelector
              label="Качество текстур"
              value={textureQuality}
              onChange={setTextureQuality}
            />
            <QualitySelector
              label="Дальность прорисовки"
              value={drawDistance}
              onChange={setDrawDistance}
            />
            <QualitySelector
              label="Качество теней"
              value={shadowQuality}
              onChange={setShadowQuality}
            />
            <QualitySelector
              label="Качество воды"
              value={waterQuality}
              onChange={setWaterQuality}
            />
            <QualitySelector
              label="Качество отражений"
              value={reflectionQuality}
              onChange={setReflectionQuality}
            />

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Яркость: {brightness}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={brightness}
                onValueChange={setBrightness}
                minimumTrackTintColor="#ff1493"
                maximumTrackTintColor="#333"
                thumbTintColor="#ff1493"
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Гамма: {gamma}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={gamma}
                onValueChange={setGamma}
                minimumTrackTintColor="#ff1493"
                maximumTrackTintColor="#333"
                thumbTintColor="#ff1493"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelBtn]}
              onPress={() => setShowGraphics(false)}
            >
              <Text style={styles.modalButtonText}>Выйти</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveBtn]}
              onPress={saveGraphicsSettings}
            >
              <Text style={styles.modalButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Controls Modal */}
      <Modal visible={showControls} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Управление</Text>
          
          <ScrollView style={styles.modalScroll}>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Чувствительность X: {sensitivityX}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={sensitivityX}
                onValueChange={setSensitivityX}
                minimumTrackTintColor="#ff1493"
                maximumTrackTintColor="#333"
                thumbTintColor="#ff1493"
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Чувствительность Y: {sensitivityY}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={sensitivityY}
                onValueChange={setSensitivityY}
                minimumTrackTintColor="#ff1493"
                maximumTrackTintColor="#333"
                thumbTintColor="#ff1493"
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Высота камеры: {cameraHeight}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={cameraHeight}
                onValueChange={setCameraHeight}
                minimumTrackTintColor="#ff1493"
                maximumTrackTintColor="#333"
                thumbTintColor="#ff1493"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelBtn]}
              onPress={() => setShowControls(false)}
            >
              <Text style={styles.modalButtonText}>Выйти</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveBtn]}
              onPress={saveControlSettings}
            >
              <Text style={styles.modalButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Purchase Question Modal */}
      <Modal visible={showPurchaseModal} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>У вас куплена GTA V?</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={[styles.alertButton, styles.noButton]}
                onPress={handlePurchaseNo}
              >
                <Text style={styles.alertButtonText}>Нет (скачать по тихому)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, styles.yesButton]}
                onPress={handlePurchaseYes}
              >
                <Text style={styles.alertButtonText}>Да</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Police Modal */}
      <Modal visible={showPoliceModal} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Ionicons name="warning" size={50} color="#ff4444" style={{ marginBottom: 15 }} />
            <Text style={styles.alertTitle}>К вам вызвали полицию!</Text>
            <Text style={styles.alertMessage}>Нечего пиратить игры</Text>
            <TouchableOpacity
              style={[styles.alertButton, styles.okButton]}
              onPress={() => setShowPoliceModal(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Downloading Modal */}
      <Modal visible={showDownloadingModal} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Скачивание GTA V</Text>
            <View style={styles.downloadProgressContainer}>
              <View 
                style={[
                  styles.downloadProgressBar, 
                  { width: `${Math.min(downloadProgress, 100)}%` }
                ]} 
              />
              {downloadProgress > 100 && (
                <View 
                  style={[
                    styles.downloadProgressOverflow, 
                    { width: `${downloadProgress - 100}%`, left: '100%' }
                  ]} 
                />
              )}
            </View>
            <Text style={styles.downloadPercentage}>
              {Math.floor(downloadProgress)}%
            </Text>
            <TouchableOpacity
              style={[styles.alertButton, styles.cancelDownloadButton]}
              onPress={handleCancelDownload}
            >
              <Text style={styles.alertButtonText}>Отменить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Отмена скачивания...</Text>
            <Text style={styles.alertMessage}>Подождите 10 секунд</Text>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={showErrorModal} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Ionicons name="close-circle" size={50} color="#ff4444" style={{ marginBottom: 15 }} />
            <Text style={styles.alertTitle}>Ошибка!</Text>
            <Text style={styles.alertMessage}>
              Извините, скачивание отменено. Вы нас обманули, у вас GTA не куплена в Play Маркете!
            </Text>
            <TouchableOpacity
              style={[styles.alertButton, styles.okButton]}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  menuList: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  menuText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 15,
  },
  qualitySelectorContainer: {
    marginBottom: 25,
  },
  qualityLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  qualityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualityButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  qualityButtonActive: {
    backgroundColor: '#ff1493',
    borderColor: '#ff1493',
  },
  qualityButtonText: {
    color: '#888',
    fontSize: 13,
  },
  qualityButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginBottom: 25,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#333',
  },
  saveBtn: {
    backgroundColor: '#ff1493',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  alertButtons: {
    width: '100%',
    gap: 10,
  },
  alertButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  noButton: {
    backgroundColor: '#333',
  },
  yesButton: {
    backgroundColor: '#ff1493',
  },
  okButton: {
    backgroundColor: '#ff1493',
    marginTop: 10,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadProgressContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'visible',
    marginVertical: 20,
    position: 'relative',
  },
  downloadProgressBar: {
    height: '100%',
    backgroundColor: '#ff1493',
    borderRadius: 10,
  },
  downloadProgressOverflow: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ff4444',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  downloadPercentage: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cancelDownloadButton: {
    backgroundColor: '#ff4444',
  },
});
