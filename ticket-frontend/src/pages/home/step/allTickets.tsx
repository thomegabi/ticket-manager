import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../lib/axios";
import { CalendarCheck2, CalendarSearch, RefreshCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { DateStep } from "./dateSelectionModal";


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
  duration: string
  assignedUserName: string
  assignedToId: String
}

export function AllTicketsModal({ handleTicketSelection, cases, myTicketsFilter, openTicketFilter, closedTicketFilter, inProgressTicketFilter, onRefresh}: AllTicketsModalProps) {
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ isSelectDateOpen, setSelectDateOpen ] = useState(false)
  const [ selectedDateFilter, setSelectedDateFilter ] = useState<DateRange | undefined>(undefined)

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

    // filtro de data (day-picker)
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
        return "bg-emerald-500/20 text-emerald-400"
      case "IN_PROGRESS":
        return "bg-yellow-500/20 text-yellow-400"
      case "CLOSED":
        return "bg-zinc-500/20 text-zinc-300"
      default:
        return "bg-zinc-700 text-white"
    }
  }

  function getPriorityStyle(priority: string) {
    switch (priority) {
      case "VERY_LOW":
        return "bg-cyan-500/20 text-cyan-400"
      case "LOW":
        return "bg-green-500/20 text-green-400"
      case "NORMAL":
        return "bg-yellow-500/20 text-yellow-300"
      case "HIGH":
        return "bg-red-500/20 text-red-300"
      case "VERY_HIGH":
        return "bg-violet-500/20 text-violet-300"
      default:
        return "bg-zinc-700 text-white"
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
    <div className="inset-0  flex items-center justify-center z-50 ">
      <div className="w-full h-full bg-zinc-900 shadow-2xl p-6 flex flex-col space-y-6 rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">
            Tickets
          </h2>

          <div className="flex gap-2 w-fit">
            <button
              onClick={refreshCases}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
            >
              <span className={`${loading ? "animate-spin" : ""}`}>
                <RefreshCcw className="size-5"/>
              </span>
            </button>

            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2" onClick={openSelectDate}>
              {selectedDateFilter !== undefined ? (
                <CalendarCheck2 className="size-5 text-sky-400"/>
              ) : (
                <CalendarSearch className="size-5"/>
              )}
            </button>

            <input
              type="text"
              placeholder="Buscar ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total" value={filteredCases.length} />
          <StatCard title="Abertos" value={filteredCases.filter(c => c.status === "OPEN").length} />
          <StatCard title="Em andamento" value={filteredCases.filter(c => c.status === "IN_PROGRESS").length} />
          <StatCard title="Fechados" value={filteredCases.filter(c => c.status === "CLOSED").length} />
        </div>

        {/* Table */}
        <div className="overflow-y-auto h-100 rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Empresa</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data</th>
                <th className="p-4">Prioridade</th>
                <th className="p-4">Responsável</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((caso) => (
                <tr
                  key={caso.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                >
                  <td className="p-4 text-zinc-400">#{caso.id.slice(0,6)}</td>
                  <td className="p-4 text-white">{caso.openedByName}</td>
                  <td className="p-4 text-zinc-400">{translateCompany(caso.company)}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(caso.status)}`}>
                      {translateStatus(caso.status)}
                    </span>
                  </td>

                  <td className="p-4 text-zinc-400">
                    {new Date(caso.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(caso.priority)}`}>
                      {translatePriority(caso.priority)}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`p-4 text-white`}>
                      {caso.assignedUserName}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleTicketSelection(caso.id)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  )
}

/* Stat Card */
function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 flex flex-col">
      <span className="text-zinc-400 text-sm">{title}</span>
      <span className="text-white text-2xl font-semibold">{value}</span>
    </div>
  )
}