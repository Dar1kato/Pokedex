import { db } from "../firebase"
import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore"

function teamCollection(uid) {
    return collection(db, "usuarios", uid, "equipo")
}

export async function writeTeam(uid, pokemon) {
    await setDoc(doc(teamCollection(uid), String(pokemon.id)), {
      pokemon
    })
}

export async function removeTeam(uid, pokemon) {
    await deleteDoc(doc(teamCollection(uid), String(pokemon.id)))
}

export async function loadTeam(uid) {
  try {
    const snap = await getDocs(teamCollection(uid))
    const team = snap.docs.map((data) => data.data().pokemon).filter(Boolean)

    return { team, error: null }
  } catch (err) {
    return {
      team: [],
      error: err instanceof Error ? err.message : "Error desconocido al cargar el equipo."
    }
  }
}