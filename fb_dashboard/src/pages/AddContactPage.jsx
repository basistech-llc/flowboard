import React, { useEffect, useState } from "react";
import { Button, Divider, Modal, Row, Typography } from "antd";

import AirtablePopup from "../components/AirtablePopup";
import FindRecordForm from "../components/FindRecordForm";
import { onSearch } from "../utils/onSearch";
import { useAirtableContext } from "../context/AirtableContext";

const { Title } = Typography;

const AddContactPage = () => {
  const { getTable } = useAirtableContext();
  const [error, setError] = useState(null);
  const [people, setPeople] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    (async () => {
      setPeople(await getTable({ tableName: "People", setError }));
      setCompanies(await getTable({ tableName: "Companies", setError }));
    })();
  });

  const [openModal, setOpenModal] = useState(null);
  const onOk = () => setOpenModal(null);
  const onCancel = () => setOpenModal(null);

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
      {openModal && (
        <AirtablePopup
          title={modalSpecs[openModal].title}
          airtableFormUrl={modalSpecs[openModal].airtableUrl}
          isOpen={!!openModal}
          onOk={onOk}
          onCancel={onCancel}
          height={modalSpecs[openModal].height}
        />
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
        <Button type="default" onClick={() => setOpenModal("createPerson")}>
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
        <Button type="default" onClick={() => setOpenModal("createCompany")}>
          {"Create New Company"}
        </Button>
      </Row>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default AddContactPage;
