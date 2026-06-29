import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import { AllTicketsModal, type Cases } from "./step/allTickets";
import { NewTicketModal } from "./step/newTickerModal";
import { SelectedTicket } from "./step/selectedTicketModal";
import { api } from "../../../lib/axios";
import { AuthContext } from "../../../context/authContext";

export interface Users {
  name: string;
  id: string;
  isAdmin: boolean;
}

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
  const [ users, setUsers ] = useState<Users[]>([])

  useEffect(() => {
    getCases()
  }, [])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/users');
        const users: Users[] = response.data.usersJson;
        setUsers(users);
        console.log('Fetched users:', users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUsers();
  }, []);

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
    <div className="font-orbitron min-h-screen bg-[#09090b] flex overflow-hidden relative">
      <div className="absolute inset-0 bg-pattern bg-repeat opacity-5 pointer-events-none mix-blend-overlay"></div>
      <aside className="w-72 bg-[#0c0c0e]/95 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col justify-between z-20 shadow-2xl relative">
        <div className="p-6 flex flex-col gap-8 flex-1">
          <div className="flex justify-center items-center pb-6 border-b border-zinc-800/50">
            <img className="w-48 object-contain drop-shadow-lg" src="/ticket_logo.png" alt="logo" />
          </div>
          <nav className="flex flex-col gap-3">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2 px-2">Menu Principal</span>
            
            <div className="w-full transition-transform active:scale-95">
              <Button variant="primary" size="full" onClick={openAllTicketsModal}>
                <span className="text-lg tracking-wide">Todos os Tickets</span>
              </Button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent my-4" />

            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2 px-2">Filtros Rápidos</span>
            
            <div className="flex flex-col gap-3">
              <div className="transition-transform active:scale-95">
                <Button variant={isMyTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnMyModalFilter}>
                  <span className="text-[15px] font-medium tracking-wide">Meus Tickets</span>
                </Button>
              </div>

              <div className="transition-transform active:scale-95">
                <Button variant={isOpenTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnOpenTicketFilter}>
                  <span className="text-[15px] font-medium tracking-wide">Abertos</span>
                </Button>
              </div>

              <div className="transition-transform active:scale-95">
                <Button variant={isInProgressTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnInProgressTicketFilter}>
                  <span className="text-[15px] font-medium tracking-wide">Em Progresso</span>
                </Button>
              </div>

              <div className="transition-transform active:scale-95">
                <Button variant={isClosedTicketsFilterOn ? "primary" : "quaternary"} size="full" onClick={turnClosedTicketFilter}>
                  <span className="text-[15px] font-medium tracking-wide">Fechados</span>
                </Button>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-zinc-800/50 bg-[#0a0a0c]">
          <div className="transition-transform active:scale-95">
            <Button variant="terciary" size="full" onClick={logout}>
              <span className="text-lg font-medium text-red-400 hover:text-red-300">Sair do Sistema</span>
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen relative z-10">
        <header className="h-24 px-10 flex items-center justify-between bg-[#0c0c0e]/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-20">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight">
            Painel de Controle
          </h1>

          <div className="w-48 transition-transform active:scale-95 shadow-lg shadow-amber-500/10 rounded-xl">
            <Button variant="primary" size="full" onClick={openNewTicketModal}>
              <div className="flex items-center justify-center gap-2 py-1">
                <span className="text-2xl leading-none -mt-1">+</span>
                <span className="text-lg font-semibold tracking-wide">Novo Ticket</span>
              </div>
            </Button>
          </div>
        </header>
        <div className="flex-1 relative p-6 md:p-10 overflow-y-auto">
          {!isAllTicketsModalOpen && !isNewTicketModalOpen && !isSelectedTicketModalOpen && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
              <img src="/ticket_logo.png" alt="logo placeholder" className="w-64 grayscale opacity-20 blur-[2px] mb-8" />
              <p className="text-xl font-light tracking-widest uppercase">Selecione uma opção no menu lateral</p>
            </div>
          )}

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

          {isNewTicketModalOpen && (
            <NewTicketModal
              closeNewTicketModal={closeNewTicketModal}
              users={users}
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
      </main>
    </div>
  );
}