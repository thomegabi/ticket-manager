import { Building, CircleAlert, User, X } from "lucide-react"
import { useContext, useState, type FormEvent } from "react"
import { Button } from "../../../components/button"
import { api } from "../../../../lib/axios"
import { AuthContext } from "../../../../context/authContext"
import type { Users } from ".."

interface NewTicketModalProps {
  closeNewTicketModal: () => void,
  users: Users[],
}

export function NewTicketModal({ closeNewTicketModal, users }: NewTicketModalProps){
  const [ selectedCompany, setSelectedCompany ] = useState<string>('KIA')
  const [ selectedPriority, setSelectedPriority ] = useState<string>('VERY_LOW')
  const [ selectedCreatorId, setSelectedCreatorId ] = useState<string>('')
  const [ errorHandler, setErrorHandler ] = useState<string | null>(null)
  const [ loading, setLoading ] = useState(false)
  
  const { isAdmin } = useContext(AuthContext)

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setErrorHandler(null)

    const data = new FormData(event.currentTarget)
    const description = data.get('description')?.toString()

    if(!selectedCompany?.trim()){
      setErrorHandler('Selecione uma empresa')
      setLoading(false)
      return
    }

    if(!selectedPriority?.trim()){
      setErrorHandler('Selecione uma prioridade valida')
      setLoading(false)
      return
    }

    try{
      await api.post('/cases/create', {
        company: selectedCompany,
        priority: selectedPriority,
        description,
        creatorId: isAdmin && selectedCreatorId ? selectedCreatorId : undefined
      })

      closeNewTicketModal()
    } catch(err){
      console.log('Erro:', err)
      setErrorHandler('Ocorreu um erro ao criar o chamado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl py-6 px-8 shadow-2xl bg-[#0c0c0e] border border-zinc-800/80 space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold w-full text-center text-zinc-100 tracking-wide">Abertura de Chamado</h2>
            <button type="button" onClick={closeNewTicketModal} className="p-1 rounded-md hover:bg-zinc-800 transition">
              <X className="size-5 text-zinc-400 cursor-pointer hover:text-red-500 transition-colors"/>
            </button>
          </div>
          <p className="text-zinc-400 text-sm text-center">
            Descreva a situação para a equipe
          </p>
        </div>

        <form onSubmit={createTicket} className="space-y-4">
          {isAdmin && (
            <div className="h-14 px-5 bg-zinc-900 border border-zinc-800/80 w-full text-zinc-50 rounded-xl flex items-center gap-3">
              <User className="text-zinc-500 size-5"/>
              <select 
                className="w-full bg-transparent outline-none text-zinc-200 cursor-pointer text-sm"
                onChange={(e) => setSelectedCreatorId(e.target.value)}
                value={selectedCreatorId}
              >
                <option value="" className="bg-zinc-900">Eu mesmo (Padrão)</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id} className="bg-zinc-900">
                    Abrir em nome de: {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="h-36 px-5 py-4 bg-zinc-900 border border-zinc-800/80 text-zinc-50 rounded-xl">
            <textarea
              name="description"
              placeholder="Descreva a situação detalhadamente..."
              required
              className="w-full h-full bg-transparent text-base placeholder-zinc-500 outline-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 h-14 px-4 bg-zinc-900 border border-zinc-800/80 text-zinc-50 rounded-xl flex items-center gap-3">
              <Building className="text-zinc-500 size-5 min-w-5"/>
              <select 
                name="company" 
                className="w-full bg-transparent outline-none text-zinc-200 cursor-pointer text-sm" 
                onChange={(e) => setSelectedCompany(e.target.value)}
                value={selectedCompany}
              >
                <option value="" disabled className="bg-zinc-900">Empresa</option>
                <option value="KIA" className="bg-zinc-900">KIA</option>
                <option value="FORD_CHAPECO" className="bg-zinc-900">Ford Chapecó</option>
                <option value="FORD_XANXERE" className="bg-zinc-900">Ford Xanxerê</option>
                <option value="LOCALIZA" className="bg-zinc-900">Localiza</option>
              </select>
            </div>

            <div className="flex-1 h-14 px-4 bg-zinc-900 border border-zinc-800/80 text-zinc-50 rounded-xl flex items-center gap-3">
              <CircleAlert className="text-zinc-500 size-5 min-w-5"/>
              <select
                name="priority"
                className="w-full bg-transparent outline-none text-zinc-200 cursor-pointer text-sm"
                onChange={(e) => setSelectedPriority(e.target.value)}
                value={selectedPriority}
              >
                <option value="" disabled className="bg-zinc-900">Prioridade</option> 
                <option value="VERY_LOW" className="bg-zinc-900">Muito Baixa</option>
                <option value="LOW" className="bg-zinc-900">Baixa</option>
                <option value="NORMAL" className="bg-zinc-900">Média</option>

                {isAdmin && (
                  <>
                    <option value="HIGH" className="bg-zinc-900 text-orange-400 font-semibold">Alta</option>
                    <option value="VERY_HIGH" className="bg-zinc-900 text-red-400 font-semibold">Muito Alta</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Erros */}
          {errorHandler && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
              <p className="text-red-400 font-medium text-sm">{errorHandler}</p>
            </div>
          )}

          {/* Botão de Envio */}
          <div className="pt-2">
            <Button variant="primary" size="full" disabled={loading}>
              {loading ? "Registrando Ticket..." : "Abrir Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}