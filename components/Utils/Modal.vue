<template>
  <div>
    <transition name="modal">
      <div
        v-if="active"
        tabindex="-1"
        class="flex items-center justify-center fixed inset-0 bg-transparent cursor-default h-screen w-full"
        style="z-index: 99"
        @click.self="closeModal()"
      >
        <div
          :class="fullScreen ? `w-11/12 ` : `w-11/12 lg:w-1/2`"
          class="modal items-center flex justify-center rounded"
        >
          <div class="w-full bg-gray-900">
            <div class="w-full flex justify-between bg-gray-800 py-3 px-4">
              <p class="text-white">
                <slot name="title"></slot>
              </p>
              <button
                @click="closeModal()"
                class="bg-gray-700 text-white font-light p-1 px-2 text-xs rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <div class="py-4 px-5 min-h-0 max-h-96 overflow-y-scroll">
              <slot name="body" />
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div
      tabindex="-1"
      class="flex items-center justify-center fixed inset-0 modal-bg cursor-default h-screen w-full"
      style="z-index: 9"
    ></div>
  </div>
</template>
<script>
export default {
  name: "Modal",
  props: {
    fullScreen: {
      dafault: false,
      type: Boolean,
    },
    imageOnly: {
      dafault: false,
      type: Boolean,
    },
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (this.active) {
        if (e.keyCode == "27") {
          this.active = false;
          this.$emit("close");
        }
      }
    });
  },
  methods: {
    closeModal() {
      this.active = false;
      this.$emit("close");
    },
  },
  data() {
    return {
      active: true,
    };
  },
};
</script>
<style>
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
  /* make scrollbar transparent */
}
.modal-bg {
  backdrop-filter: saturate(180%) blur(5px);
  background-color: rgba(0, 0, 0, 0.2);
}
.modal {
  animation: openModal 0.3s;
}
.modal-enter,
.modal-leave-to {
  opacity: 0 !important;
}
.modal-enter .modal {
  transform: scale(0.9) !important;
}
.modal-leave-to .modal {
  transform: scale(0.9) !important;
}
@keyframes openModal {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
}
</style>
