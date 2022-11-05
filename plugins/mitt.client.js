import mitt from "mitt";
const emitter = mitt();
export default ({ $api }, inject) => {
  inject("on", emitter.on);
  inject("emit", emitter.emit);
};
