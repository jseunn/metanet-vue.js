<template>  
  <div>
  <h2>To-Do</h2>




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
    There is nothing to display
  </div>




  <TodoList :todos="todos"  
            @toggle-todo="toggleTodo"
            @delete-todo="deleteTodo"/>  




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
  <Toast v-if="showToast"
              :message="toastMessage"
              :type="toastAlertType"/>
</template>




<script>
import { ref, computed, watch } from 'vue';
import TodoSimpleForm from '@/components/TodoSimpleForm.vue';
import TodoList from '@/components/TodoList.vue';
import Toast from '@/components/Toast.vue';
import axios from "axios";
import { useToast } from '@/composables/toast'; // import 'toast.js'




export default {
components: {
  //import로 뷰 가져오고 componets 등록
  TodoSimpleForm,
  TodoList,
  Toast,
},




setup() {
  const todos = ref([]);


  const searchText = ref('');


  const error = ref('');


  const numberOfTodos = ref(0);
  const limit = 5;
  const currentPage = ref(1);
  let timeout = null;

  const{
    toastMessage,
    toastAlertType,
    showToast,
    triggerToast
  } = useToast(); // useToast의 해당 값들 호출

  // const showToast = ref(false);
  // const toastMessage = ref('');
  // const toastAlertType = ref('');


  // //Toast.vue에 메시지 전달
  // const triggerToast = (message, type='success') => {
  //     showToast.value = true;
  //     toastMessage.value = message;
  //     toastAlertType.value = type;
  //     setTimeout(() => {  
  //         toastMessage.value = '';
  //         showToast.value = false;
  //         toastAlertType.value = '';
  //     }, 3000);
  // }


  watch(searchText, () => { //searchText값에 변화가 있다면
    clearTimeout(timeout);  //검색어가 바뀌면 초기화(이전것을 검색하지 않도록)
    timeout = setTimeout(() => {  //2초 후에 조회하도록
      getTodos(1);
    }, 2000);
  });


  const searchTodo = () => {  //엔터쳤을때
    clearTimeout(timeout); //기존 검색 취소
    getTodos(1);           //바로 조회
  }


  //총 페이지수: numberOfTodos 값에 따라 바뀌어야하므로 computed 사용
  const numberOfPages = computed(() => {
    return Math.ceil(numberOfTodos.value/limit);
  });




  //검색 (현재 페이지에서만 검색/ 다른페이지에 있어도 검색 안됨)
  // const filteredTodos = computed(() => {
  //   //검색할 값이 있으면 필터처리
  //   if(searchText.value) {
  //     return todos.value.filter(todo => {
  //       //todos배열을 하나씩 todo로 넘겨서
  //       //todo의 subject 값이 searchText값을 포함한다면
  //       return todo.subject.includes(searchText.value)
  //     });
  //   }




  //   //없으면 그냥 todos
  //   return todos.value
  // });




  // Create 추가
  const addTodo = async (todo) => {       //todo를 받아와서 추가
    error.value = '';
    try {
      await axios.post('http://localhost:3000/todos', {
      subject: todo.subject,
      completed: todo.completed
      });
      //아이디값도 포함하여 todos에 저장
      //todos.value.push(res.data); //배열에 추가
      getTodos(1);
    }catch(err) {
      //서버가 정상적으로 작동하지않은채로 Add하면 에러메시지
      triggerToast('something went wrong', 'danger');
      
    }
  }




  // Update 체크박스 스타일
  const toggleTodo = async (index, checked) => {  
    console.log(checked);
    error.value = '';
    //index를 받아와서 그 부분의 completed를 반대로
    const id = todos.value[index].id;
    try{
      await axios.patch('http://localhost:3000/todos/'+id, {
        completed: !todos.value[index].completed
      });
      todos.value[index].completed = checked;  //
    }catch(err){
      console.log(err);
      triggerToast('something went wrong', 'danger');
    }
  }
 
  // Delete 삭제
  const deleteTodo = async(index) => {
    error.value='';


    //삭제버튼을 누른 index의 todos id값
    const id = todos.value[index].id; //지우고자 하는todos.value[idex]의 id 찾기
    try{
        //id값으로 json(DB)에서 해당 데이터 삭제
        await axios.delete('http://localhost:3000/todos/' + id);
      //todos.value.splice(index, 1); //todos 배열에서도 삭제
      getTodos(1);  //데이터 값만 불러오기
    }catch(err){
      console.log(err)
      triggerToast('something went wrong', 'danger');
    }
  }


  // Read 화면에 카드 유지 +페이징 처리
  const getTodos = async (page = currentPage.value) => {
    //json파일에 저장된 todo를 화면에 출력
    currentPage.value = page;
    error.value = '';
    try{
      //url 요청하고, 현재 글 개수까지
      const res = await axios.get(
        `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`);


      numberOfTodos.value = res.headers['x-total-count'];  
      todos.value = res.data; //받아온 데이터를 todos 배열에 넣기
    }catch(err){
      //서버가 정상적으로 작동하지않은채로 Add하면 에러메시지
      console.log(err);
      triggerToast('something went wrong', 'danger');
    }
  }




  getTodos();




  return {
    todos,
    deleteTodo,
    addTodo,
    toggleTodo,
    searchText,
    //filteredTodos,
    error,
    getTodos,
    numberOfTodos,
    limit,
    currentPage,
    numberOfPages,
    searchTodo,
    showToast,
    toastMessage,
    toastAlertType,
    triggerToast,
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