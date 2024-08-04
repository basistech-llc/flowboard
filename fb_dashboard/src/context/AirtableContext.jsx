import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import fetchAirtableData from "../airtable/fetchAirtableData";
import { obfuscate, deobfuscate } from "../utils/trivialObfuscation";

const AirtableContext = createContext();

/* eslint-disable-next-line react-refresh/only-export-components */
export const useAirtableContext = () => useContext(AirtableContext);

export const AirtableProvider = ({ children }) => {
  const baseId = "appJpgQlIEsFOx98S";
  const [airtableToken, setAirtableToken] = useState("");
  const [cachedTables, setCachedTables] = useState({});
  const [initializing, setInitializing] = useState(true);
  const fetchPromises = {}; // To track ongoing fetch operations

  useEffect(() => {
    const storedToken = localStorage.getItem("airtableToken");
    if (storedToken) {
      setAirtableToken(deobfuscate(storedToken));
    }
    setInitializing(false);
  }, []);

  const updateAirtableToken = (token) => {
    const encodedToken = obfuscate(token);
    setAirtableToken(token);
    localStorage.setItem("airtableToken", encodedToken);
  };

  const getTable = async ({ tableName, setError, cachedOk = true }) => {
    if (cachedOk && cachedTables[tableName]) {
      return cachedTables[tableName];
    }

    if (fetchPromises[tableName]) {
      // If there's already an ongoing fetch for this table, wait for it
      return fetchPromises[tableName];
    }

    if (airtableToken) {
      try {
        fetchPromises[tableName] = fetchAirtableData(
          airtableToken,
          baseId,
          tableName,
        )
          .then((records) => {
            setCachedTables((prev) => ({ ...prev, [tableName]: records }));
            delete fetchPromises[tableName];
            return records;
          })
          .catch((err) => {
            setError(err.message);
            delete fetchPromises[tableName];
            throw err;
          });

        return fetchPromises[tableName];
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Missing Airtable access token");
    }
  };

  return (
    <AirtableContext.Provider
      value={{
        airtableToken,
        updateAirtableToken,
        baseId,
        initializing,
        getTable,
      }}
    >
      {children}
    </AirtableContext.Provider>
  );
};

AirtableProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
