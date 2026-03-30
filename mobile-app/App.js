import React,{ useEffect,useState } from 'react'
import { View,Text,Button,FlatList,Alert } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API = "http://localhost:5000/api"

export default function App() {
  const [menu,setMenu] = useState([])
  const [cart,setCart] = useState([])

  useEffect(()=>{
    loadMenu()
    retryOfflineOrders()
  },[])

  const loadMenu = async () => {
    try {
      const res = await axios.get(`${API}/menu`)
      setMenu(res.data)
    } catch {
      Alert.alert("Offline mode")
    }
  }

  const placeOrder = async () => {
    const order = {
      items: cart,
      total: cart.reduce((a,b)=>a+b.price,0)
    }

    try {
      const res = await axios.post(`${API}/orders`, order)
      Alert.alert(`Order #${res.data.orderNumber}`)
      setCart([])
    } catch {
      await AsyncStorage.setItem('offlineOrder', JSON.stringify(order))
      Alert.alert("Saved offline. Will send later.")
    }
  }

  const retryOfflineOrders = async () => {
    const saved = await AsyncStorage.getItem('offlineOrder')
    if(!saved) return

    try {
      await axios.post(`${API}/orders`, JSON.parse(saved))
      await AsyncStorage.removeItem('offlineOrder')
    } catch {}
  }

  return (
    <View style={{ marginTop:50 }}>
      <FlatList
        data={menu}
        keyExtractor={i=>i._id}
        renderItem={({item})=>(
          <View>
            <Text>{item.name} ${item.price}</Text>
            <Button title="Add" onPress={()=>setCart([...cart,item])}/>
          </View>
        )}
      />
      <Button title="Order" onPress={placeOrder}/>
    </View>
  )
}