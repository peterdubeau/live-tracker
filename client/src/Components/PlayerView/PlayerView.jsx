import React from 'react'
import GameWebSocket from '../GameWebSocket/GameWebSocket'

export default function ShowGame(props) {

  let host = props.gameData.filter(host => host.is_admin === true)
  const hostDetails = host.map(hostName => hostName.username)
  
  let list = props.gameData.sort(function(a,b){
    return b.initiative - a.initiative
    })


        return (<>
          <GameWebSocket
          cableApp={props.cableApp}
          updateApp={props.updateApp}
          getGameData={props.getGameData}
          code={props.match.params.code}
          />
          user view
        <h2>{hostDetails}'s game</h2>
        {list.filter(status => status.is_admin === false).map(user => 
          <p key={user.username}>{user.id} -=-=-=- {user.username} : {user.initiative}</p>
          )}
        </>)
      }


