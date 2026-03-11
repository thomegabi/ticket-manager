import { Key, User, X } from "lucide-react"
import { useContext, type FormEvent } from "react"
import { Button } from "../../components/button"
import { api } from "../../../lib/axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../context/authContext"

interface SignUpModalProps {
  closeSignUpModal: () => void,
}

export function SignUpModal({ closeSignUpModal }: SignUpModalProps){
  const navigate = useNavigate()
   const { setToken } = useContext(AuthContext)

  async function createUser(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)
  

    const name = data.get('name')?.toString()
    const password = data.get('password')?.toString()

    try{
      const response = await api.post('/signup', {
        name,
        password,
      }
    )

    sessionStorage.setItem('token', response.data.token)

    setToken(response.data.token, response.data.adm)
      
      navigate('/home')
    }catch(e){
      console.log('Erro: ', e)
      alert('Dados incorretos')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-160 rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex-col w-full text-center text-zinc-50 ">Criar conta</h2>
            <button type="button" onClick={closeSignUpModal}>
              <X className="size-5 text-zinc-400"/>
            </button>
          </div>
          <p className="text-zinc-50 text-sm">
            Coloque seu <span className="font-semibold ">Nome</span>, <span className="font-semibold ">E-mail</span> e <span className="font-semibold ">Senha</span>
          </p>
        </div>

        <form onSubmit={createUser} className="space-y-3">

        <div className="h-14 px-5 bg-zinc-950 text-zinc-50 rounded-lg flex items-center gap-2.5">
            <User className="text-zinc-400 size-5"/>
            <input 
              type="text"
              name="name" 
              placeholder="Seu nome" 
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <div className="h-14 px-5 bg-zinc-950 text-zinc-50 rounded-lg flex items-center gap-2.5">
            <Key className="text-zinc-400 size-5"/>
            <input 
              type="password" 
              name="password" 
              placeholder="Sua senha" 
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <Button type="submit" variant="primary" size="full">
            Criar
          </Button>
        </form>
      </div>
    </div>
  )
}