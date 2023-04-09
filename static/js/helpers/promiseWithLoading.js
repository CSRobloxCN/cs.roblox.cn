import { message } from "antd";
function loading(promise) {
  let hide = message.loading("", 0);
  return promise.then(hide).catch((e) => {
    hide();
    message.error(e.toString());
    console.error(e);
  });
}
export { loading };
