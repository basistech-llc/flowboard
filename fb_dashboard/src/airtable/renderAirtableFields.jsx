import { useEffect, useState } from "react";
import { Button, Image, Tag } from "antd";
import PropTypes from "prop-types";

import { useAirtableContext } from "../context/AirtableContext";

const AirtableText = ({ text }) => {
  // [TODO] Array case is for lookup of Roles in People.  Clean up!
  if (Array.isArray(text)) {
    return <span>{text.join(", ")}</span>;
  }
  return <span>{text}</span>;
};
AirtableText.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export const AirtableRecordId = ({ id, tableName }) => {
  const { getTable } = useAirtableContext();
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const records = await getTable({ tableName, setError });
      setRecords(records);
    };

    fetchData();
  }, [getTable, tableName]);

  if (!records.length) {
    return "";
  }

  const OneTag = ({ id }) => {
    const record = records.find((r) => {
      return r.id === id;
    });
    const updater = record?.fields?.["Update Record"];
    if (updater) {
      return (
        <AirtableButton url={updater.url} label={record.fields.Name || "???"} />
      );
    }
    return (
      <Tag color="orange">
        {
          //[TODO] Standardize Name fields. Probably means fixing existing
          //automations and interfaces
          record?.fields["Name"] ||
            record?.fields["Record Key"] ||
            record?.fields["Company"] ||
            // [TODO] id case is for rollup of Companies in People.  Clean up!
            id
        }
      </Tag>
    );
  };

  if (Array.isArray(id)) {
    const ids = [...new Set(id)];
    return ids.map((record) => <OneTag key={record} id={record} />);
  } else return <OneTag id={id} />;
};
AirtableRecordId.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  tableName: PropTypes.string.isRequired,
};

const AirtableSingleSelect = ({ option }) => {
  return <Tag color="blue">{option}</Tag>;
};
AirtableSingleSelect.propTypes = {
  option: PropTypes.string.isRequired,
};

const AirtableMultiSelect = ({ options }) => {
  return (
    <>
      {options.map((option, index) => (
        <Tag key={index}>{option}</Tag>
      ))}
    </>
  );
};
AirtableMultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};
const AirtableCheckbox = (checked) => <span>{checked ? "Yes" : "No"}</span>;

const AirtableButton = ({ url, label }) => {
  const handleClick = (event) => {
    const { clientX, clientY, screenX, screenY } = event;
    openInPopup({ url, mouseX: clientX, mouseY: clientY, screenX, screenY });
  };
  return (
    <Button key={url} onClick={handleClick}>
      {label}
    </Button>
  );
};

AirtableButton.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

/**
 * Opens a URL in a popup window centered on the mouse position.
 *
 * @param {string} url - The URL to open.
 * @param {number} mouseX - The X coordinate of the mouse click.
 * @param {number} mouseY - The Y coordinate of the mouse click.
 * @param {number} screenX - The X coordinate of the screen relative to the main screen.
 * @param {number} screenY - The Y coordinate of the screen relative to the main screen.
 */
const openInPopup = ({ url, mouseX, mouseY, screenX, screenY }) => {
  const height = 1024;
  const width = 768;
  const top = Math.round(screenY + mouseY - height / 2);
  const left = Math.round(screenX + mouseX - width / 2);
  const dimsStr = `width=${width}, height=${height}, top=${top}, left=${left}`;
  window.open(
    url,
    "_blank",
    `toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, ${dimsStr}`,
  );
};

export const AirtableEmail = ({ email }) => (
  <a href={`mailto:${email}`}>{email}</a>
);
AirtableEmail.propTypes = {
  email: PropTypes.string.isRequired,
};

export const AirtableUrl = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    {url}
  </a>
);
AirtableUrl.propTypes = {
  url: PropTypes.string.isRequired,
};

export const AirtableDate = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formattedDate}</span>;
};
AirtableDate.propTypes = {
  date: PropTypes.string.isRequired,
};

const AirtableImage = ({ attachments }) => {
  const image = attachments?.[0];
  return <Image src={image.url} alt={image.filename} width={"160px"} />;
};
AirtableImage.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export const AirtableField = ({ type, value }) => {
  if (Array.isArray(type)) {
    if (type[0] == "record") {
      return <AirtableRecordId key={value} tableName={type[1]} id={value} />;
    } else return "";
  }
  switch (type) {
    case "ignore":
      return "";
    case "URL":
      return <AirtableUrl url={value} />;
    case "email":
      return <AirtableEmail email={value} />;
    case "button":
      return <AirtableButton url={value?.url} label={value?.label} />;
    case "date":
      return <AirtableDate date={value} />;
    case "image":
      return <AirtableImage attachments={value} />;
    case "text":
      return <AirtableText text={value} />;
    case "multilineText":
      return <AirtableText text={value} />;
    case "singleSelect":
      return <AirtableSingleSelect option={value} />;
    case "multipleSelect":
      return <AirtableMultiSelect options={value} />;
    case "checkbox":
      return <AirtableCheckbox checked={value} />;
    default:
      console.error(`Can't handle type {type} for`, value);
      return <span>{JSON.stringify(value)} </span>;
  }
};

export default AirtableField;
