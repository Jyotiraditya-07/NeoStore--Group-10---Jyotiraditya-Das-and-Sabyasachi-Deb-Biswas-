import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [auth, setauth] = useState({
    keywords: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[auth, setauth]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);
export { SearchProvider, useSearch };
