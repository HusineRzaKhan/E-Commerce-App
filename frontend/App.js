import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import ProfileScreen from './screens/ProfileScreen2';
import CategoryScreen from './screens/CategoryScreen';
import AddProductScreen from './screens/AddProductScreen';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileSettings from './screens/ProfileSettings';
import Notifications from './screens/Notifications';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Product' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ title: 'Order Confirmation' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, primary: '#0b5cff', accent: '#000', background: '#ffffff', surface: '#f7fbff', text: '#000' }
      }}>
        <NavigationContainer>
          <AuthContext.Consumer>
                    {({ user, notificationsCount }) => (
              <RootStack.Navigator>
                <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
                  {() => (
                    <Tab.Navigator>
                      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
                      <Tab.Screen name="Categories" component={CategoryScreen} />
                              <Tab.Screen name="Notifications" component={Notifications} options={{ tabBarBadge: notificationsCount || undefined }} />
                      {user && user.role === 'seller' ? (
                        <Tab.Screen name="AddProduct" component={AddProductScreen} />
                      ) : (
                        <Tab.Screen name="Cart" component={CartScreen} />
                      )}
                      <Tab.Screen name="Profile" component={ProfileScreen} />
                    </Tab.Navigator>
                  )}
                </RootStack.Screen>
                <RootStack.Screen name="Login" component={LoginScreen} />
                <RootStack.Screen name="Register" component={RegisterScreen} />
                <RootStack.Screen name="ProfileSettings" component={ProfileSettings} options={{ title: 'Profile Settings' }} />
              </RootStack.Navigator>
            )}
          </AuthContext.Consumer>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
