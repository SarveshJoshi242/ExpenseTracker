import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/layout/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => {
            const { MaterialIcons } = require('@expo/vector-icons');
            return <MaterialIcons name="home" size={size} color={color} />;
          }
        }} 
      />
      <Tabs.Screen 
        name="transactions" 
        options={{ 
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => {
            const { MaterialIcons } = require('@expo/vector-icons');
            return <MaterialIcons name="receipt" size={size} color={color} />;
          }
        }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{ 
          title: 'Add',
        }} 
      />
      <Tabs.Screen 
        name="stats" 
        options={{ 
          title: 'Stats',
          tabBarIcon: ({ color, size }) => {
            const { MaterialIcons } = require('@expo/vector-icons');
            return <MaterialIcons name="pie-chart" size={size} color={color} />;
          }
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => {
            const { MaterialIcons } = require('@expo/vector-icons');
            return <MaterialIcons name="person" size={size} color={color} />;
          }
        }} 
      />
      {/* Hidden budget tab in bottom bar if we want it accessible but not visible in the main 5 slots. Let's map it somewhere else or just add it. The prompt says 5 tabs: Home, Transactions, (Add button), Stats, Profile. Let's stick to these 5 for the bar. */}
      <Tabs.Screen
        name="budget"
        options={{
          href: null // hides from tab bar
        }}
      />
    </Tabs>
  );
}
