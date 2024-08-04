import { useState, useEffect } from "react";
import { Button, Divider, Form, Input, Typography } from "antd";
import { useAirtableContext } from "../context/AirtableContext";
import { useNavigate } from "react-router-dom";

import Markdown from "../components/Markdown";

const { Title } = Typography;

const markdownContent = `
## Config

### To obtain your Airtable API token, follow these steps:

#### Log in to Airtable:

* Go to [Airtable](https://airtable.com/) and log in with your credentials.

#### Navigate to the Developer Hub:

* Click on your profile picture or initials in the top-right corner of the
  Airtable interface.
* Select “Developer hub” from the dropdown menu.

#### Generate a Personal Access Token:

* In the Developer Hub, select the section “Personal Access Tokens”.
* Click on “Create New Token”.
* Follow the prompts to create a new Personal Access Token, specifying the
  scopes and bases you want to grant access to.
  * Scope: [TBD] For now, I've selected all. This is probably overkill. (It's
  likely enough to select \`data.records:read\`, \`data.records:write\`, and
  \`schema.base:read\`)
  * Base: Select only \`BT Events and Funnel\` (under \`BASISTECH\`)
* Copy the generated token. This is your Personal Access Token.


#### Save your token here:

* Paste the token below.
* Click “Save Token”.
* Note that this will only save the token locally in your browser.
`;

const ConfigPage = () => {
  const { airtableToken, updateAirtableToken } = useAirtableContext();
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setToken(airtableToken || "");
  }, [airtableToken]);

  const handleSubmit = () => {
    updateAirtableToken(token);
    navigate("/");
  };

  return (
    <>
      <Markdown markdown={markdownContent} />
      <Divider />
      <Title level={3}>Enter token now:</Title>
      <Form
        layout="vertical"
        initialValues={{ token: airtableToken }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Airtable Token"
          name="token"
          rules={[
            { required: true, message: "Please input your Airtable token!" },
          ]}
        >
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: "700px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Token
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ConfigPage;
