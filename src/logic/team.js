import { db } from "../firebase"
import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore"

export async function writeTeam(pokemon) {
    try {
      await setDoc(doc(db, 'equipo', String(pokemon.id)), {
        pokemon: pokemon
      })
    } catch (err) {
      console.log(err)
    }
}

export async function removeTeam(pokemon) {
    try {
        await deleteDoc(doc(db, 'equipo', String(pokemon.id)))
    } catch (err) {
      console.log(err)
    }
}

export async function loadTeam() {
  try {
    const snap = await getDocs(collection(db, 'equipo'))
    const team = snap.docs.map((data) => data.data().pokemon).filter(Boolean)

    return { team, error: null }
  } catch (err) {
    return { team: [], error: err.message }
  }
}