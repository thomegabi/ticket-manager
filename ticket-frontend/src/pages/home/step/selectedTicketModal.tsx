import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../../../ticket-frontend/lib/axios";
import type { Cases } from "./allTickets";
import { Button } from "../../../components/button";

interface SelectedTicketProps {
  ticketId: string | null
  onClose: () => void
  onTicketUpdated: (updatedTicket: Cases) => void
}

export function SelectedTicket({ ticketId, onClose, onTicketUpdated }: SelectedTicketProps) {

  const [ticket, setTicket] = useState<Cases | null>(null)

  async function updateTicket(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const status = data.get('status')?.toString()
    const description = data.get('description')?.toString()
    const duration = data.get('duration')?.toString()
    const priority = data.get('priority')?.toString()
    const company = data.get('company')?.toString()

    try {

      const response = await api.put(`/update/${ticketId}`, {
        description,
        status,
        duration,
        priority,
        company
      })

      console.log(response)

      const updatedTicket = response.data.updatedTicket

      if (updatedTicket && updatedTicket.id) {
        onTicketUpdated(updatedTicket)
        onClose()
      }
      onClose()

    } catch(e){
      console.log(e)
    }
  }

  useEffect(() => {

    async function getTicket() {

      try {

        const response = await api.get(`/case/${ticketId}`);

        if (response.data.ticket) {

          const t = response.data.ticket

          const formattedTicket: Cases = {
            ...t,
            priority: t.priority,
            status: t.status,
            company: t.company,
            openedByName:
              t.openedByName.charAt(0).toUpperCase() +
              t.openedByName.slice(1).toLowerCase(),
            assignedUserName:
              t.assignedUserName
                ? t.assignedUserName.charAt(0).toUpperCase() +
                  t.assignedUserName.slice(1).toLowerCase()
                : "Não atribuído"
          }

          setTicket(formattedTicket)
        }

      } catch (error) {
        console.error("Error fetching ticket:", error)
      }
    }

    if (ticketId) {
      getTicket()
    }

  }, [ticketId])

  if (!ticketId || !ticket) return null

  return (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="w-225 max-w-[95vw] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-6 space-y-6">

      <div className="flex justify-between items-start border-b border-zinc-800 pb-3">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Editar Ticket
          </h2>

          <span className="text-zinc-500 text-sm">
            #{ticket.id.slice(0,8)}
          </span>
        </div>

        <div className="text-right text-sm text-zinc-400 space-y-1">
          <div>
            Criado em:{" "}
            <span className="text-white">
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
          </div>

          {ticket.updated_at && (
            <div>
              Atualizado em:{" "}
              <span className="text-white">
                {new Date(ticket.updated_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white ml-4"
        >
          ✕
        </button>

      </div>

      <form onSubmit={updateTicket} className="space-y-6">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <span className="text-zinc-400 text-sm">Aberto por</span>
            <div className="text-white mt-1">
              {ticket.openedByName}
            </div>
          </div>

          <div>
            <span className="text-zinc-400 text-sm">Responsável</span>
            <div className="text-white mt-1">
              {ticket.assignedUserName}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-zinc-400 text-sm">Empresa</span>

            <select
              name="company"
              defaultValue={ticket.company}
              className="bg-zinc-800 text-white p-2 rounded-lg"
            >
              <option value="FORD_CHAPECO">Ford Chapecó</option>
              <option value="FORD_XANXERE">Ford Xanxerê</option>
              <option value="LOCALIZA">Localiza</option>
              <option value="KIA">KIA</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-zinc-400 text-sm">Status</span>

            <select
              name="status"
              defaultValue={ticket.status}
              className="bg-zinc-800 text-white p-2 rounded-lg"
            >
              <option value="OPEN">Aberto</option>
              <option value="IN_PROGRESS">Em andamento</option>
              <option value="CLOSED">Fechado</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-zinc-400 text-sm">Prioridade</span>

            <select
              name="priority"
              defaultValue={ticket.priority}
              className="bg-zinc-800 text-white p-2 rounded-lg"
            >
              <option value="VERY_LOW">Muito baixa</option>
              <option value="LOW">Baixa</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">Alta</option>
              <option value="VERY_HIGH">Muito alta</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-zinc-400 text-sm">Duração</span>

            <input
              name="duration"
              defaultValue={ticket.duration}
              className="bg-zinc-800 text-white p-2 rounded-lg"
            />
          </div>

        </div>

        <div className="flex flex-col gap-2">
          <span className="text-zinc-400 text-sm">Descrição</span>

          <textarea
            name="description"
            defaultValue={ticket.description}
            className="bg-zinc-800 text-white p-3 rounded-lg h-32 resize-none"
          />
        </div>

        <Button type="submit" variant="primary" size="full">
          Atualizar Ticket
        </Button>
      </form>
    </div>
  </div>
)
}