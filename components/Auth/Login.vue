<template>
  <div class="flex flex-col space-y-4">
    <div>
      <label class="text-sm text-white" for="email">*Email </label>
      <input
        class="w-full mt-1 p-3 rounded text-xs border-0 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-none placeholder:text-primaryDark"
        type="text"
        name="title"
        placeholder="Enter email"
        v-model="email"
      />
    </div>
    <div>
      <label class="text-sm text-white" for="password">*Password </label>
      <input
        class="w-full mt-1 p-3 rounded text-xs border-0 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-none placeholder:text-primaryDark"
        type="password"
        name="password"
        placeholder="Enter password"
        v-model="password"
      />
    </div>
    <div class="inline-block">
      <button
        @click.prevent="submit()"
        :disabled="isInvalid"
        :class="
          isInvalid
            ? 'bg-gray-800 cursor-not-allowed text-gray-600'
            : ' text-white bg-blue-600'
        "
        class="hover:bg-secondaryLight transition duration-200 ease-in tracking-wide-lg px-8 py-2 rounded-full uppercase text-xs lg:text-sm flex flex-row space-x-2 items-center"
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
          {{ isLoading ? "Loading..." : "Submit" }}
        </p>
      </button>
    </div>
  </div>
</template>

<script>
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default {
  data() {
    return {
      isLoading: false,
      email: null,
      password: null,
    };
  },
  computed: {
    isInvalid() {
      if (this.email != null && this.password) {
        return false;
      } else return true;
    },
  },
  methods: {
    async submit() {
      this.isLoading = true;
      const { data, error } = await client.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });
      if (error === null) {
        this.$toasted.success("Logged in successfully", {
          theme: "bubble",
          position: "bottom-center",
          duration: 2000,
        });
        this.$store.state.user = JSON.stringify(data);
        localStorage.setItem("user", JSON.stringify(data));
        this.isLoading = false;
        this.$emit("close");
      } else {
        this.$toasted.error("Hmmm... Something went wrong while talking to DB", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
        this.isLoading = false;
      }
    },
  },
};
</script>

<style></style>
'
