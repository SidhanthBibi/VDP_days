import * as React from "react"

//import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {

    _?: never; // Dummy property to satisfy ESLint
  }

  const Input: React.FC<InputProps> = ({ placeholder, value, onChange, ...rest }) => {
    return (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
        className="border border-gray-300 p-2 rounded"
      />
    );
  };
Input.displayName = "Input"

export { Input }