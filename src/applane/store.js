import {observable,computed} from 'mobx';
export class Todo {
    constructor(title){
        this.name=title;
    }
    id = Math.random();
    @observable name = "";
    @observable finished = false;
}
class TodoList {
    @observable todos = [];
    @computed get unfinishedTodoCount() {
        console.log("unfinishedTodoCount")
        return this.todos.filter(todo => !todo.finished).length;
    }
}


const store = new TodoList();
export {store}