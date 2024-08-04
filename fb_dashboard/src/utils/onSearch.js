/**
 * Filters records based on the provided search criteria.
 *
 * @param {object} allValues - Values in the search fields.
 * @param {function} setFilteredRecords - Callback to update the filtered records.
 * @param {Array} records - Source array.
 * @param {object} fieldMap - Mapping of form field names to record field names.
 *
 * Usage:
 * This function filters a list of records. It can be called dynamically as the
 * user types into search fields.  The search is case-insensitive and allows
 * partial matches.
 */
export const onSearch = (allValues, setFilteredRecords, records, fieldMap) => {
  const filtered = records.filter((record) => {
    const fields = record.fields;
    return Object.keys(fieldMap).every((key) => {
      const searchValue = allValues[key];
      const recordField = fields[fieldMap[key]];
      return (
        !searchValue ||
        recordField?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  });
  setFilteredRecords(filtered);
};
