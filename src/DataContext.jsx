import { createContext, useState, useContext } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(0); // Example state to store user data

  return (
    <DataContext.Provider value={{ userData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

export default DataProvider;