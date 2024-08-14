import PropTypes from "prop-types";
import { Modal } from "antd";

export const AirtablePopup = ({
  title,
  airtableFormUrl,
  isOpen,
  onOk,
  onCancel,
  height,
}) => {
  return (
    <>
      <Modal
        title={title}
        open={isOpen}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <iframe
          className="airtable-embed"
          src={airtableFormUrl}
          width="100%"
          height={height}
          style={{ background: "transparent", border: "1px solid #ccc" }}
        ></iframe>
      </Modal>
    </>
  );
};

AirtablePopup.propTypes = {
  title: PropTypes.string.isRequired,
  airtableFormUrl: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AirtablePopup;
