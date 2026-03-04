import { useEffect, useState } from "react";
import { api } from "../../../../../lib/axios";
import type { Cases } from "./allTickets";

interface SelectedCharacteProps{
  characterId: string | null
}

export function SelectedCharacter({ characterId } : SelectedCharacteProps){
  const [ tickets, setCharacter ] = useState<Cases[]>([])

  console.log("ID: ", characterId)


  useEffect(() => {
    async function getCharacters() {
      try {
        const response = await api.get(`/character/${characterId}`);
        if (response.data.character) {
          const char = response.data.character;
  
          // Formatação do objeto do personagem
          const formattedCharacter = {
            ...char,
            class: char.class.charAt(0).toUpperCase() + char.class.slice(1).toLowerCase(),
            faction: char.faction
              .replace(/_/g, ' ')
              .toLowerCase()
              .split(' ')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
            name: char.name.charAt(0).toUpperCase() + char.name.slice(1).toLowerCase(),
            race: char.race.charAt(0).toUpperCase() + char.race.slice(1).toLowerCase(),
          };
  
          setCharacter([formattedCharacter]); // Armazena como um array com um único elemento
        } else {
          console.warn("No character found in response.");
          setCharacter([]);
        }
      } catch (error) {
        console.error('Error occurred during characters fetch:', error);
        setCharacter([]);
      }
    }
  
    if (characterId) {
      getCharacters();
    }
  }, [characterId]);



  return(
    <div className=" w-full h-full font-jacquard12 py-3 px-7">
      <div className="text-4xl text-amber-600 w-full text-center pb-1">
        <h1>Selected Character</h1>
      </div>

      {character.map((character) => (
        <div className="w-full h-[535px] flex gap-6">
          <div className="w-[480px] space-y-9">
            <div className=" relative border-4 border-amber-950 w-full h-48 bg-black/80 rounded-lg px-2 pb-2">
              <div className="text-3xl">
                <div className="flex gap-2">
                  <p className="text-amber-600">Name: <span className="text-zinc-50">{character.name}</span></p>
                </div>
                
                <div className="flex gap-2">
                  <p className="text-amber-600">Sex: <span className="text-zinc-50">Unknown</span></p>
                </div>

                <div className="flex gap-2">
                  <p className="text-amber-600">Class: <span className="text-zinc-50">{character.class}</span></p>
                </div>

                <div className="flex gap-2">
                  <p className="text-amber-600">Race: <span className="text-zinc-50">{character.race}</span></p>
                </div>

                <div className="flex gap-2">
                  <p className="text-amber-600">Faction: <span className="text-zinc-50">{character.faction}</span></p>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-7">
              <div className="bg-black/80 w-[163px] h-[297px] border-2 border-amber-950 text-amber-400 text-2xl p-2 pt-4 space-y-2">
                <p>Level: <span className="text-zinc-50">{character.lvl}</span></p>
                <p>Vitality: <span className="text-zinc-50">{character.vitality}</span></p>
                <p>Resistance: <span className="text-zinc-50">{character.resistance}</span></p>
                <p>Strength: <span className="text-zinc-50">{character.strength}</span></p>
                <p>Dexterity: <span className="text-zinc-50">{character.dexterity}</span></p>
                <p>Inteligence: <span className="text-zinc-50">{character.inteligence}</span></p>
                <p>Faith: <span className="text-zinc-50">{character.faith}</span></p>
              </div>

              <div className="bg-black/80 w-[290px] h-[297px] border-2 border-amber-950 flex text-center p-2 flex-col space-y-3">
                <h1 className="text-amber-800 text-5xl w-full">Lore</h1>
                <p className="text-zinc-50">{character.lore}</p>
              </div>
            </div>
          </div>
          
          <div className="h-full border-2 border-amber-950 bg-black/80 w-[291px] flex items-center">
            {character.class === "Knight" && <img src="/classes/Knight.png" alt="Knight" />}
            {character.class === "Mage" && <img src="/classes/Mage.png" alt="Mage" />}
            {character.class === "Rogue" && <img src="/classes/Rogue.png" alt="Rogue" />}
          </div>
        </div>
      ))}

    </div>
  )
}