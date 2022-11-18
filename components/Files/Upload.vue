<template>
  <div class="flex flex-col space-y-4">
    <!--  -->
    <audio
      id="audioT"
      src="https://res.cloudinary.com/phineas31/video/upload/v1667651732/d-libgen/mixkit-fast-small-sweep-transition-166_qo3okl.mp3"
    ></audio>
    <!--  -->
    <div>
      <label class="text-sm text-white" for="File name">*File Name </label>
      <input
        class="w-full mt-1 p-3 rounded text-xs border-0 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-none placeholder:text-primaryDark"
        type="text"
        name="title"
        placeholder="Enter Book Name"
        v-model="name"
      />
    </div>
    <div>
      <label class="block mb-1 text-sm text-white" for="file"
        >*Attach your file thumbnail image <small>(Size limit: 1MB)</small></label
      >
      <input
        class="block w-full text-xs text-white bg-gray-700 rounded cursor-pointer focus:outline-none placeholder-gray-900"
        id="file"
        type="file"
        accept=".jpeg,.jpg,.png,image/jpeg,image/png"
        placeholder="Upload you file"
        aria-label="upload image button"
        @change="getImageFile"
      />
    </div>
    <div>
      <label class="block mb-1 text-sm text-white" for="file"
        >*Attach your file <small>(Size limit: 15MB, Type: pdf)</small></label
      >
      <input
        class="block w-full text-xs text-white bg-gray-700 rounded cursor-pointer focus:outline-none placeholder-gray-900"
        id="file"
        type="file"
        placeholder="Upload you file"
        @change="getFile"
      />
    </div>
    <div class="inline-block">
      <button
        @click.prevent="upload()"
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
import ipfs from "../../utils/ipfs";

import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default {
  data() {
    return {
      file: null,
      name: null,
      hash: null,
      cid: null,
      size: null,
      banner: null,
      bannerReader: null,
      isLoading: false,
      supportedFileTypes: ["application/pdf"],
      supportedImageTypes: ["png", "jpg", "jpeg"],
      buffer: null,
    };
  },
  computed: {
    isInvalid() {
      if (this.name != null && this.file != null && this.banner != null) {
        return false;
      } else return true;
    },
  },
  methods: {
    getImageFile(e) {
      this.banner = e.target.files[0];
      let size = (this.banner.size / (1024 * 1024)).toFixed(2);
      // if (size > 1) {
      //   this.$toasted.error("Large file size. Please upload a file less than 1MB", {
      //     theme: "bubble",
      //     position: "bottom-center",
      //     duration: 5000,
      //   });
      //   this.banner = "";
      // } else if (!this.supportedImageTypes.includes(this.banner.type)) {
      //   this.$toasted.error(
      //     "Please upload images of format: .png, .jpg, .jpeg  below size 1MB",
      //     {
      //       theme: "bubble",
      //       position: "bottom-center",
      //       duration: 5000,
      //     }
      //   );
      //   this.banner = "";
      // } else {
      // }
      this.banner = e.target.files[0];
    },
    getFile(e) {
      this.file = e.target.files[0];
      let size = (this.file.size / (1024 * 1024)).toFixed(2);
      if (size > 15) {
        this.$toasted.error("Large file size. Please upload a file less than 2MB", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
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
    },
    async upload() {
      this.isLoading = true;
      ipfs
        .add(this.buffer)
        .then((res) => {
          this.hash = res.path;
          this.cid = res.cid;
          this.size = res.size;
          this.check();
        })
        .catch((err) => {
          this.$toasted.error("Hmmm... Something went wrong", {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000,
          });
          console.log("err", err);
        });
    },
    // Check if hash exists in the database
    async check() {
      const { data, err } = await client.from("files").select("*").eq("hash", this.hash);
      console.log("1", data);
      console.log("2", err);
      if (data.length > 0) {
        console.log("1.1");
        this.$toasted.error("Psst.. File already exists.", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
        this.$emit("close");
      } else {
        console.log("2.1");
        this.pin();
      }
    },
    // PIN THE HASH TO PINATA
    async pin() {
      var payload = {
        hashToPin: `${this.hash}`,
        pinataMetadata: {
          name: this.name,
          keyvalues: {
            size: this.size,
          },
        },
      };
      this.$axios
        .$post("https://api.pinata.cloud/pinning/pinByHash", JSON.stringify(payload), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        })
        .then((res) => {
          this.upload_banner();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // Upload to cloudinary
    async upload_banner() {
      const readData = (f) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(f);
        });
      this.bannerReader = await readData(this.banner);
      this.$cloudinary
        .upload(this.bannerReader, {
          folder: "d-libgen",
          uploadPreset: "tnl7jvi7",
        })
        .then((res) => {
          this.banner = res.url;
          this.addToSupabase();
        })
        .catch((err) => {
          this.$toasted.error(
            "Hmmm... Something went wrong while uploading image to cloudinary",
            {
              theme: "bubble",
              position: "bottom-center",
              duration: 5000,
            }
          );
        });
    },
    // UPDATE RECORD TO SUPABASE
    async addToSupabase() {
      console.log("ok IN Supabase");
      let u = JSON.parse(localStorage.getItem("user"));
      console.log("ok", this.cid, u);
      const { data, error } = await client.from("files").insert([
        {
          name: this.name,
          hash: this.hash,
          cid: JSON.stringify(this.cid),
          size: this.size,
          banner: this.banner,
          user_id: u.user.id,
          user: u.user.user_metadata,
          views: 0,
        },
      ]);
      if (error === null) {
        new Audio(
          "https://res.cloudinary.com/phineas31/video/upload/v1667651732/d-libgen/mixkit-fast-small-sweep-transition-166_qo3okl.mp3"
        ).play();
        this.$toasted.success("Ahoy! File uploaded successfully", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
        this.$emit("close");
      } else {
        this.$toasted.error("Hmmm... Something went wrong while adding to DB", {
          theme: "bubble",
          position: "bottom-center",
          duration: 5000,
        });
        this.$emit("close");
      }
    },
  },
};
</script>

<style></style>
'
