import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SkytrainProvider, useSkytrain } from './src/context/SkytrainContext';
import { LookupScreen } from './src/screens/LookupScreen';
import { FleetScreen } from './src/screens/FleetScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SkytrainOperator } from './src/types/skytrain';

type TabId = 'lookup' | 'fleet' | 'history' | 'settings';

function MainAppContent() {
  const { settings, rideLogs, riddenCarIds } = useSkytrain();
  const [activeTab, setActiveTab] = useState<TabId>('lookup');
  const [selectedCarNumber, setSelectedCarNumber] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<SkytrainOperator | null>('BCRTC');

  const handleJumpToCar = (carNumber: string, operator: SkytrainOperator) => {
    setSelectedCarNumber(carNumber);
    setSelectedOperator(operator);
    setActiveTab('lookup');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Top SkyTrain Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.skytrainIconCircle}>
            <Ionicons name="train" size={20} color="#0F172A" />
          </View>
          <View style={styles.brandText}>
            <Text style={styles.appTitle}>SkytrainDex</Text>
            <Text style={styles.appSubtitle}>
              Vancouver’s SkyTrain fleet
            </Text>
          </View>
        </View>

        <View style={styles.headerCounters}>
          <View style={styles.counterPill}>
            <Text style={styles.counterValue}>{riddenCarIds.size}</Text>
            <Text style={styles.counterLabel}>Cars</Text>
          </View>
          <View style={styles.counterPill}>
            <Text style={[styles.counterValue, { color: '#38BDF8' }]}>
              {rideLogs.length}
            </Text>
            <Text style={styles.counterLabel}>Rides</Text>
          </View>
        </View>
      </View>

      {/* Active Screen Body */}
      <View style={styles.body}>
        {activeTab === 'lookup' && (
          <LookupScreen
            initialCarNumber={selectedCarNumber}
            initialOperator={selectedOperator}
          />
        )}
        {activeTab === 'fleet' && settings.showFleetPokedex && (
          <FleetScreen onSelectCar={handleJumpToCar} />
        )}
        {activeTab === 'history' && (
          <HistoryScreen onSelectCar={handleJumpToCar} />
        )}
        {activeTab === 'settings' && <SettingsScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <SafeAreaView edges={['bottom']} style={styles.tabBarSafe}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('lookup')}
          >
            <Ionicons
              name={activeTab === 'lookup' ? 'search' : 'search-outline'}
              size={22}
              color={activeTab === 'lookup' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'lookup' && styles.tabLabelActive,
              ]}
            >
              Search
            </Text>
          </TouchableOpacity>

          {settings.showFleetPokedex && (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('fleet')}
            >
              <Ionicons
                name={activeTab === 'fleet' ? 'grid' : 'grid-outline'}
                size={22}
                color={activeTab === 'fleet' ? '#38BDF8' : '#64748B'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'fleet' && styles.tabLabelActive,
                ]}
              >
                Fleet
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('history')}
          >
            <Ionicons
              name={activeTab === 'history' ? 'time' : 'time-outline'}
              size={22}
              color={activeTab === 'history' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'history' && styles.tabLabelActive,
              ]}
            >
              Ride Log
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('settings')}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={activeTab === 'settings' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'settings' && styles.tabLabelActive,
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SkytrainProvider>
        <MainAppContent />
      </SkytrainProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  skytrainIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    flex: 1,
    minWidth: 0,
  },
  appTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  appSubtitle: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  headerCounters: {
    flexDirection: 'row',
    gap: 8,
  },
  counterPill: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 50,
  },
  counterValue: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },
  counterLabel: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  tabBarSafe: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  tabBar: {
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
});
