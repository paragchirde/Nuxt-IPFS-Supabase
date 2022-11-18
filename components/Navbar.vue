<template>
  <nav>
    <div class="flex flex-wrap justify-between items-center mx-auto">
      <nuxt-link to="/" class="flex flex-row items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>

        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          D-Libgen</span
        >
      </nuxt-link>
      <div class="flex flex-row items-center space-x-2">
        <div v-if="checkAuth" class="flex flex-row space-x-2 items-center">
          <button
            @click="isActive = true"
            type="button"
            class="py-3 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ADD NEW
          </button>
          <button
            @click="logout()"
            type="button"
            class="text-white uppercase bg-gray-800 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
          >
            Logout
          </button>
          <nuxt-link to="/my-posts">
            <button
              type="button"
              class="text-white uppercase bg-gray-800 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
            >
              My Posts
            </button>
          </nuxt-link>
          <img
            class="h-8 w-8 rounded-full"
            :src="`https://avatars.dicebear.com/api/micah/${getUser.user_metadata.name}.svg`"
          />
          <div class="leading-tight">
            <small>Hello,</small> <br />
            <strong class="text-sm">{{ getUser.user_metadata.name }} </strong>
          </div>
        </div>
        <div v-else>
          <button
            @click="isActiveLogin = true"
            type="button"
            class="text-white uppercase bg-gray-800 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
          >
            Login
          </button>
          <button
            @click="isActiveRegister = true"
            type="button"
            class="text-white uppercase bg-gray-800 hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
          >
            Register
          </button>
        </div>
      </div>
    </div>
    <!--  -->
    <!-- Add Book -->
    <Modal v-if="isActive" @close="isActive = false">
      <template v-slot:title>
        <p>Add New Book</p>
      </template>
      <template v-slot:body>
        <Uploader @close="isActive = false"></Uploader>
      </template>
    </Modal>
    <!--  -->
    <!-- Login -->
    <Modal v-if="isActiveLogin" @close="isActiveLogin = false">
      <template v-slot:title>
        <p>Login</p>
      </template>
      <template v-slot:body>
        <LoginForm @close="isActiveLogin = false"></LoginForm>
      </template>
    </Modal>
    <!--  -->
    <!-- Register -->
    <Modal v-if="isActiveRegister" @close="isActiveRegister = false">
      <template v-slot:title>
        <p>Register</p>
      </template>
      <template v-slot:body>
        <RegisterForm @close="isActiveRegister = false"></RegisterForm>
      </template>
    </Modal>
    <!--  -->
  </nav>
</template>

<script>
import Uploader from "../components/Files/Upload.vue";
import LoginForm from "../components/Auth/Login.vue";
import RegisterForm from "../components/Auth/Register.vue";
export default {
  components: {
    Uploader,
    LoginForm,
    RegisterForm,
  },
  data() {
    return {
      isOpen: false,
      showItems: false,
      isActive: false,
      isActiveLogin: false,
      isActiveRegister: false,
    };
  },
  methods: {
    changeTheme(theme) {
      this.$store.state.theme = theme;
    },
    async logout() {
      let { error } = await this.$client.auth.signOut();
      if (error === null) {
        this.$store.state.user = null;
        localStorage.removeItem("user");
      }
    },
  },
  computed: {
    checkAuth() {
      // return localStorage.getItem("user") == null ? false : true;
      return this.$store.state.user == null ? false : true;
    },
    getUser() {
      let u = JSON.parse(localStorage.getItem("user"));
      return u.user;
    },
  },
};
</script>
