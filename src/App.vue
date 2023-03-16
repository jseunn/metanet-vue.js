<template>  
  <div class="container">
    <h2>To-Do List</h2>
    <input
        class="form-control" 
        type="text" 
        v-model="searchText"
        placeholder="Type new to-do"
      >

    <br>

    <TodoSimpleForm @add-todo="addTodo"/>
    <div style="color: red">
      {{ error }}
    </div>

    <div v-if="!todos.length">
      추가된 Todo가 없습니다.
    </div>

    <div v-if="!filteredTodos.length">
      There is nothing to display
    </div>
     <TodoList :todos="filteredTodos"
              @toggle-todo="toggleTodo"
              @delete-todo="deleteTodo"/>

  </div>   
</template>

<script>
import { ref, computed } from 'vue';
import axios from "axios";
import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';
export default {  
  components: {
    TodoSimpleForm,
    TodoList
  },
  setup(){
      
    const todos = ref([]);
    const searchText = ref('');
    const filteredTodos = computed(() => {
      if(searchText.value){
        return todos.value.filter(todo => {
          return todo.subject.includes(searchText.value);
        });
      }
      return todos.value
    });
    const error = ref('');

    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    }

    const getTodos = async () => {
      try{
        const res = await axios.get('http://localhost:3000/todos');
        todos.value = res.data;
      }catch(err){
        console.log(err);
        error.value='Something went wrong';
      }
    }
    
    getTodos();
    
    const addTodo = async(todo) => {
      error.value = '';
      try{
        const res = await axios.post('http://localhost:3000/todos',{
          subject: todo.subject,
          completed: todo.completed
        });
        todos.value.push(res.data);
      }catch(err){
        console.log(err);
        error.value='Something went wrong';
      }
      
    }

    const toggleTodo = (index) => {     
      todos.value[index].completed = !todos.value[index].completed;      
    }
    
    return{      
      todos,      
      deleteTodo,
      addTodo,
      toggleTodo,
      searchText,
      filteredTodos,
      error,
      getTodos,
    }
  }  
}
</script>

<style>  
  .todo{
    color: gray;
    text-decoration: line-through;
  }
</style>
