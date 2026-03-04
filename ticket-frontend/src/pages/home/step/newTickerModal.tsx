import { Building, CircleAlert, Info, Key, User, X } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Button } from "../../../components/button" 
import { api } from "../../../../lib/axios" 
import { useNavigate } from "react-router-dom"

interface NewTicketModalProps {
  closeNewTicketModal: () => void,
}

export function NewTicketModal({ closeNewTicketModal}: NewTicketModalProps){
const [ selectedCompany, setSelectedCompany ] = useState<string>('')
const [ selectedPriority, setSelectedPriority ] = useState<string>('')


  async function login(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    
    const company = data.get('company')     
    const priority = data.get('priority')     
    const description = data.get('description')
    const openedByName = data.get('openedByName')
    console.log(company, priority, description, openedByName)

    try{
      await api.post('/cases/create', {
        openedByName,
        company,
        priority,
        description
      })

      closeNewTicketModal
    
    }catch(err){
      console.log('Erro:', err)
    }
  }



  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-160 rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex-col w-full text-center text-zinc-50">Login</h2>
            <button type="button" onClick={closeNewTicketModal}>
              <X className="size-5 text-zinc-400"/>
            </button>
          </div>
          <p className="text-zinc-50 text-sm">
            Entre com seu <span className="font-semibold text-zinc-50">Email</span> e <span className="font-semibold text-zinc-50">Senha</span>
          </p>
        </div>

        <form onSubmit={login} className="space-y-3">
          <div className="h-14 px-5 bg-zinc-950 text-zinc-50 rounded-lg flex items-center gap-2.5 justify-between">
            <User className="text-zinc-400 size-5"/>
            <input 
              type="text"
              name="openedByName" 
              placeholder="Nome de usuário" 
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
            <Info className="text-zinc-400 size-5"/>
          </div>

          <div className="h-32 px-5 py-3 bg-zinc-950 text-zinc-50 rounded-lg">
            <textarea
              name="description"
              placeholder="Descreva a situação"
              className="
                w-full 
                h-full 
                bg-transparent 
                text-lg 
                placeholder-zinc-400 
                outline-none 
                resize-none 
                overflow-y-auto
                wrap-break-words
              "
            />
          </div>

          <div className="h-14 text-zinc-50 rounded-lg flex items-center gap-2.5 justify-between w-full">
            <div className="h-14 px-5 bg-zinc-950 w-72 text-zinc-50 rounded-lg flex items-center gap-2.5">
              <Building className="text-zinc-400 size-5"/>
              <select name="company" className="p-1 outline-none w-full bg-black h-9 rounded-md text-zinc-50 border-zinc-950 border" onChange={(e) => setSelectedCompany(e.target.value)}>
                <option value="" disabled>
                  Empresa
                </option>
                <option value="KIA">KIA</option>
                <option value="FORD_CHAPECO">Ford Chapecó</option>
                <option value="FORD_XANXERE">Ford Xanxerê</option>
                <option value="LOCALIZA">Localiza</option>
              </select>
            </div>

            <div className="h-14 px-5 bg-zinc-950 w-72 text-zinc-50 rounded-lg flex items-center gap-2.5">
              <CircleAlert className="text-zinc-400 size-5"/>
              <select name="priority" className="p-1 outline-none w-full bg-black h-9 rounded-md text-zinc-50 border-zinc-950 border" onChange={(e) => setSelectedPriority(e.target.value)}>
                <option value="" disabled>
                  Qual a prioridade?
                </option> 
                <option value="VERY_LOW">Muito Baixa</option>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="VERY_HIGH">Muito Alta</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" size="full">
            Gerar
          </Button>
        </form>
      </div>
    </div>
  )
}