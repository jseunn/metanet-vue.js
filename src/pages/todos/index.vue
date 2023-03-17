<template>    
  <div class="container">
    <h2>To-Do List</h2>
    <input
      class="form-control" 
      type="text" 
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    >
    <hr>
    <TodoSimpleForm @add-todo="addTodo"/>
    <div style="color: red">{{error}}</div>
    
    <div v-if="!todos.length">
      추가된 Todo가 없습니다.
    </div>

    <div v-if="!todos.length">
      There is noting to display  
    </div>    

    <TodoList :todos="todos"
              @toggle-todo="toggleTodo"
              @delete-todo="deleteTodo" />

    <br>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li
          v-if="currentPage !== 1" 
          class="page-item">
          <a class="page-link" @click="getTodos(currentPage - 1)">Previous</a>
        </li>
        <li
          v-for="page in numberOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''">
          <a class="page-link"
             @click="getTodos(page)">
             {{page}}
          </a>
        </li>        
        <li 
          v-if="numberOfPages != currentPage"
          class="page-item">
          <a class="page-link" @click="getTodos(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>          
   
  </div>   
</template>

<script>
import { ref, computed, watch } from 'vue';
import axios from "axios";
import TodoSimpleForm from '@/components/TodoSimpleForm.vue';
import TodoList from '@/components/TodoList.vue';
export default {  
  components: {
    TodoSimpleForm,
    TodoList
  },
  setup(){      
    const todos = ref([]); 
    const searchText = ref('');
    const error = ref('');
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    let timeout = null;

    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000);      
    });

    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    }

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value/limit);
    });   

    const deleteTodo = async (index) => {
      error.value = '';
      const id = todos.value[index].id;
      try{
        await axios.delete('http://localhost:3000/todos/'+id);
        //todos.value.splice(index, 1);
         getTodos(1);
      }catch(err){
        console.log(err);
        error.value = 'Someting went wrong';
      } 
    }   

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      error.value = '';
      try{
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`);

        numberOfTodos.value = res.headers['x-total-count'];         
        todos.value = res.data;       
      }catch(err){
        console.log(err);
        error.value = 'Someting went wrong';
      }
    }

    getTodos();

    const addTodo = async (todo) => {
      error.value = '';
      try{
        await axios.post('http://localhost:3000/todos', {
          subject: todo.subject,
          completed: todo.completed
        });
        //todos.value.push(res.data);
         getTodos(1);
      }catch(err){
        console.log(err);
        error.value = 'Someting went wrong';
      }     
    }

    const toggleTodo = async (index, checked) => {  
      console.log(checked);
      error.value = '';
      const id = todos.value[index].id;
      try{
        await axios.patch('http://localhost:3000/todos/'+id, {
          completed: !todos.value[index].completed
        });
        todos.value[index].completed = checked;  
      }catch(err){
        console.log(err);
        error.value = 'Someting went wrong';
      } 
    }
    
    return{      
      todos,      
      deleteTodo,
      addTodo,
      toggleTodo, 
      searchText,
      error,  
      getTodos,
      numberOfTodos,
      limit,
      currentPage,
      numberOfPages,
      searchTodo, 
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
