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
        yield response.sendView('showRecipe')
    }
}

module.exports = RecipeController
