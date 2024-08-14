import { useEffect, useState } from "react";
import { Divider, Typography } from "antd";

import AirtablePopup from "../components/AirtablePopup";
import FindRecordForm from "../components/FindRecordForm";
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

  const personFormFields = [
    { name: "First Name", label: "First Name" },
    { name: "Last Name", label: "Last Name" },
    { name: "Email", label: "Email" },
  ];

  const companyFormFields = [{ name: "Name", label: "Company" }];

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
        tableName="People"
        formFields={personFormFields}
        records={people}
        formName="find_person"
      />
      <Divider />
      <Title level={3}>Find Company</Title>
      <FindRecordForm
        tableName="Companies"
        formFields={companyFormFields}
        records={companies}
        formName="find_company"
      />
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default AddContactPage;
