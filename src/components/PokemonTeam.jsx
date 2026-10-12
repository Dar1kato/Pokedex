import React from "react"

export const PokemonTeam = ({ team, remove }) => {
    return (
        <article>
            {team.map((e) => (
                <div key={e.id}>
                    <p>#{e.id} {e.name}  <button onClick={() => remove(e)}>X</button></p>
                </div>
            ))}
        </article>
    )   
}