'use strict'

const Route = use('Route')

// Route.on('/').render('welcome')
//Route.on('/').render('main')

Route.get('/', 'RecipeController.index')

//recept létrehozásához
Route.get('/recipes/create', 'RecipeController.create')
Route.post('/recipes/create', 'RecipeController.doCreate')

Route.get('/recipes/:id', 'RecipeController.show')

//recept szerkesztéséhez
Route.get('/recipes/:id/edit', 'RecipeController.edit')
Route.post('/recipes/:id/edit', 'RecipeController.doEdit')

//recept törléséhez
Route.get('/recipes/:id/delete', 'RecipeController.delete')