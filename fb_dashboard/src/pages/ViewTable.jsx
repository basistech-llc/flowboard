import { useEffect, useState, useCallback } from "react";
import { Typography, Alert, Spin, Table } from "antd";
import { Resizable } from "react-resizable";

import { useAirtableContext } from "../context/AirtableContext";
import AirtableField, {
  AirtableRecordId,
} from "../airtable/renderAirtableFields";
import "react-resizable/css/styles.css";

const { Title } = Typography;

const schema = {
  People: {
    "First Name": { type: "text", width: 150 },
    "Last Name": { type: "text", width: 150 },
    Email: { type: "email", width: 250 },
    Companies: { type: ["record", "Companies"] },
    Role: { type: "text" },
    Tags: { type: "multipleSelect" },
    LinkedIn: { type: "URL", prettyHeading: "LinkedIn URL", width: 350 },
    Crunchbase: { type: "URL", prettyHeading: "Crunchbase URL", width: 350 },
  },
  Companies: {
    Name: { type: "text", prettyHeading: "Company Name", width: 250 },
    "Primary Contact": { type: ["record", "People"] },
    "Home Page": { type: "URL", width: 350 },
    Tagline: { type: "text", width: 300 },
    Crunchbase: { type: "URL", prettyHeading: "Crunchbase URL" },
    "Organization Type": { type: "singleSelect" },
    Headquarters: { type: "text" },
    Investor: { type: "checkbox" },
    Interests: { type: "multipleSelect" },
    "BT Invest Status": { type: "singleSelect" },
    "Portfolio Logo Permission": { type: "checkbox" },
    "Logo URL": { type: "URL" },
    Logo: { type: "image" },
    "Listed on BasisTech Website": { type: "checkbox" },
    Accelerator: { type: "ignore" },
    "(legacy) Funnel": { type: "ignore" },
    "To Company (for Fillout)": { type: "ignore" },
    "Legacy Notes": { type: "multilineText" },
    "Company notes": { type: ["record", "Company notes"] },
  },
  Events: {
    Name: { type: "text" },
    Date: { type: "date", width: 150 },
    Description: { type: "multilineText" },
    Status: { type: "singleSelect", width: 100 },
    Speakers: { type: ["record", "People"], width: 300 },
  },
  "Authorized Users": {
    "First Name": { type: "text", width: 150 },
    "Last Name": { type: "text", width: 150 },
    Email: { type: "email", width: 250 },
  },
};

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ViewTable = ({ tableName }) => {
  const { getTable } = useAirtableContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  const [columns, setColumns] = useState([]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setData(await getTable({ tableName, setError }));
    };

    fetchData();
  }, [getTable, tableName]);

  useEffect(() => {
    const fieldColumns = Object.keys(schema[tableName])
      .filter((key) => schema[tableName][key] !== "ignore")
      .map((key) => {
        const { type, width } = schema[tableName][key];
        const title = schema[tableName][key].prettyHeading || key;
        return {
          title,
          dataIndex: ["fields", key],
          key: key,
          width: width || 200,
          sorter: getSorter(type, key),
          render: (value) =>
            value ? <AirtableField type={type} value={value} /> : "",
        };
      });

    const newColumns = [
      {
        title: "Update/Actions",
        dataIndex: "id",
        key: "id",
        width: 250,
        sorter: (a, b) => a.id.localeCompare(b.id),
        render: (value) => (
          <AirtableRecordId tableName={tableName} id={value} />
        ),
      },
      ...fieldColumns,
    ];

    setColumns(newColumns);
  }, [tableName]);

  const handleResize = useCallback(
    (index) =>
      (e, { size }) => {
        setColumns((prevColumns) => {
          const nextColumns = [...prevColumns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return nextColumns;
        });
      },
    [],
  );

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!data) {
    return <Spin />;
  }

  return (
    <div>
      <Title level={1}>{tableName}</Title>
      <Table
        bordered
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        components={{
          header: {
            cell: ResizeableTitle,
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        rowKey="id"
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

const getSorter = (type, key) => {
  switch (Array.isArray(type) ? type[0] : type) {
    case "text":
    case "multilineText":
    case "email":
    case "URL":
    case "singleSelect":
      return (a, b) => {
        const valA = a.fields[key]?.[0] || "";
        const valB = b.fields[key]?.[0] || "";
        return valA.localeCompare(valB);
      };
    case "record":
      return (a, b) => {
        const valA = a.fields[key]?.[0] || "";
        const valB = b.fields[key]?.[0] || "";
        return valA.localeCompare(valB);
      };
    case "checkbox":
      return (a, b) => {
        const valA = a.fields[key] ? 1 : 0;
        const valB = b.fields[key] ? 1 : 0;
        return valA - valB;
      };
    case "button":
    case "image":
    default:
      return null;
  }
};

export default ViewTable;
