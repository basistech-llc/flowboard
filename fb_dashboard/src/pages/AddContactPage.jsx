import React, { useEffect, useState } from "react";
import { Button, Divider, Modal, Row, Typography } from "antd";

import FindRecordForm from "../components/FindRecordForm";
import { onSearch } from "../utils/onSearch";
import { useAirtableContext } from "../context/AirtableContext";

const { Title } = Typography;

const AddContactPage = () => {
  const { people, companies, error } = useFetchAirtableData();

  const [modalVisible, setModalVisible] = useState(null);
  const showModal = (modal) => setModalVisible(modal);
  const onOk = () => setModalVisible(null);
  const onCancel = () => setModalVisible(null);

  const modalSpecs = {
    createPerson: {
      title: "Create Person",
      height: 700,
      airtableUrl:
        "https://airtable.com/embed/appJpgQlIEsFOx98S/pagGmOlDaebkOm0AS/form",
    },
    createCompany: {
      title: "Create Company",
      height: 700,
      airtableUrl:
        "https://airtable.com/embed/appJpgQlIEsFOx98S/pagiWi4xo7wbMQQUt/form",
    },
  };

  const personFieldMap = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
  };

  const companyFieldMap = {
    company: "Name",
  };

  const personFormFields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
  ];

  const companyFormFields = [{ name: "company", label: "Company" }];

  return (
    <div style={{ padding: "24px" }}>
      {modalVisible && (
        <Modal
          title={modalSpecs[modalVisible].title}
          open={modalVisible}
          onOk={onOk}
          onCancel={onCancel}
          footer={null}
          // width="80%" // Adjust the width as needed
          // style={{ top: 20 }} // Adjust the top position as needed
        >
          <iframe
            className="airtable-embed"
            src={modalSpecs[modalVisible].airtableUrl}
            width="100%"
            height={modalSpecs[modalVisible].height}
            style={{ background: "transparent", border: "1px solid #ccc" }}
          ></iframe>
        </Modal>
      )}
      <Title level={2}>Add Contact</Title>
      <Divider />
      <Title level={3}>Find Person</Title>
      <FindRecordForm
        formFields={personFormFields}
        records={people}
        onSearch={onSearch}
        fieldMap={personFieldMap}
        formName="find_person"
      />
      <Divider />
      <Row gutter={16}>
        <Button type="default" onClick={() => setModalVisible("createPerson")}>
          {"Create New Person"}
        </Button>
      </Row>
      <Divider />
      <Title level={3}>Find Company</Title>
      <FindRecordForm
        formFields={companyFormFields}
        records={companies}
        onSearch={onSearch}
        fieldMap={companyFieldMap}
        formName="find_company"
      />
      <Divider />
      <Row gutter={16}>
        <Button type="default" onClick={() => setModalVisible("createCompany")}>
          {"Create New Company"}
        </Button>
      </Row>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

const useFetchAirtableData = () => {
  const { getTable } = useAirtableContext();
  const [people, setPeople] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (tableName, setter) => {
      setter(await getTable({ tableName, setError }));
    };

    fetchData("People", setPeople);
    fetchData("Companies", setCompanies);
  }, [getTable]);

  return { people, companies, error };
};

export default AddContactPage;
