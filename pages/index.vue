<template>
  <div  class="relative bg-black ">
    <div class="min-h-screen text-gray-50 container py-8">
        <Navbar></Navbar>
        <div class="flex justify-between mt-4">
          <div class="">Files - ({{data.length}})</div>
          <div class="flex flex-row space-x-2">
          <button @click="isActive = true" type="button" class="py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ADD NEW</button>
            <button @click="sync()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-6 text-white">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

            </button>
          </div>
        </div>
        <div class="grid grid-flow-row grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6 mt-4">
          <span v-for="(i,index) in data" :key="index">
            <Card :item="i"></Card>
          </span>
        </div>
        
    </div>
    <!--  -->
    <Modal v-if="isActive" @close="isActive = false">
        <template v-slot:title>
          <p>Add New Book</p>
        </template>
        <template v-slot:body>
          <Uploader @close="isActive = false"></Uploader>
        </template>
      </Modal>
    <!--  -->
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Card from '../components/Files/Card.vue'
import Uploader from '../components/Files/Upload.vue'
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default {
  components:{
    Navbar,
    Uploader,
    Card
  },
  data(){
    return {
      isActive: false,
    }
  },  
  async asyncData({ $axios, store, route }) {
    const { data } = await client.from("files").select("*");
    return {data: data};
  },
  methods:{
    async sync() {
      const { data } = await client.from("files").select("*");
      return {data: data};
    }
  }
}
</script>
