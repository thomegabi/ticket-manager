import type { DateRange } from "react-day-picker"
import { useEffect, useState } from "react"
import { api } from "../../../../lib/axios"

interface ReportModalProps {
  selectedDateFilter?: DateRange
  onClose: () => void
}

interface ReportData {
  totalTickets: number
  totalDuration: number
  averageDuration: number
}

export function ReportModal({ selectedDateFilter, onClose }: ReportModalProps) {

  const [reportData, setReportData] = useState<ReportData>({
    totalTickets: 0,
    totalDuration: 0,
    averageDuration: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchReport() {

      try {

        const response = await api.get('/cases/report', {
          params: {
            startDate: selectedDateFilter?.from,
            endDate: selectedDateFilter?.to
          }
        })

        setReportData(response.data)

      } catch (error) {

        console.error("Erro ao buscar relatório", error)

      } finally {

        setLoading(false)

      }

    }

    fetchReport()

  }, [selectedDateFilter])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">

      <div className="bg-zinc-900 p-6 rounded-xl w-96 space-y-5">

        <h3 className="text-xl text-white font-semibold">
          Relatório de Atendimento
        </h3>

        {loading ? (

          <div className="text-zinc-400">Carregando relatório...</div>

        ) : (

          <div className="space-y-2 text-zinc-300">

            <div className="flex justify-between">
              <span>Chamados atendidos:</span>
              <span className="text-white">{reportData.totalTickets}</span>
            </div>

            <div className="flex justify-between">
              <span>Duração total:</span>
              <span className="text-white">{reportData.totalDuration} min</span>
            </div>

            <div className="flex justify-between">
              <span>Média por chamado:</span>
              <span className="text-white">{reportData.averageDuration} min</span>
            </div>

          </div>

        )}

        <button
          onClick={onClose}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg"
        >
          Fechar
        </button>

      </div>

    </div>
  )
}