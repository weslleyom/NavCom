
import express from 'express'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()




const app = express()
const port = 3000;
app.use(express.json())

//Criar contato
app.post('/contato', async  (req, res) => {

   await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        numero: req.body.numero
      }

    })
    res.status(201).json(req.body)
});
//Listar contatos
app.get('/contato', async (req, res) => {
 const listactt = await prisma.user.findMany()
 res.status(200).json(listactt)

});

//Editar contato
app.put('/contato/:id', async  (req, res) => {

  await prisma.user.update({
    where:{
      id: req.params.id
    },
     data: {
       name: req.body.name,
       email: req.body.email,
       numero: req.body.numero
     }

   })
   res.status(201).json(req.body)
});

//Deletar contato
app.delete('/contato/:id', async (req, res) => {
  await prisma.user.delete({
    where:{
      id: req.params.id
    }
  })
  res.status(200).json({message: "Contato deletado com sucesso!"})
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://127.0.0.1:${port}`);
  })

