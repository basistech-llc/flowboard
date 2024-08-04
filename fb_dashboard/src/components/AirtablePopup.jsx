import { Modal } from "antd";

export const AirtablePopup = ({
  title,
  airtableFormUrl,
  isVisible,
  onOk,
  onCancel,
}) => {
  return (
    <>
      <Modal
        title={title}
        visible={isVisible}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <iframe
          className="airtable-embed"
          src={airtableFormUrl}
          frameborder="0"
          onmousewheel=""
          width="100%"
          height="1000px"
          style={{ background: "transparent", border: "1px solid #ccc" }}
        ></iframe>
      </Modal>
      />
    </>
  );
};

export default AirtablePopup;
