/**
 * Filters records based on the provided search criteria.
 *
 * @param {object} allValues - Values in the search fields.
 * @param {function} setFilteredRecords - Callback to update the filtered records.
 * @param {Array} records - Source array.
 *
 * Usage:
 * This function filters a list of records. It can be called dynamically as the
 * user types into search fields.  The search is case-insensitive and allows
 * partial matches.
 */
export const onSearch = (allValues, setFilteredRecords, records) => {
  console.log("allValues", allValues);
  console.log("records", records);
  const filtered = records.filter((record) => {
    const fields = record.fields;
    return Object.keys(allValues).every((key) => {
      const searchValue = allValues[key];
      const recordField = fields[key];
      return (
        !searchValue ||
        recordField?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  });
  setFilteredRecords(filtered);
};
