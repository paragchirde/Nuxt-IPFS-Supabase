<template>
  <div>
    <div
      class="p-4 max-w-sm bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg shadow text-white"
    >
      <svg
        class="mb-2 w-10 h-10"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
          clip-rule="evenodd"
        ></path>
        <path
          d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"
        ></path>
      </svg>
      <a href="#">
        <p class="mb-2 tracking-tight">
          {{ item.name }}
        </p>
      </a>
      <p class="mb-1 font-normal truncate text-xs">
        {{ item.hash }}
      </p>
      <p class="mb-3 font-normal truncate text-xs">
        Size:{{ niceBytes(item.size) }}
      </p>
      <a
        :href="`https://ipfs.io/ipfs/${item.hash}`"
        target="__blank"
        class="inline-flex items-center"
      >
        <button
          type="button"
          class="py-2 px-3 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg "
        >
          Open File
        </button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    niceBytes(x) {
      const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let l = 0,
        n = parseInt(x, 10) || 0;
      while (n >= 1024 && ++l) {
        n = n / 1024;
      }
      return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
    },
    openFile() {},
  },
};
</script>

<style></style>
