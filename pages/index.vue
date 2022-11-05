<template>
  <div class="relative bg-black">
    <div class="min-h-screen text-gray-50 container py-8">
      <Navbar></Navbar>
      <div class="flex justify-between mt-4">
        <div class>Files - ({{ files.length }})</div>
      </div>
      <div
        class="grid grid-flow-row grid-cols-2 lg:grid-cols-6 2xl:grid-cols-12 gap-4 lg:gap-6 mt-4"
      >
        <span v-for="(i, index) in files" :key="index">
          <Card :item="i"></Card>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Card from "../components/Files/Card.vue";
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default {
  components: {
    Card,
    Navbar,
  },
  data() {
    return {
      isActive: false,
      isActiveLogin: false,
      isActiveRegister: false,
      files: [],
      email: null,
      password: null,
    };
  },
  async asyncData({ $axios, store, route }) {
    const { data } = await client.from("files").select("*");
    return { files: data };
  },
  async created() {
    // const { data, error } = await this.$client.auth.getUser();
    this.listen();
  },
  methods: {
    async sync() {
      const { data } = await client.from("files").select("*");
      this.files = data;
    },
    async openLogin() {
      this.isActiveLogin = true;
      const { data, error } = await client.auth.signInWithPassword({
        email: this.email,
        password: this.password,
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
