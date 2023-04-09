import { Modal, message } from "antd";
let isBlocked = false;
function blockLoading(promise, t) {
  if (isBlocked) return;
  isBlocked = true;
  let model = Modal.info({
    content: t("Waiting for request to complete, Please don't refresh the page"),
    closable: false,
    maskClosable: false,
    keyboard: false,
    onOk: () => promise,
  });
  let hide = () => {
    model.destroy();
    isBlocked = false;
  };
  return promise.then(hide).catch((e) => {
    hide();
    message.error(e.toString());
  });
}
export { blockLoading };
