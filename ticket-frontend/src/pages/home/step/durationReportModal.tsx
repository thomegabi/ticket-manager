import type { DateRange } from "react-day-picker"
import { useEffect, useState } from "react"
import { api } from "../../../../lib/axios"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts"

interface ReportModalProps {
  selectedDateFilter?: DateRange
  onClose: () => void
}

interface ChartItem {
  date: string
  tickets: number
}

interface ReportData {
  totalTickets: number
  totalDuration: number
  averageDuration: number
  chartData: ChartItem[]
}

export function ReportModal({ selectedDateFilter, onClose }: ReportModalProps) {

  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchReport() {

      try {

        setLoading(true)

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

  useEffect(() => {

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)

    return () => window.removeEventListener("keydown", handleEsc)

  }, [onClose])

  return (

    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      onClick={onClose}
    >

      <div
        className="bg-zinc-900 border border-zinc-800 p-7 rounded-xl w-[520px] space-y-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="flex justify-between items-start">

          <div>

            <h3 className="text-xl font-semibold text-white">
              Relatório de Atendimento
            </h3>

            {selectedDateFilter?.from && selectedDateFilter?.to && (

              <p className="text-xs text-zinc-400 mt-1">

                {selectedDateFilter.from.toLocaleDateString()}
                {" — "}
                {selectedDateFilter.to.toLocaleDateString()}

              </p>

            )}

          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
          >
            ✕
          </button>

        </div>

        {loading ? (

          <div className="flex justify-center py-10">

            <div className="h-6 w-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"/>

          </div>

        ) : reportData && (

          <>

            {/* METRICS */}

            <div className="grid grid-cols-3 gap-3">

              <MetricCard
                label="Chamados"
                value={reportData.totalTickets}
                highlight
              />

              <MetricCard
                label="Duração Total"
                value={`${reportData.totalDuration}m`}
              />

              <MetricCard
                label="Média"
                value={`${reportData.averageDuration}m`}
              />

            </div>

            {/* CHART */}

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">

              <p className="text-xs text-zinc-400 mb-3">
                Chamados por dia
              </p>

              <ResponsiveContainer width="100%" height={180}>

                <BarChart data={reportData.chartData}>

                  <XAxis
                    dataKey="date"
                    stroke="#a1a1aa"
                    fontSize={11}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e4e4e7"
                    }}
                    labelStyle={{ color: "#000" }}   // ← DATA (linha de cima)
                    itemStyle={{ color: "#000" }}    // ← "tickets : 8"
                  />

                  <Bar
                    dataKey="tickets"
                    fill="#38bdf8"
                    radius={[4,4,0,0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </>

        )}

        <button
          onClick={onClose}
          className="w-full bg-sky-600 hover:bg-sky-500 transition text-white py-2 rounded-lg font-medium"
        >
          Fechar
        </button>

      </div>

    </div>

  )
}

function MetricCard({
  label,
  value,
  highlight
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {

  return (

    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">

      <p className="text-xs text-zinc-400">
        {label}
      </p>

      <p
        className={`text-2xl font-semibold mt-1 ${
          highlight ? "text-sky-400" : "text-black"
        }`}
      >
        {value}
      </p>

    </div>

  )

}