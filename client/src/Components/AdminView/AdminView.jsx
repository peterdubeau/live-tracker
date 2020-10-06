import React from 'react'
import GameWebSocket from '../GameWebSocket/GameWebSocket'

export default function AdminView(props) {

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

        return (<>
          <GameWebSocket
          cableApp={props.cableApp}
          updateApp={props.updateApp}
          getGameData={props.getGameData}
          code={props.match.params.code}
          />
          admin view
          <h2>{props.match.params.username}'s game!</h2>
        {props.gameData.filter(status => status.is_admin === false).map(user => 
          <p key={user.username}>{user.id} -=-=-=- {user.username} : {user.initiative} ---------- {user.game_id}</p>
          )}
        </>)
      }

}
