<template>
    <h1>Todo Page </h1>
    <div v-if="loading">
      Loading...
    </div>
    <form v-else
      @submit.prevent="onSave">
      <div class="row">
          <div class="col-6">
              <div class="form-group">
              <label>Todo Subject</label>
              <input v-model="todo.subject" type="text" class="form-control">
              </div>
           </div>
           <div class="col-6">
              <div class="form-group">
               <label>status</label>
               <div>
                  <button class="btn"
                  type="button"
                  :class="todo.completed ? 'btn-success' :  'btn-danger'"
                      @click="toggleTodoStatus">
                      {{todo.completed ? 'Completed' : 'Incompleted'}}
                  </button>
               </div>
              </div>
          </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled = "!todoUpdated">Save</button>
      <button class="btn btn-primary ml-2" @click="moveToListPage">Cancel</button>
      </form>
      <Toast v-if="showToast"
              :message="toastMessage"
              :type="toastAlertType"/>
  
  
      <div id="ssohee">ssohee</div>
  </template>
  
  
  
  
  <script>
  import axios from 'axios';
  import {useRoute, useRouter} from 'vue-router';
  import {ref, computed, onUnmounted} from 'vue';
  import _ from 'lodash';
  import Toast from '@/components/Toast.vue';
  import { useToast } from '@/composables/toast'; // import 'toast.js'

  export default {
      components: {
          Toast
         
      },
      setup(){
          onUnmounted(() => {
              console.log('unmounted');
              clearTimeout(timeout.value);    
              //unmount시(페이지 떠났을때) timeout값 초기화 (3초후에 toast 보여주지X)
          });
  
  
          const route = useRoute();
          const router = useRouter();
          const todo = ref(null);
          const loading = ref(true);  //처음엔 true
          const todoId =  route.params.id;
          const originalTodo = ref(null);


          const{
            toastMessage,
            toastAlertType,
            showToast,
            triggerToast
            } = useToast(); // useToast의 해당 값들 호출


        //   const showToast = ref(false);
        //   const toastMessage = ref('');
        //   const toastAlertType = ref('');
        //   const timeout = ref(null);
  
  
        //   //Toast.vue에 메시지 전달
        //   const triggerToast = (message, type='success') => {
        //       showToast.value = true;
        //       toastMessage.value = message;
        //       toastAlertType.value = type;
        //       timeout.value = setTimeout(() => {  //setTimeout 값을 timeout에 넣기
        //           console.log('hello');
        //           toastMessage.value = '';
        //           showToast.value = false;
        //           toastAlertType.value = '';
        //       }, 3000);
        //   }
  
  
          //save버튼 누르면 변경된값 DB에 저장
          const onSave = async() => {
              const res =  await axios.put(`http://localhost:3000/todos/${todoId}`,{
                  subject:  todo.value.subject,
                  completed: todo.value.completed
              });
              originalTodo.value = {...res.data}; // 수정한 값을 현재값으로 바꾸기
              triggerToast('Successfully save!!'); //수정했을 때 toast가 나오게하기
              console.log(res);
          }
  
  
          //수정값이 있는지 없는지
          const todoUpdated = computed(() => {
              return !_.isEqual(todo.value, originalTodo.value);
          });
  
  
          //input창에 해당 id의 subject 보이기
          const getTodo =async() => {
              try{
                  const res =  await axios.get(`http://localhost:3000/todos/${todoId}`);
                  todo.value = {...res.data};
                  originalTodo.value = {...res.data};
                  loading.value = false;  //데이터 받아오면 false
              }catch(err){
                  console.log(err);
                  triggerToast('something went wrong', 'danger'); //기본은 success
              }
           
          };
  
  
          getTodo();
          const toggleTodoStatus = () => {
              todo.value.completed = ! todo.value.completed;
          };
  
  
          //다시 목록 페이지로 돌아가기
          const moveToListPage = () => {
              router.push({
                  name: 'Todos'
              })
          };
     
          return {
              todo,
              loading,
              toggleTodoStatus,
              moveToListPage,
              onSave,
              todoUpdated,
              showToast,
              triggerToast,
              toastMessage,
              toastAlertType,
          };
      }
  }
  </script>
  
  
  
  
  <style>
  </style>