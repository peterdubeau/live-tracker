import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { readGame, postUser, deleteUser, sendCombatants } from '../../services/games'
import GameWebSocket from '../GameWebSocket/GameWebSocket'
import './AdminLobby.css'

export default function AdminLobby(props) {
  
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    initiative: "",
    code: '',
    is_admin: false
  })
  
  const handleSubmit = async () => {
    try {
      let roomId = await readGame(props.match.params.code)
      await postUser({
        username: formData.username,
        game_id: roomId.id,
        initiative: formData.initiative,
        is_admin: false
      })
      setFormData({
        id: "",
        username: "",
        initiative: "",
        code: roomId.id,
        is_admin: false
      })
    } catch (error) {
        console.log(error)
    }
  }
  
  const handleChange = (e) => {
      setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }))
      e.persist()
    }
  
    if (!props.gameData) {
      setTimeout(function () {
        window.location.reload(1);
      }, 500);
    
      
      return (<>
        <GameWebSocket
          cableApp={props.cableApp}
          updateApp={props.updateApp}
          getGameData={props.getGameData}
          code={props.match.params.code}
        />
      "loading game..."
      </>)
        
    } else {
  
      let code = props.match.params.code
      let list = props.gameData
      let combatants = props.userList(list)

      function startCombat() {
        sendCombatants(code, combatants)
        history.push(`/combat/${code}/DM/${props.match.params.username}`)
      }

      return (<>
        <GameWebSocket
          cableApp={props.cableApp}
          updateApp={props.updateApp}
          getGameData={props.getGameData}
          code={props.match.params.code}
        />
        <h2>{props.match.params.username}'s game!</h2>
        <h3>Room Code: {code}</h3>
        <Flipper key={"flipper-thing"} flipKey={props.gameData} spring={'wobble'}>
          <div className='user-details-lobby'>
          {props.gameData.filter(status => status.is_admin === false).map((user, i) =>
            <Flipped key={user.id + " flip key"} flipId={user.id}>
              <p key={user.id}>
                <button className ="user-options" id="delete" onClick={() => deleteUser(user.id)}>X</button>
                {user.username} : {user.initiative} 
                <button className="user-options" id="move-up" onClick={() => props.arrange(i)}>↑</button> 
                <button className="user-options" id="move-down" onClick={() => props.arrangeDown(i)}>↓</button>
              </p>
           </Flipped>
            )}
          </div>
        </Flipper>
        <label >
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enemy Name"
          />
          <input
            name="initiative"
            type="text"
            value={formData.initiative}
            onChange={handleChange}
            placeholder="initiative"
          />
        </label>
        <button className="user-options" onClick={handleSubmit}>Add Enemy</button>
        <button className="user-options" onClick={() => props.sort()}>Quick sort descending</button>
        <button onClick={startCombat}>Start Combat</button> 
      </>)
    }

  }

