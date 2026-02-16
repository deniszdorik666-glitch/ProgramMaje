import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SERVERS = [
  'Kyiv City', 'Lviv District', 'Odesa Coast', 'Kharkiv State', 'Dnipro City',
  'Zaporizhzhia Bay', 'Mykolaiv Port', 'Chernihiv Lands', 'Poltava Hills', 'Vinnytsia Valley',
  'Zhytomyr Region', 'Rivne District', 'Lutsk City', 'Uzhhorod Valley', 'Ivano City',
  'Ternopil State', 'Kropyvnytskyi Zone', 'Cherkasy Shore', 'Sumy District', 'Khmelnytskyi Plains',
  'Bila Tserkva', 'Boryspil City', 'Mariupol Coast', 'Melitopol District', 'Berdyansk Bay',
  'Sloviansk City', 'Kramatorsk State', 'Kolomyia Valley', 'Drohobych City', 'Mukachevo Hills',
];

const MAX_ONLINE = 5000;

function getOnlineRange(): { min: number; max: number } {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 2 && hour < 12) {
    return { min: 100, max: 800 };
  } else if (hour >= 12 && hour < 18) {
    return { min: 1000, max: 3000 };
  } else {
    return { min: 4000, max: 5000 };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function ServersScreen() {
  const [onlineCounts, setOnlineCounts] = useState<number[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const { min, max } = getOnlineRange();
    const initial = SERVERS.map(() => Math.floor(Math.random() * (max - min + 1)) + min);
    setOnlineCounts(initial);

    const interval = setInterval(() => {
      const { min, max } = getOnlineRange();
      setOnlineCounts(prev => prev.map(count => {
        const change = Math.floor(Math.random() * 21) - 10;
        const newValue = count + change;
        return clamp(newValue, min, max);
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleServerPress = (server: string) => {
    setSelectedServer(server);
    setShowNicknameModal(true);
  };

  const validateNickname = (value: string): boolean => {
    const regex = /^[A-Z][a-z]+_[A-Z][a-z]+$/;
    return regex.test(value);
  };

  const handleConnect = () => {
    if (!validateNickname(nickname)) {
      Alert.alert(
        'Неверный формат',
        'Никнейм должен быть в формате Имя_Фамилия (например: Ivan_Petrov)'
      );
      return;
    }

    setShowNicknameModal(false);
    setShowLoadingModal(true);
    setLoadingProgress(0);

    let progress = 0;
    loadingInterval.current = setInterval(() => {
      progress += 100 / 60;
      setLoadingProgress(Math.min(progress, 100));

      if (progress >= 100) {
        if (loadingInterval.current) {
          clearInterval(loadingInterval.current);
        }
        setShowLoadingModal(false);
        Alert.alert(
          'Ошибка',
          'Сначала скачайте GTA V в разделе "настройки"',
          [{ text: 'OK' }]
        );
      }
    }, 1000);
  };

  const cancelLoading = () => {
    if (loadingInterval.current) {
      clearInterval(loadingInterval.current);
    }
    setShowLoadingModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Сервера</Text>
      <Text style={styles.subtitle}>Выберите сервер для игры</Text>

      <ScrollView style={styles.serverList}>
        {SERVERS.map((server, index) => (
          <TouchableOpacity
            key={server}
            style={styles.serverItem}
            onPress={() => handleServerPress(server)}
          >
            <View style={styles.serverInfo}>
              <Ionicons name="server" size={24} color="#ff1493" />
              <Text style={styles.serverName}>{server}</Text>
            </View>
            <View style={styles.onlineContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>
                {onlineCounts[index] || 0}/{MAX_ONLINE}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showNicknameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подключение к {selectedServer}</Text>
            <Text style={styles.modalSubtitle}>Введите ваш никнейм (Имя_Фамилия)</Text>
            
            <TextInput
              style={styles.nicknameInput}
              placeholder="Ivan_Petrov"
              placeholderTextColor="#666"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="words"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNicknameModal(false)}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.connectButton]}
                onPress={handleConnect}
              >
                <Text style={styles.buttonText}>Подключиться</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showLoadingModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подключение...</Text>
            <Text style={styles.modalSubtitle}>{selectedServer}</Text>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${loadingProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.floor(loadingProgress)}%</Text>

            <ActivityIndicator size="large" color="#ff1493" style={styles.loader} />

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { marginTop: 20 }]}
              onPress={cancelLoading}
            >
              <Text style={styles.buttonText}>Отмена</Text>
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
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  serverList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  serverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  serverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serverName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff00',
    marginRight: 8,
  },
  onlineText: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  nicknameInput: {
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  connectButton: {
    backgroundColor: '#ff1493',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff1493',
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});
