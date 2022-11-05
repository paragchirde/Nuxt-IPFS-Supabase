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
        <div class="flex flex-row space-x-1 items-center">
          <p class="h-8 w-8 rounded-full">
            <img
              class="h-full w-full rounded-full"
              :src="`https://avatars.dicebear.com/api/micah/${item.user}.svg`"
            />
          </p>
          <p class="text-sm leading-snug">
            {{ item.user }} <br />
            <small> Size:{{ niceBytes(item.size) }} </small>
          </p>
        </div>
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
