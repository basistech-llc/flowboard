const writeAirtableRecord = async ({
  airtableToken,
  baseId,
  tableName,
  recordFields,
}) => {
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableName}`);
  const body = JSON.stringify({ fields: recordFields });
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${airtableToken}`,
      "Content-Type": "application/json",
    },
    body: body,
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    console.error(`Error creating record in ${tableName}:`, errorDetails);
    throw new Error(
      `Error: ${response.status} - ${errorDetails.error.message}`,
    );
  }

  const data = await response.json();
  console.log("Got", data);
  return data;
};

export default writeAirtableRecord;
