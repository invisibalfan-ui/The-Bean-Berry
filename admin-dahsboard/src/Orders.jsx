import React,{ useEffect,useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

const API = "http://localhost:5000/api"
const socket = io('http://localhost:5000')

export default function Orders() {
  const [orders,setOrders] = useState([])

  const load = async () => {
    const res = await axios.get(`${API}/orders`)
    setOrders(res.data)
  }

  useEffect(()=>{
    load()
    socket.on('newOrder', o => setOrders(prev => [o,...prev]))
    socket.on('updateOrder', u => {
      setOrders(prev => prev.map(o => o._id===u._id?u:o))
    })
  },[])

  const update = async (id,status) => {
    await axios.put(`${API}/orders/${id}`, { status })
  }

  return (
    <div>
      <h2>Orders</h2>
      {orders.map(o=>(
        <div key={o._id}>
          #{o.orderNumber} - {o.status}
          <button onClick={()=>update(o._id,'preparing')}>Prep</button>
          <button onClick={()=>update(o._id,'ready')}>Ready</button>
        </div>
      ))}
    </div>
  )
}