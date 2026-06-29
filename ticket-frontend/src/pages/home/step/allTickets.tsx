import { useContext, useEffect, useMemo, useState } from "react";
import { api } from "../../../../lib/axios";
import { CalendarCheck2, CalendarSearch, PcCase, RefreshCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { DateStep } from "./dateSelectionModal";
import { ReportModal } from "./durationReportModal";
import { AuthContext } from "../../../../context/authContext";

interface AllTicketsModalProps{
  handleTicketSelection: (id: string) => void;
  cases: Cases[]
  myTicketsFilter: boolean
  openTicketFilter: boolean
  closedTicketFilter: boolean
  inProgressTicketFilter: boolean
  onRefresh: () => Promise<void> | void
}

export interface Cases {
  id: string
  openedByName: string
  description: number
  priority: string
  status: string
  created_at: Date
  updated_at: Date
  company: string
  duration: number
  assignedUserName: string
  assignedToId: String
}

export function AllTicketsModal({ handleTicketSelection, cases, myTicketsFilter, openTicketFilter, closedTicketFilter, inProgressTicketFilter, onRefresh}: AllTicketsModalProps) {
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ isSelectDateOpen, setSelectDateOpen ] = useState(false)
  const [ isReportModalOpen, setReportModalOpen] = useState(false)
  const [ selectedDateFilter, setSelectedDateFilter ] = useState<DateRange | undefined>(undefined)

  const { isAdmin } = useContext(AuthContext)

  function closeReportModal(){
    setReportModalOpen(false)
  }

  function openReportModal() {
    setReportModalOpen(true);
  }

  function openSelectDate(){
    setSelectDateOpen(true)
  }

  function closeSelectDate(){
    setSelectDateOpen(false)
    setSelectedDateFilter(undefined)
  }

  function closeSelectDateWithDate(){
    setSelectDateOpen(false)
  }

  useEffect(() => {
      async function getUserId() {
        try{
          setUserId(null)
          const response = await api.get("user/token");
          setUserId(response.data.user.id)
        } catch(error){
          console.error('Erro', error)
        } 
      }
      getUserId()
    }, [])

  async function refreshCases() {
    if (loading) return
    
    try {
      setLoading(true)
      await onRefresh()
    } finally {
      setLoading(false)
    }
  }

  const filteredCases = useMemo(() => {
  return cases
    // busca
    .filter(caso =>
      caso.openedByName.toLowerCase().includes(search.toLowerCase()) ||
      caso.id.includes(search)
    )

    // meus tickets
    .filter(caso =>
      !myTicketsFilter || caso.assignedToId === userId
    )

    // status
    .filter(caso =>
      !openTicketFilter || caso.status === "OPEN"
    )
    .filter(caso =>
      !closedTicketFilter || caso.status === "CLOSED"
    )
    .filter(caso =>
      !inProgressTicketFilter || caso.status === "IN_PROGRESS"
    )

    .filter(caso => {
      if (!selectedDateFilter?.from && !selectedDateFilter?.to) return true

      const caseDate = new Date(caso.created_at)

      if (selectedDateFilter?.from) {
        const from = new Date(selectedDateFilter.from)
        from.setHours(0, 0, 0, 0)

        if (caseDate < from) return false
      }

      if (selectedDateFilter?.to) {
        const to = new Date(selectedDateFilter.to)
        to.setHours(23, 59, 59, 999)

        if (caseDate > to) return false
      }

      return true
    })

}, [
  cases,
  search,
  userId,
  myTicketsFilter,
  openTicketFilter,
  closedTicketFilter,
  inProgressTicketFilter,
  selectedDateFilter
])

  function getStatusStyle(status: string) {
    switch (status) {
      case "OPEN":
        return "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20"
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20"
      case "CLOSED":
        return "bg-zinc-500/10 text-zinc-300 ring-1 ring-inset ring-zinc-500/20"
      default:
        return "bg-zinc-800 text-white ring-1 ring-inset ring-zinc-700"
    }
  }

  function getPriorityStyle(priority: string) {
    switch (priority) {
      case "VERY_LOW":
        return "bg-cyan-500/10 text-cyan-400 ring-1 ring-inset ring-cyan-500/20"
      case "LOW":
        return "bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20"
      case "NORMAL":
        return "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20"
      case "HIGH":
        return "bg-orange-500/10 text-orange-400 ring-1 ring-inset ring-orange-500/20"
      case "VERY_HIGH":
        return "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20"
      default:
        return "bg-zinc-800 text-white ring-1 ring-inset ring-zinc-700"
    }
  }

  function translateStatus(status: string) {
    switch (status) {
      case "OPEN":
        return "Aberto"
      case "IN_PROGRESS":
        return "Em andamento"
      case "CLOSED":
        return "Fechado"
      default:
        return status
    }
  }

  function translatePriority(priority: string) {
    switch (priority) {
      case "VERY_LOW":
        return "Muito baixa"
      case "LOW":
        return "Baixa"
      case "NORMAL":
        return "Normal"
      case "HIGH":
        return "Alta"
      case "VERY_HIGH":
        return "Muito alta"
      default:
        return priority
    }
  }

  function translateCompany(company: string) {
    switch (company) {
      case "FORD_CHAPECO": return "Ford Chapecó"
      case "FORD_XANXERE": return "Ford Xanxerê"
      case "LOCALIZA": return "Localiza"
      case "KIA": return "KIA"
      default: return company
    }
  }

  return (
    <div className="inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="w-full h-full max-w-screen-2xl bg-[#09090b] border border-zinc-800/60 shadow-2xl flex flex-col space-y-6 rounded-3xl p-6 md:p-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Painel de Tickets
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isAdmin && (
              <button
                onClick={openReportModal}
                title="Relatórios"
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-amber-500 px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-sm"
              >
                <PcCase className="size-5" />
              </button>
            )}

            <button
              onClick={refreshCases}
              title="Atualizar"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <RefreshCcw className={`size-5 ${loading ? "animate-spin text-amber-500" : ""}`} />
            </button>

            <button 
              onClick={openSelectDate}
              title="Filtrar por Data"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              {selectedDateFilter !== undefined ? (
                <CalendarCheck2 className="size-5 text-amber-500" />
              ) : (
                <CalendarSearch className="size-5" />
              )}
            </button>

            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Buscar ticket ou usuário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800/80 text-zinc-200 placeholder:text-zinc-500 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total de Tickets" value={filteredCases.length} />
          <StatCard title="Abertos" value={filteredCases.filter(c => c.status === "OPEN").length} indicatorColor="bg-emerald-500" />
          <StatCard title="Em andamento" value={filteredCases.filter(c => c.status === "IN_PROGRESS").length} indicatorColor="bg-amber-500" />
          <StatCard title="Fechados" value={filteredCases.filter(c => c.status === "CLOSED").length} indicatorColor="bg-zinc-500" />
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto rounded-2xl border border-zinc-800/60 bg-[#0c0c0e] shadow-inner [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0c0c0e]/90 backdrop-blur-md sticky top-0 z-10 text-zinc-400 uppercase text-xs font-semibold tracking-wider border-b border-zinc-800/80">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/50">
              {filteredCases.map((caso) => (
                <tr
                  key={caso.id}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    #{caso.id.slice(0, 6)}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-200">
                    {caso.openedByName}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {translateCompany(caso.company)}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(caso.status)}`}>
                      {translateStatus(caso.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(caso.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle(caso.priority)}`}>
                      {translatePriority(caso.priority)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-300">
                    {caso.assignedUserName}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTicketSelection(caso.id)}
                      className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-4 py-2 rounded-lg text-xs transition-all active:scale-95 shadow-sm"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    Nenhum ticket encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isSelectDateOpen && (
        <DateStep 
          closeSelectDate={closeSelectDate}
          selectedDate={setSelectedDateFilter}
          closeSelectDateWithDate={closeSelectDateWithDate}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          onClose={closeReportModal}
          selectedDateFilter={selectedDateFilter}
        />
      )}
    </div>
  )
}

/* Stat Card Otimizado */
function StatCard({ title, value, indicatorColor }: { title: string, value: number, indicatorColor?: string }) {
  return (
    <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col group hover:bg-zinc-800/40 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {indicatorColor && <div className={`size-2 rounded-full ${indicatorColor}`} />}
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
      </div>
      <span className="text-zinc-100 text-3xl font-bold tracking-tight">{value}</span>
      
      {/* Efeito visual de fundo */}
      <div className="absolute -bottom-6 -right-6 size-24 bg-gradient-to-tl from-zinc-800/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}