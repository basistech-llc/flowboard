const fetchAirtableData = async (airtableToken, baseId, tableName) => {
  const records = [];
  let offset = null;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableName}`);
    if (offset) {
      url.searchParams.append("offset", offset);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${airtableToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Airtable");
    }

    const data = await response.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
};

export default fetchAirtableData;
