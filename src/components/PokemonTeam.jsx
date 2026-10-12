import React from "react"

export const PokemonTeam = ({ team, remove }) => {
    return (
        <article>
            {team.map((e) => (
                <div key={e.id}>
                    <p><img src={e.sprites.other['official-artwork'].front_default} alt={e.name} width={40}/>#{e.id} {e.name}  <button onClick={() => remove(e)}>X</button></p>
                </div>
            ))}
        </article>
    )   
}