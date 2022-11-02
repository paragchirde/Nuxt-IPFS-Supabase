<template>
  <div class="flex flex-col space-y-4">
    <div>
      <label class="text-sm text-white" for="File name">*File Name </label>
      <input
        class="w-full mt-1 resize-none p-3 rounded text-xs bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-none placeholder:text-primaryDark"
        type="text"
        name="title"
        placeholder="Enter Book Name"
        v-model="name"
      />
    </div>
    <div>
      <label class="text-sm text-white" for="file"
        >*Attach your file <small>(Size limit: 15MB, Type: pdf)</small>
      </label>
      <input
        class="resize-none mt-1 w-full py-3 px-4 rounded text-xs bg-blue-700 text-primary leading-tight focus:outline-none focus:shadow-none placeholder:text-secondaryDark custom-file-input"
        type="file"
        name="file"
        placeholder="Upload you file"
        @change="getFile"
      />
    </div>
    <button
      v-if="isLoading"
      disabled
      type="button"
      class="text-white mt-4 bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
    >
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
      Loading...
    </button>
    <button v-else
          type="button"
          class="py-2 px-3 text-xs font-medium text-center text-white bg-blue-600 rounded-lg "
        >
          Submit
        </button>
  </div>
</template>

<script>
import ipfs from "../../utils/ipfs";
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default {
  data() {
    return {
      file: "",
      name: "",
      hash: "",
      cid: "",
      size: "",
      isLoading: false,
      supportedFileTypes: ["application/pdf"],
      buffer: null,
    };
  },
  methods: {
    getFile(e) {
      this.isLoading = true;
      this.file = e.target.files[0];
      let size = (this.file.size / (1024 * 1024)).toFixed(2);
      if (size > 15) {
        this.$toasted.error(
          "Large file size. Please upload a file less than 2MB",
          {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000,
          }
        );
        this.file = "";
      } else if (!this.supportedFileTypes.includes(this.file.type)) {
        this.$toasted.error(
          "Please upload images of format: .pdf or .docx below size 15MB",
          {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000,
          }
        );
        this.file = "";
      } else {
        this.file = e.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(this.file);
        reader.onloadend = () => this.convertToBuffer(reader);
      }
    },
    async convertToBuffer(reader) {
      const Bufferdata = await Buffer.from(reader.result);
      this.buffer = Bufferdata;
      this.upload();
    },
    async upload() {
      console.log(ipfs);
      ipfs
        .add(this.buffer)
        .then((res) => {
          this.hash = res.path;
          this.cid = res.cid;
          this.size = res.size;
          this.addToSupabase();
          console.log("ok", res);
        })
        .catch((err) => {
          this.$toasted.error("Hmmm... Something went wrong", {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000,
          });
          console.log("er", err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async addToSupabase() {
      const { data, error } = await client
        .from("files")
        .insert([
          { name: this.name, hash: this.hash, cid: this.cid, size: this.size },
        ]);
      if (error === null) {
        this.$toasted.success("Ahoy! File uploaded successfully", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
        this.$emit('close');
      } else {
        this.$toasted.error("Hmmm... Something went wrong while adding to DB", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
        this.$emit('close');
      }
    },
  },
};
</script>

<style></style>
'
