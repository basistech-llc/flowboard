import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Form, Input, List, Row } from "antd";

/**
 * A form component for searching and selecting records.
 *
 * @param {Array} formFields - Fields to display in the form.
 * @param {string} formName - Unique name for the form.
 * @param {Array} records - Records to search through.
 * @param {function} onSearch - Callback for handling search logic.
 * @param {object} fieldMap - Mapping of form fields to record fields.
 *
 * Usage:
 * This component renders a form for searching records and a list for displaying
 * the results. It supports incremental search and auto-filling form fields when
 * a list item is clicked.
 */
const FindRecordForm = ({
  formFields,
  formName,
  records,
  onSearch,
  fieldMap,
}) => {
  const [form] = Form.useForm();
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  const handleValuesChange = (changedValues, allValues) => {
    onSearch(allValues, setFilteredRecords, records, fieldMap);
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
                  values[name] = record.fields[fieldMap[name]];
                });
                form.setFieldsValue(values);
              }}
            >
              {formFields
                .map(({ name }) => record.fields[fieldMap[name]])
                .join(" ")}
            </List.Item>
          )}
        />
      </Form>
    </>
  );
};

FindRecordForm.propTypes = {
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSearch: PropTypes.func.isRequired,
  fieldMap: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
};

export default FindRecordForm;
