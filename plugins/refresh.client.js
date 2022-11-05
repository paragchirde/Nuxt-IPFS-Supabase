export default function (ctx) {
  if (
    localStorage.getItem("user") != undefined ||
    localStorage.getItem("user") != null
  ) {
    const { data, error } = ctx.$client.auth.getUser();
    ctx.store.state.user = JSON.parse(localStorage.getItem("user"));
  }
}
