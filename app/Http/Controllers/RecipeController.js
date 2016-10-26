'use strict'

const Database = use('Database')
const Category = use('App/Model/Category')
const Validator = use('Validator')
const Recipe = use('App/Model/Recipe')


class RecipeController {
    * index(request, response){

        //const categories = yield Database.from('categories').select('*');
        //response.send(categories)

        const categories = yield Category.all()

        for (let category of categories){
            const topRecipies = yield category.recipes().limit(3).fetch();
            category.topRecipes = topRecipies.toJSON()
        }

        yield response.sendView('main', {        
             categories: categories.toJSON()
        })
    }

    * create(request, response){
        const categories = yield Category.all();

        yield response.sendView('createRecipe', {
            categories: categories.toJSON()
        });
    }

    * doCreate(request, response){
        const recipeData = request.except('_csrf');
        const rules = {
            name: 'required',
            ingredients: 'required',
            instructions: 'required',
            category_id: 'required'
        }

        const validation = yield Validator.validateAll(recipeData, rules);
        if(validation.fails()){
            yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()

            response.redirect('back')
            return
        }
        yield Recipe.create(recipeData);
        console.log(recipeData);
        response.redirect('/');
    }

    *show(request, response){
        const id = request.param('id')
        const recipe = yield Recipe.find(id) //yield mert minden művelet aszinkron
        if (!recipe) {
            response.notFound('Nincs ilyen recept')
            return
        }
        yield recipe.related('category').load()
        //console.log(recipe.toJSON())
        yield response.sendView('showRecipe', {
            recipe: recipe.toJSON()
        })
    }

    //recept szerkesztése
    * edit(request, response){
        const categories = yield Category.all();
        const id = request.param('id')
        const recipe = yield Recipe.find(id)
        if (!recipe) {
            response.notFound('Nincs ilyen recept')
            return
        }
        console.log(recipe.toJSON())
        
        yield recipe.related('category').load()
        yield response.sendView('editRecipe', {
            recipe: recipe.toJSON(),
            categories: categories.toJSON()
        });
    }

    * doEdit(request, response){
        const recipeData = request.except('_csrf');
        const rules = {
            name: 'required',
            ingredients: 'required',
            instructions: 'required',
            category_id: 'required'
        }

        const validation = yield Validator.validateAll(recipeData, rules);
        if(validation.fails()){
            yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()

            response.redirect('back')
            return
        }
        const id = request.param('id')
        const recipe = yield Recipe.find(id)

        recipe.name = recipeData.name
        recipe.ingredients = recipeData.ingredients,
        recipe.instructions = recipeData.instructions,
        recipe.category_id = recipeData.category_id
       
        yield recipe.save()
        response.redirect('/');
    }

    //recept törlése
    * delete(request,response){
        const id = request.param('id')
        const recipe = yield Recipe.find(id)
        if (!recipe) {
            response.notFound('Nincs ilyen recept')
            return
        }

        yield recipe.delete();
        response.redirect('/');
    }
}

module.exports = RecipeController
