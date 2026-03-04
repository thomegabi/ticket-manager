import { useState } from "react";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import { AllTicketsModal } from "./step/allTickets";
import { NewTicketModal } from "./step/newTickerModal";

export function HomePage() {
  const navigate = useNavigate()
  const [ isTicketModalOpen, setTicketModalOpen ] = useState(false);
  const [ isMyTicketsModalOpen, setMyTicketsModalOpen ] = useState(false)
  const [ isAllTicketsModalOpen, setAllTicketsModalOpen ] = useState(false)
  const [ isSelectedTicketsOpen, setSelectedTicketsOpen ] = useState(false);
  const [ selectedTicket, setSelectedTicket ] = useState<string | null>(null);
  const [ isNewTicketModalOpen, setNewTicketModalOpen ] = useState(false);

  function openNewTicketModal(){
    setNewTicketModalOpen(true)
  }

  function closeNewTicketModal(){
    setNewTicketModalOpen(false)
  }

  function openCaseModal() {
    closeAllModals()
    setTicketModalOpen(true);
  }
  
  function openMyTicketModal() {
    closeAllModals()
    setMyTicketsModalOpen(true);
  }

  function openAllTicketsModal() {
    closeAllModals()
    setAllTicketsModalOpen(true);
  }

  function handleTicketSelection(id: string) {
    setSelectedTicket(id); 
    openSelectedTicketModal()
  }

  function openSelectedTicketModal() {
    closeAllModals();
    setSelectedTicketsOpen(true);
  }

  function closeAllModals() {
    setTicketModalOpen(false);
    setMyTicketsModalOpen(false);
    setAllTicketsModalOpen(false);
    setSelectedTicketsOpen(false);
   // setSelectedCharacter(null);
  }

  async function logout(){
    sessionStorage.removeItem('token')

    navigate('/')
  }

  return (
    <div className="font-orbitron min-h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="relative w-350 h-198 pt-4">
        <div className="flex items-center justify-between gap-32 pl-5 pb-4 z-10">
          <img className="w-64"  src="../../public/ticket_logo.png" alt="logo" />
          <p className="text-zinc-950 font-orbitron text-5xl h-37.5 flex items-center pr-40">
            Ticket System
          </p>

          <div className="w-36">
            <Button variant="primary" size="full" onClick={openNewTicketModal}>
              <p className="text-2xl">+</p>
              <p>Novo Ticket</p>
            </Button>
          </div>

        </div>

        <div className="flex items-center z-10 gap-16">
          <div className="z-10 flex items-center">
            <div className="h-156.25 w-76.25 flex items-center z-10  flex-col gap-4 mb-3">
              <Button variant="primary" size="full" onClick={openAllTicketsModal}>
                <p className="text-[32px] font-light">Tickets</p>
              </Button>
              <Button variant="quaternary" size="full">
                <p className="text-[32px] font-light">Meus Tickets</p>
              </Button>
              <Button variant="quaternary" size="full" onClick={openMyTicketModal}>
                <p className="text-[32px] font-light">Tickets Abertos</p>
              </Button>
              <Button variant="terciary" size="full" onClick={logout}>
                <p className="text-[35px] font-light">Exit</p>
              </Button>
            </div>
          </div>

          <div className="z-10 flex items-center">
            <div className="w-260 h-156.25 border-2 border-sky-400 bg-white/60 z-10 mb-3 ">
              {isAllTicketsModalOpen && (
                <AllTicketsModal
                  handleTicketSelection={handleTicketSelection}
                />
              )}
              {isNewTicketModalOpen && (
                <NewTicketModal
                  closeNewTicketModal={closeNewTicketModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}