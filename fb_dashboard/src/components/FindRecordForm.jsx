import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Form, Input, List, Row } from "antd";

import writeAirtableRecord from "../airtable/writeAirtableRecord";
import { useAirtableContext } from "../context/AirtableContext";
import { onSearch } from "../utils/onSearch";

/**
 * A form component for searching and selecting records.
 *
 * @param {Array} formFields - Fields to display in the form.
 * @param {string} formName - Unique name for the form.
 * @param {Array} records - Records to search through.
 *
 * Usage:
 * This component renders a form for searching records and a list for displaying
 * the results. It supports incremental search and auto-filling form fields when
 * a list item is clicked.
 */
const FindRecordForm = ({ tableName, formFields, formName, records }) => {
  const { airtableToken, baseId } = useAirtableContext();

  const [form] = Form.useForm();
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  const handleValuesChange = (changedValues, allValues) => {
    onSearch(allValues, setFilteredRecords, records);
  };

  return (
    <>
      <Form
        form={form}
        name={formName}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        {formFields.map(({ name, label }) => (
          <Row gutter={16} key={name}>
            <Col span={24}>
              <Form.Item name={name} label={label}>
                <Input placeholder={label} />
              </Form.Item>
            </Col>
          </Row>
        ))}
        <List
          bordered
          dataSource={filteredRecords}
          style={{ cursor: "pointer", maxHeight: "200px", overflowY: "auto" }}
          renderItem={(record) => (
            <List.Item
              onClick={() => {
                const values = {};
                formFields.forEach(({ name }) => {
                  values[name] = record.fields[name];
                });
                form.setFieldsValue(values);
              }}
            >
              {formFields.map(({ name }) => record.fields[name]).join(" ")}
            </List.Item>
          )}
        />
        <Form.Item style={{ marginTop: "1em" }}>
          <Button
            onClick={() => {
              writeAirtableRecord({
                airtableToken,
                baseId,
                tableName,
                recordFields: form.getFieldsValue(),
              });
            }}
          >
            {`Create New ${tableName}`}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

FindRecordForm.propTypes = {
  tableName: PropTypes.string.isRequired,
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSearch: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
};

export default FindRecordForm;
