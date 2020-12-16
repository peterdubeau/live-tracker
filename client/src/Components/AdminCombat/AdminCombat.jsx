import React from 'react'
import { useHistory } from 'react-router-dom'
import GameWebSocket from '../GameWebSocket/GameWebSocket'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { takeTurn, destroyGame, removeCombatants, toLobby } from '../../services/games'
import '../AdminCombat/AdminCombat.css'

export default function AdminCombat(props) {

  const history = useHistory()

  function handleTakeTurn(arr) {
    arr.combatants.push(arr.combatants.shift())
    takeTurn(game.code, arr)
  }
  
  const { game } = props.gameData
  const userMap = game?.users?.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});

  function removeCombatant(id) {
    game.combatants.splice(game.combatants?.indexOf(id), 1)
    removeCombatants(props.match.params.code, game.combatants)
  }

  function sendToLobby() {
    if (window.confirm("Are you sure you want to end combat?")) {
      toLobby(game.code, [])
      history.push(`/game/${game.code}/DM/${props.match.params.username}`)
      window.location.reload()
    }
  }

  function endCombat() {
    if (window.confirm("Are you sure you want to end combat?")) {
      destroyGame(game.code)
      history.push('/')
      window.location.reload()
    }
  }

  return (<>
    <GameWebSocket
      cableApp={props.cableApp}
      updateApp={props.updateApp}
      getGameData={props.getGameData}
      code={props.match.params.code}
    />
    <Flipper className='combat-container' key={"flipper-thing"} flipKey={props.gameData} spring={'wobble'}>
      <button className='end-combat' onClick={endCombat}>End Combat</button> 
      <button className='end-combat' onClick={sendToLobby}>To Lobby</button> 
      <div className='user-list'>
      {game.combatants?.map(id =>
        <Flipped key={userMap[id].id + `flipped guy`} flipId={userMap[id].id}>
          <div className="user-details" key={userMap[id].id}>
            <button className='delete-user-combat' onClick={() => removeCombatant(userMap[id].id)}>X</button>
            <span>{userMap[id].username}</span> <span>{userMap[id].initiative}</span>
          </div>
        </Flipped>)}
      </div>
      <button onClick={() => handleTakeTurn(game)}>Next Turn</button>
      </Flipper>
    <h3 className='room-code'>Room Code: {game.code}</h3>
  </>)
}