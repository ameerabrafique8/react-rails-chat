import { useState, useEffect } from 'react'
import './App.css'

const ws = new WebSocket("ws://localhost:3000/cable")

function App() {
  const [messages, setMessages] = useState([])
  const [guid, setGuid] = useState("")
  const messagesContainer = document.getElementById('messages')

  ws.onopen = () => {
    console.log('Connected to webSocket server')
    setGuid(Math.random().toString(36).substring(2,15))

    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "MessagesChannel",
        })
      })
    )
  };
  ws.onerror = (error) => {
    console.error('WebSocket not connected: error -> ', error);
  };
  

  const fetchMessages = async() =>{
    const response = await fetch('http://localhost:3000/messages')
    const data = await response.json()
    console.log('data: ',data)
    setMessagesAndScrollDown(data)
  }

  const setMessagesAndScrollDown = (data) => {
    console.log('dataaaaaaa: ',data)
    setMessages(data)
    if(messagesContainer){
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }

  useEffect(()=>{
    fetchMessages()
  },[])

  return (
    <div className='App'>
      <div className='messageHeader'>
        <h1>Messages</h1>
        <p style={{color: 'red'}}>Guid: {guid}</p>
      </div>

      <div className='messages' id='messages' style={{backgroundColor:'orange', color: 'yellow'}}>
        {messages.map((msg)=> (
           <div className='messages' key={msg.id}>
            <p>msg: {msg.body}</p>
          </div>
        ))}
      </div>

      <div className='messageForm'>
        <form onSubmit={handleSumbit}>
          <input className='messageInput' type='text' name='message'/>
        </form>
      </div>
    </div>
  )
}

export default App
