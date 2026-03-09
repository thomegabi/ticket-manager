import { X } from "lucide-react";
import { useState } from "react";
import { type DateRange, DayPicker} from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "../../../components/button";

interface DateStepProps{
  closeSelectDate: () => void
  closeSelectDateWithDate: () => void
  selectedDate: React.Dispatch<React.SetStateAction<DateRange | undefined>> 
}




export function DateStep({ closeSelectDate, selectedDate, closeSelectDateWithDate } : DateStepProps ) {
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>(undefined) 

  function closeModal(){
    selectedDate(eventStartAndEndDates)
    closeSelectDateWithDate()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-800 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold h- ">Selecione uma data</h2>
            <button type="button" onClick={closeSelectDate}>
              {eventStartAndEndDates === undefined ? (
                <X className="size-5 text-white"/>
              ) : (
                <p className="size-5 text-white hover:text-rose-900 pr-10 pb-10">Limpar Filtro</p>
              )}
            </button>
          </div>
        </div>
        <DayPicker
          mode="range"
          selected={eventStartAndEndDates}
          onSelect={setEventStartAndEndDates}
          className="
            p-4 rounded-lg
            bg-zinc-900
            text-white
            border border-zinc-700
          "
          classNames={{
            caption_label: "text-white font-semibold",
            head_cell: "text-zinc-400",
            day: "text-white hover:bg-sky-600/30",
            today: "border border-sky-400",
            selected: "bg-sky-400 text-white",
            range_start: "bg-sky-400 text-white",
            range_end: "bg-sky-400 text-white",
            range_middle: "bg-sky-500/40 text-white rounded-none -mx-1",
            nav_button: "text-sky-400 hover:text-sky-300"
          }}
        />

        <div className="flex items-center justify-center">
          <Button  variant="primary" size="full" onClick={() => closeModal()}>Buscar</Button>
        </div>
      </div>
    </div>
  )
}