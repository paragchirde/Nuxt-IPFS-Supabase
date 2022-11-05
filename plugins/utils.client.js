import Vue from "vue";
import flowbite from "flowbite";
import Modal from "../components/Utils/Modal.vue";
Vue.component("Modal", Modal);
Vue.use(flowbite);

//
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export default ({ $api }, inject) => {
  inject("client", client);
};
