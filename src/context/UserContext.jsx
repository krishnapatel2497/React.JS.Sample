import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();                                //Jetla components ma data share karvo hoy te badha ma use kari shakay che.

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {                              //callback function/ek var run thase
    const saved = localStorage.getItem("users");                         //localStorage ma "users" key ni value search kare che.
    const parsed = saved ? JSON.parse(saved) : [];                       //jo data male to string ne object/array ma convert kare.
    return parsed.map((u) => ({ ...u, hobbies: u.hobbies || [] }));     //parsed=ek array che(users ni list) .map()=thi badha users par loop kare che. //jo hobbies hoy to use kare, nahi to empty array aape.
  });
  

  useEffect(() => {                                                        // useEffect no use localstorage ma  data save/update  karva mate thay che
    localStorage.setItem("users", JSON.stringify(users));                  //users array ne string ma convert kari localStorage ma save kare che.
  }, [users]);                                                             //dependency [users] che.

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
