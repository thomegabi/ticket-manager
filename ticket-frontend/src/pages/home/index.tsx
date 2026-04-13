import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import { AllTicketsModal, type Cases } from "./step/allTickets";
import { NewTicketModal } from "./step/newTickerModal";
import { SelectedTicket } from "./step/selectedTicketModal";
import { api } from "../../../lib/axios";
import { AuthContext } from "../../../context/authContext";

export function HomePage() {
  const navigate = useNavigate()
  const { isAdmin } = useContext(AuthContext)
  const [ isMyTicketsFilterOn, setMyTicketsFilterOn ] = useState(false)
  const [ isAllTicketsModalOpen, setAllTicketsModalOpen ] = useState(false)
  const [ isOpenTicketsFilterOn, setOpenTicketsFilterOn ] = useState(false)
  const [ isClosedTicketsFilterOn, setClosedTicketsFilterOn ] = useState(false)
  const [ isInProgressTicketsFilterOn, setInProgressTicketsFilterOn ] = useState(false)
  const [ selectedTicket, setSelectedTicket ] = useState<string | null>(null);
  const [ isNewTicketModalOpen, setNewTicketModalOpen ] = useState(false);
  const [ isSelectedTicketModalOpen, setSelectedTicketModalOpen ] = useState(false)
  const [ cases, setTickets ] = useState<Cases[]>([])

  useEffect(() => {
    getCases()
  }, [])

  async function getCases() {
    try {
      const endpoint = isAdmin ? '/cases' : '/cases/myCases';

      const response = await api.get(endpoint);

      const cases = response.data?.casesJson;

      if (cases) {
        const formattedTickets = cases
          .map((caso: Cases) => ({
            ...caso,
            status: caso.status.toUpperCase(),
          }))
          .sort(
            (a: Cases, b: Cases) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

        setTickets(formattedTickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error(error);
      setTickets([]);
    }
  }

  function handleTicketUpdated(updatedTicket: Cases) {
      if (updatedTicket && updatedTicket.id) {
        setTickets((prevForms) =>
          prevForms.map((form) =>
            form.id === updatedTicket.id ? updatedTicket : form
          )
        );
      } else {
        console.error("updatedTicket está indefinido ou não possui 'id':", updatedTicket);
      }
    }
  
  function closeSelectedTicketModal(){
    setSelectedTicketModalOpen(false)
  }

  function openSelectedTicketModal() {
    setSelectedTicketModalOpen(true);
  }

  function openNewTicketModal(){
    setNewTicketModalOpen(true)
  }

  function closeNewTicketModal(){
    setNewTicketModalOpen(false)
  }
  
  function turnMyModalFilter() {
    setMyTicketsFilterOn(!isMyTicketsFilterOn);
  }
  
  function turnOpenTicketFilter() {
    setClosedTicketsFilterOn(false)
    setInProgressTicketsFilterOn(false)
    setOpenTicketsFilterOn(!isOpenTicketsFilterOn);
  }

  function turnClosedTicketFilter() {
    setOpenTicketsFilterOn(false)
    setInProgressTicketsFilterOn(false)
    setClosedTicketsFilterOn(!isClosedTicketsFilterOn);
  }

  function turnInProgressTicketFilter() {
    setOpenTicketsFilterOn(false)
    setClosedTicketsFilterOn(false);
    setInProgressTicketsFilterOn(!isInProgressTicketsFilterOn)
  }

  function openAllTicketsModal() {
    closeAllModals()
    setAllTicketsModalOpen(true);
    setMyTicketsFilterOn(false);
  }

  function handleTicketSelection(id: string) {
    setSelectedTicket(id); 
    openSelectedTicketModal()
  }

  function closeAllModals() {
    setAllTicketsModalOpen(false);
    setSelectedTicketModalOpen(false);
  }

  async function logout(){
    sessionStorage.removeItem('token')

    navigate('/')
  }

  return (
    <div className="font-orbitron min-h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="relative w-400 h-198 pt-4">
        <div className="flex items-center justify-between gap-32 pl-5 pb-4 z-10">
          <img className="w-64"  src="/ticket_logo.png" alt="logo" />
          <p className="text-zinc-50 font-orbitron text-5xl h-37.5 flex items-center pr-40">
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
            <div className="h-156.25 w-76.25 flex items-center z-10  flex-col gap-4">

              <Button variant="primary" size="full" onClick={openAllTicketsModal}>
                <p className="text-[24px] font-light">Tickets</p>
              </Button>

              <div className="relative flex-col gap-4 flex items-center">
                <div className="w-37.5 h-px bg-zinc-50 absolute"/>
              </div>

              <div className="flex-col gap-4 flex items-center">
                <Button variant={isMyTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnMyModalFilter}>
                  <p className="text-[24px] font-light">Meus Tickets</p>
                </Button>

                <Button variant={isOpenTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnOpenTicketFilter}>
                  <p className="text-[24px] font-light">Tickets Abertos</p>
                </Button>

                <Button variant={isClosedTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnClosedTicketFilter}>
                  <p className="text-[24px] font-light">Tickets Fechados</p>
                </Button>

                <Button variant={isInProgressTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnInProgressTicketFilter}>
                  <p className="text-[24px] font-light">Tickets Em Progresso</p>
                </Button>
              </div>

                <div className="relative flex-col gap-4 flex items-center">
                  <div className="w-37.5 h-px bg-zinc-50 absolute"/>
                </div>

                <Button variant="terciary" size="full" onClick={logout}>
                  <p className="text-[24px] font-light">Sair</p>
                </Button>

            </div>
          </div>

          <div className="z-10 flex items-center">
            <div className="w-308 h-156.25 rounded-full">
              {isAllTicketsModalOpen && (
                <AllTicketsModal
                  handleTicketSelection={handleTicketSelection}
                  cases={cases}
                  myTicketsFilter={isMyTicketsFilterOn}
                  openTicketFilter={isOpenTicketsFilterOn}
                  closedTicketFilter={isClosedTicketsFilterOn}
                  inProgressTicketFilter={isInProgressTicketsFilterOn}
                  onRefresh={getCases}
                />
              )}
              {isNewTicketModalOpen === true && (
                <NewTicketModal
                  closeNewTicketModal={closeNewTicketModal}
                />
              )}
              {isSelectedTicketModalOpen && (
                <SelectedTicket
                  onClose={closeSelectedTicketModal}
                  ticketId={selectedTicket}
                  onTicketUpdated={handleTicketUpdated}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}