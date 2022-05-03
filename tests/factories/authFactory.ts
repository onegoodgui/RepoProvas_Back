import faker from '@faker-js/faker'
import { client } from '../../src/database';
import bcrypt from 'bcrypt'
import supertest from 'supertest';
import { users } from '@prisma/client';
import app from '../../src/app.js';

const agent = supertest(app)

export async function createUser () {
  const user = {
    email: 'thisisthetime@email.com',
    password: "123456",
    hashedPassword: bcrypt.hashSync("123456", 10)
  };

  const insertedUser = await client.users.create({
		data: {
			email: user.email,
			password: bcrypt.hashSync(user.password, 10)
		}
	});

  return {user, insertedUser};
} 

export async function createSession(user: users){

  const session = await client.sessions.create({
    data:{
      userId:user.id
    }
  })
  
  return session
}

export async function Login(email: string, password: string){
  const {body: {token: token}} = await agent.post('/sign-in').send({email: email, password: password});
  return token
}