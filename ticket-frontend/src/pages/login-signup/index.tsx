import {  useState } from "react";
import { Button } from "../../components/button";
import { SignUpModal } from "./singUpModal";
import { LoginModal } from "./loginModal";


export function LoginSignupPage(){

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);



  function openLoginModal(){
    setLoginModalOpen(true);
  }

  function closeLoginModal(){
    setLoginModalOpen(false);
  }

  function openSingUpModal(){
    setSignUpModalOpen(true);
  }

  function closeSignUpModal(){
    setSignUpModalOpen(false);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-[625px] space-y-4 w-full px-6 text-center justify-items-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <img src="/Logo_Ticket.png" alt="Ticket Logo" />
        </div>
        <div className="flex items-center flex-col w-96 justify-center gap-3">
        
          <Button onClick={openSingUpModal} variant="primary" size="full">Criar Conta</Button>

          <Button onClick={openLoginModal} variant="secondary" size="full">Login</Button>
        
        </div>
      </div>

      {isSignUpModalOpen && (
        <SignUpModal
          closeSignUpModal={closeSignUpModal}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          closeLoginModal={closeLoginModal}
        />
      )}

    </div>
  )
}