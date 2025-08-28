import { Router } from "express"

export function createExpertiseRouter() {
  const router = Router();

	// create Profession by admin
	router.post('/professions', (_req, res)=>{
		res.json({message:"hello world"})
	})

	// update professino by admin 
	router.put('/professions/:id', (_req, res)=>{
		res.json({message:"hello world"})
	})
	// fetch all professions by admin and user 
	router.get('/professions', (_req, res)=>{
		res.json({message:"hello world"})
	})

	// fetch profession details by admin and user 
	router.get('/professions/:id', (_req, res)=>{
		res.json({message:"hello world"})
	})

	// save a user's expertise by user 
	router.post('/:userId', (_req, res)=>{
		res.json({message:"hello world"})
	})

	// update a user's expertise  by user 
	router.put('/:userId', (_req, res)=>{
		res.json({message:"hello world"})
	})

  return router;
}
