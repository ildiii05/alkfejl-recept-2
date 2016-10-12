'use strict'

const Database = use('Database')
const Category = use('App/Model/Category')


class RecipeController {
    * index(request, response){

        //const categories = yield Database.from('categories').select('*');
        //response.send(categories)

        const categories = yield Category.all()

        for (let category of categories){
            const topRecipies = yield category.recipes().lim(3).fetch
            category.topRecipies = topRecipies.toJSON()
        }

        yield response.sendView('main', {        
             categories: categories.toJSON() 
        })
    }
}

module.exports = RecipeController
