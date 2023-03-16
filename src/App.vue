<template>  
  <h4>count: {{count}}</h4>
  <h4>double Count: {{doubleCount}}</h4>
  <button @click="count++">Add One</button>
  <div class="container">
    <h2>To-Do List</h2>
    <TodoSimpleForm @add-todo="addTodo"/>
    
    <div v-if="!todos.length">
      추가된 Todo가 없습니다.
    </div>

    <TodoList :todos="todos"
              @toggle-todo="toggleTodo"
              @delete-todo="deleteTodo"/>

  </div>   
</template>

<script>
import { ref, computed } from 'vue';
import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';
export default {  
  components: {
    TodoSimpleForm,
    TodoList
  },
  setup(){
      
    const todos = ref([]);   
    const count = ref(1);
    const doubleCount = computed(() => {
      return count.value * 2;
    })

    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    }   

    const addTodo = (todo) => {
      todos.value.push(todo);
    }

    const toggleTodo = (index) => {     
      todos.value[index].completed = !todos.value[index].completed;      
    }
    
    return{      
      todos,      
      deleteTodo,
      addTodo,
      toggleTodo,
      count,
      doubleCount,
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
