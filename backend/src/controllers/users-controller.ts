import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserRepository } from '../repositories/prisma/user-repository';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from "../app";

const WEB_BASE_URL = process.env.WEB_BASE_URL
const API_BASE_URL = process.env.API_BASE_URL

const userRepository = new UserRepository();

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const users = await userRepository.getAllUsers();

    const sortedUsers = users.sort((a: any, b: any) => b.createdAt - a.createdAt);

    const usersJson = JSON.parse(
      JSON.stringify(sortedUsers, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({usersJson});
  } catch (error) {
    console.log("Erro ao localizar usuários: ", error)
    return res.status(500).send('Fetching users failed, please try again later.'); 
  }
};

export const setAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try{
    let { userId } = req.params

    userId = userId.toString()

    const identifiedUser = await userRepository.getUserById(userId)

    if (!identifiedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const statusChanged = !identifiedUser.isAdmin

    identifiedUser.isAdmin = statusChanged

    await userRepository.updateUser(userId, identifiedUser)

    return res.status(200).json({ message: 'Status de admin alterado com sucesso', status: statusChanged })
    
  } catch(err) {
    console.log("Erro ao trocar o estado: ", err)
    return res.status(500).json({ message: err })
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { name, password } = req.body;

  try {
    const identifiedUser = await userRepository.getUserByName(name);

    if (!identifiedUser) {
      return res.status(401).send("Usuário não encontrado, verifique sua senha e usuario!")
    }

    const adm = identifiedUser.isAdmin

    const userId = identifiedUser.id

    // const isPasswordValid = await bcrypt.compare(password, identifiedUser.password);
    //   if (!isPasswordValid) {
    //     return res.status(401).send("Usuário não encontrado, verifique sua senha e usuario!")
    //   }

    if(password ==! identifiedUser.password)
      return res.status(401).send("Usuário não encontrado, verifique sua senha e usuario!")


    const token = jwt.sign({ userId: identifiedUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h', 
    });

    return res.status(200).json({token, adm, userId});
  } catch (error) {
    console.log('Logging in failed with following error: ', error)
    return res.status(500).send('Logging in failed, please try again later.');
  }
};

export const signupByName= async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send("Invalid Input detected, please verify your data");
  }

  const { name, password } = req.body;

  try {
    // const saltRounds = 10

    // const hashPassword = async (password: any) => {
    //   const hash = await bcrypt.hash(password, saltRounds);
    //   return hash;
    // };
    
    // const hashedPassword = await hashPassword(password);

    const createdUser = await userRepository.createUser(
      name,
      // hashedPassword,
      password
    );

    const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h', 
    });

    const adm = createdUser.isAdmin
    const userId = createdUser.id

    return res.status(201).json({ token, adm, userId });
  } catch (error) {
    console.error("An error ha occured during signup: ", error)
    return res.status(500).send('Signing up failed, please try again later.');
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId
  const { password } = req.body
  let { updatedUserId } = req.body

  console.log('updated: ', updatedUserId)

  if(updatedUserId === 'no'){
    updatedUserId = userId
  }


  try{

    if(!updatedUserId){
      res.status(400).json({message: 'Invalid ID'})
      return
    }

    if(!userId){
      res.status(400).json({message: 'Invalid ID'})
      return
    }

    const identifiedUser = await userRepository.getUserById(userId)

    if(!identifiedUser){
      res.status(404).json({message: 'User not found!'})
    }

    
      await userRepository.updateUser(userId, {
        password
      })

    res.status(200).json({message: "User updated"})
    return

  } catch(err){
    console.error("Error: ", err)
    res.status(500).json({message: "An unexpected error has occured"})
    return
  }
  
}


export const getUserWithToken = async(req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
  const userId = req.userId;

  if(!userId){
    return res.status(404).json('Usuário não encontrado')
  }

  try{
    const identifiedUser = await userRepository.getUserById(userId)

    if(!identifiedUser){
      return res.status(404).json('Usuário não localizado')
    }
    const identifiedUserJson = JSON.parse(JSON.stringify(identifiedUser, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  
    return res.status(200).json({user: identifiedUserJson})
  } catch(err){
    res.status(500).json(err)
  }
}

export const deleteUser = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try{
    let { userId } = req.params

    userId = userId.toString()

    const deletedUser = await userRepository.deleteUser(userId)

    if(!deletedUser){
      return res.status(404).json({message: "Usuário não encontrado"})
    }

    return res.status(200).json({message: "Usuário deletado com sucesso: ", deletedUser})
  } catch (error){
    console.log("Erro ao deletar usuário: ", error)
    return res.status(500).json({message: "Um erro inesperado ocorreu: ", error})
  }
}
