<template>
  <div class="relative bg-black">
    <div class="min-h-screen text-gray-50 container py-8">
      <Navbar></Navbar>
      <div class="flex justify-between mt-4">
        <div class>Files - ({{ files.length }})</div>
        <div class="flex flex-row items-center space-x-2">
          <!-- <button
            @click="loginWithGoogle()"
            type="button"
            class="text-white bg-gray-800 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
          >
            <svg
              class="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </button>-->
          <button
            @click="isActive = true"
            type="button"
            class="py-3 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ADD NEW
          </button>
          <button @click="sync()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="w-6 h-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        class="grid grid-flow-row grid-cols-2 lg:grid-cols-6 2xl:grid-cols-12 gap-4 lg:gap-6 mt-4"
      >
        <span v-for="(i, index) in files" :key="index">
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
import Navbar from "../components/Navbar.vue";
import Card from "../components/Files/Card.vue";
import Uploader from "../components/Files/Upload.vue";
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default {
  components: {
    Navbar,
    Uploader,
    Card,
  },
  data() {
    return {
      isActive: false,
      files: [],
    };
  },
  created() {
    this.listen();
  },
  async asyncData({ $axios, store, route }) {
    const { data } = await client.from("files").select("*");
    return { files: data };
  },
  methods: {
    async sync() {
      const { data } = await client.from("files").select("*");
      this.files = data;
    },
    async loginWithGoogle() {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
      });
      if (error === null) {
        console.log(data);
      } else {
        console.log(error);
      }
    },
    async listen() {
      client
        .channel("public:files")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "files" },
          (payload) => {
            this.files.unshift(payload.new);
          }
        )
        .subscribe();
    },
  },
};
</script>
