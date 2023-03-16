<template>  
  <div class="container">
    <h2>To-Do</h2>
    <form       
      @submit.prevent="onSubmit"  
    >
      <div class="d-flex">
        <div class="flex-grow-1 mr-2">
          <input
            class="form-control" 
            type="text" 
            v-model="todo"
            placeholder="Type new to-do"
          >
        </div> 
        <div>
          <button
            class="btn btn-primary"
            type="submit"
          >
            Add
          </button>
        </div> 
      </div>
      <div v-if="hasError" style="color: red">
        This is cannot be empty  
      </div>        
    </form>  
    <div
      v-for="todo in todos"
      :key="todo.id"
      class="card mt-2">
      <div class="card-body p-2">
        {{ todo.subject }}
      </div>
    </div>    
  </div>   
</template>

<script>
import { ref } from 'vue';
export default {
  setup(){
    const todo = ref('');  
    const todos = ref([
      {id:1, subject: 'vue study'},
      {id:2, subject: 'vue work'}
    ]); 
    
    const hasError = ref(false);    

    const onSubmit = () =>{  
      if(todo.value == ''){
        hasError.value = true;
      }else{
        todos.value.push({
          id: Date.now(),
          subject: todo.value  
        });
        hasError.value = false;
      }          
      
    }
   
    
    return{
      todo,      
      onSubmit,
      todos,
      hasError,
    }
  }  
}
</script>

<style>
  .name{
    color: red;
  }
</style>
