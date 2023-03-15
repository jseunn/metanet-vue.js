<template>
  <div class="name">
    {{greet}}
  </div>
</template>

<script>

export default {
 setup(){
  const name = "kosa!";
  const greeting = (name) =>{
    return 'Hello' + name;
  }
 
  const greet = greeting(name);

  return{
    name,
    greeting,
    greet,
  
  }



 }
 
}
</script>

<style>
  .name{
    color:red;
  }
</style>