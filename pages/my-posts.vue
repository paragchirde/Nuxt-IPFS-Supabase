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
        <span v-for="(i, index) in files" :key="index" class="relative">
          <div
            @click="confirm(i)"
            class="absolute top-0 right-0 z-40 bg-red-500 p-2 rounded flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3 h-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
          <div class="relative">
            <Card :item="i"></Card>
          </div>
        </span>
      </div>
    </div>
    <!-- Add Book -->
    <Modal v-if="isActiveConfirm" @close="isActiveConfirm = false">
      <template v-slot:title>
        <p>Confirmation</p>
      </template>
      <template v-slot:body>
        <div class="flex flex-col">
          <div class="text-lg text-white">
            Are you sure you want to delete this book? - {{ selectedBook.name }}
          </div>
          <div class="flex flex-row space-x-2 mt-4">
            <button
              @click="isActiveConfirm = false"
              type="button"
              class="text-white uppercase bg-gray-800 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
            >
              Cancel
            </button>
            <button
              @click.prevent="confirmDelete()"
              class="bg-red-500 text-white transition duration-200 ease-in tracking-wide-lg px-8 py-2 rounded-full uppercase text-xs lg:text-sm flex flex-row space-x-2 items-center"
            >
              <p v-if="isLoading">
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              </p>
              <p>
                {{ isLoading ? "Loading..." : "Delete" }}
              </p>
            </button>
          </div>
        </div>
      </template>
    </Modal>
    <!--  -->
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
      isLoading: false,
      isActiveConfirm: false,
      selectedBook: [],
      files: [],
    };
  },
  async asyncData({ $axios, store, route }) {
    let u = store.state.user;
    const { data } = await client.from("files").select("*").eq("user_id", u.user.id);
    return { files: data };
  },
  async created() {
    this.listen();
  },
  methods: {
    confirm(book) {
      this.isActiveConfirm = true;
      this.selectedBook = book;
    },
    async confirmDelete() {
      this.isLoading = true;
      const { data, error } = await client
        .from("files")
        .delete()
        .eq("id", this.selectedBook.id);
      if (error === null) {
        this.$toasted.success("File deleted", {
          theme: "bubble",
          position: "bottom-center",
          duration: 2000,
        });
      } else {
        this.$toasted.error("Some error occurred.", {
          theme: "bubble",
          position: "bottom-center",
          duration: 2000,
        });
      }
      this.isLoading = false;
      this.isActiveConfirm = false;
    },
    async listen() {
      client
        .channel("public:files")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "files" },
          (payload) => {
            this.files.unshift(payload.new);
          }
        )
        .subscribe();
    },
  },
};
</script>
