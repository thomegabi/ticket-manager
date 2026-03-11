import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CaseRepository } from '../repositories/prisma/cases-repository';
import 'dotenv/config'
import { UserRepository } from '../repositories/prisma/user-repository';

const WEB_BASE_URL = process.env.WEB_BASE_URL
const API_BASE_URL = process.env.API_BASE_URL

const caseRepository = new CaseRepository();
const userRepository = new UserRepository();

export const getCases = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const cases = await caseRepository.getAllCases();

    const sortedCases = cases.sort((a: any, b: any) => b.createdAt - a.createdAt);

    const casesJson = JSON.parse(
      JSON.stringify(sortedCases, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    const casesWithUser = await Promise.all(
      casesJson.map(async (caso: any) => {
        let assignedUserName = "";

        if (caso.assignedToId) {
          const user = await userRepository.getUserById(caso.assignedToId);
          assignedUserName = user?.name ?? "";
        }

        return {
          ...caso,
          assignedUserName
        };
      })
    );

    return res.status(200).json({ casesJson: casesWithUser });

  } catch (error) {
    console.log("Erro ao localizar usuários: ", error)
    return res.status(500).send('Fetching users failed, please try again later.'); 
  }
};

export const getCasesById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let { caseId } = req.params
  caseId = caseId.toString()

  try {
    const ticket = await caseRepository.getCaseById(caseId)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    let assignedUserName = ""

    if (ticket.assignedToId) {
      const user = await userRepository.getUserById(ticket.assignedToId)
      assignedUserName = user?.name ?? ""
    }

    const response = {
      ...ticket,
      assignedUserName
    }

    return res.status(200).json({ ticket: response })

  } catch (err) {
    console.error('Fetching tickets failed: ', err)
    return res.status(500).send('Fetching tickets failed, please try again later.')
  }
}

export const getDurationReport = async (req: Request, res: Response): Promise<Response> => {
  try {

    const { startDate, endDate } = req.query as {
      startDate?: string
      endDate?: string
    }

    let userId = req.userId
    userId = userId?.toString()

    if (!userId) {
      return res.status(403).send('Usuario não identificado. Acesso negado')
    }

    const report = await caseRepository.getDurationReport(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    return res.status(200).json(report)

  } catch (error) {

    console.error("Erro ao gerar relatório:", error)

    return res.status(500).json({
      message: "Erro ao gerar relatório"
    })
  }
}

export const createCase = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send("Invalid Input detected, please verify your data");
  }

  const { openedByName, company, priority, description, assignedToId} = req.body;

  try {
    await caseRepository.createCase(
      openedByName,
      company,
      priority,
      description
    );


    return res.status(201).send('Chamado aberto');
  } catch (error) {
    console.error("An error ha occured during signup: ", error)
    return res.status(500).send('Signing up failed, please try again later.');
  }
};

export const updateCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let { caseId } = req.params
  const { description, status, duration, priority, company, created_at } = req.body
  const userId = req.userId

  caseId = caseId.toString()

  try{

    if(!caseId){
      res.status(400).json({message: 'Invalid ID'})
      return
    }

    const identifiedCase = await caseRepository.getCaseById(caseId)

    if(!identifiedCase){
      res.status(404).json({message: 'Case not found!'})
      return
    }

    
      await caseRepository.updateCase(caseId, {
        company: company ?? undefined,
        priority: priority ?? undefined,
        status: status ?? undefined,
        description: description ?? undefined,
        duration: duration ?? undefined,
        assignedToId: userId ?? undefined,
        created_at: created_at ?? undefined
      })
    
    const updatedTicket = await caseRepository.getCaseById(caseId)

    res.status(200).json({updatedTicket})
    return

  } catch(err){
    console.error("Error: ", err)
    res.status(500).json({message: "An unexpected error has occured"})
    return
  }
  
}

export const deleteCase = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    let { caseId } = req.params

    caseId = caseId.toString()

    const deletedCase = await caseRepository.deleteCase(caseId)

    if(!deletedCase){
      return res.status(404).json({message: "Chamado não encontrado"})
    }

    return res.status(200).json({message: "Chamado deletado com sucesso: ", deletedCase})
  } catch (error){
    console.log("Erro ao deletar usuário: ", error)
    return res.status(500).json({message: "Um erro inesperado ocorreu: ", error})
  }
}
