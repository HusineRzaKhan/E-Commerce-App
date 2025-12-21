import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function OrderConfirmationScreen({ navigation }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:18, marginBottom:8 }}>Thank you! Your order was placed.</Text>
      <Text>Estimated delivery: 3-7 business days</Text>
      <Button style={{ marginTop: 12 }} mode="outlined" onPress={() => navigation.navigate('HomeMain')}>Back to Home</Button>
    </View>
  );
}
