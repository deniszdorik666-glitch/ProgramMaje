import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const APP_VERSION = '1.0.0';

export default function HomeScreen() {
  const handleResourcePress = () => {
    Alert.alert('Недоступно', 'Пока не доступно');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../assets/images/majestic-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.subtitle}>GTA 5 Roleplay Project</Text>
        <Text style={styles.byText}>by derol</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.emoji}>🚗</Text>
          <Text style={styles.descriptionTitle}>
            Majestic RP — это не просто сервер, это целая жизнь в GTA 5
          </Text>
          
          <Text style={styles.descriptionText}>
            Ищешь топовый GTA RP проект без скуки и пустых серверов? Тогда тебе на Majestic RP 😈{"\n"}
            Здесь каждый игрок — часть живого города, где всё решают не скрипты, а люди.
          </Text>

          <Text style={styles.sectionTitle}>🔥 Что тебя ждёт:</Text>
          <Text style={styles.featureText}>— Огромный онлайн и активное комьюнити</Text>
          <Text style={styles.featureText}>— Уникальная экономика без халявы</Text>
          <Text style={styles.featureText}>— Сотни работ: от таксиста до криминального авторитета</Text>
          <Text style={styles.featureText}>— Фракции, бизнесы, войны, сделки и предательства</Text>
          <Text style={styles.featureText}>— Максимальный реализм и атмосферный RP</Text>

          <Text style={styles.descriptionText}>{"\n"}
            💰 Хочешь подняться с нуля до миллионера? Легко.{"\n"}
            🚓 Хочешь стать копом и кошмарить бандитов? Пожалуйста.{"\n"}
            🔫 Хочешь уйти в криминал и держать район? Добро пожаловать.
          </Text>

          <Text style={styles.highlightText}>
            Majestic RP — это место, где каждый день происходит новая история.
            Никаких сценариев, никаких ограничений — только ты, город и твои решения.
          </Text>

          <Text style={styles.footerText}>
            Если надоел скучный гейминг и хочется настоящей движухи — ты знаешь, куда заходить 😉
          </Text>
        </View>

        <Text style={styles.resourcesTitle}>Наши ресурсы</Text>
        
        <View style={styles.resourcesContainer}>
          <TouchableOpacity style={styles.resourceButton} onPress={handleResourcePress}>
            <Ionicons name="globe-outline" size={24} color="#ff1493" />
            <Text style={styles.resourceText}>Сайт</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceButton} onPress={handleResourcePress}>
            <Ionicons name="paper-plane-outline" size={24} color="#ff1493" />
            <Text style={styles.resourceText}>Telegram</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceButton} onPress={handleResourcePress}>
            <Ionicons name="logo-vk" size={24} color="#ff1493" />
            <Text style={styles.resourceText}>ВКонтакте</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceButton} onPress={handleResourcePress}>
            <Ionicons name="logo-instagram" size={24} color="#ff1493" />
            <Text style={styles.resourceText}>Instagram</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>v{APP_VERSION}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ff1493',
    marginBottom: 20,
  },
  descriptionContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff1493',
    marginTop: 10,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginTop: 15,
    lineHeight: 22,
  },
  footerText: {
    fontSize: 14,
    color: '#ff1493',
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  resourcesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  resourceButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: '#333',
  },
  resourceText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
});
