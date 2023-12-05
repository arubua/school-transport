// UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
	id: number
	firstname: string
	lastname: string
	email: number
	phone_number: number
	role_id: string
	password: string
	status: string
	changed_password: string
	school: {
		id: string
		name: string
	}
}

interface UserContextProps {
	user: User | null
	setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const defaultValue: UserContextProps = {
	user: null,
	setUser: () => null,
}

const UserContext = createContext<UserContextProps>(defaultValue)

export const useUser = () => useContext(UserContext)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem('USER');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };
