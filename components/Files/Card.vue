<template>
  <div>
    <a :href="`https://cloudflare-ipfs.com/ipfs/${item.hash}`" target="__blank">
      <div class="max-w-sm shadow border border-gray-700 p-2 rounded-md text-white">
        <div class="h-32 w-full">
          <img
            class="h-full w-full object-cover rounded-md"
            :src="item.banner"
            :alt="item.name"
          />
        </div>
        <p class="mb-2 tracking-tight mt-2 text-sm">
          {{ item.name }}
        </p>
        <p class="font-normal truncate text-xs">Size:{{ niceBytes(item.size) }}</p>
      </div>
    </a>
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
