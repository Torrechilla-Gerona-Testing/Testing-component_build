import React from "react";

interface DislpayProps {
    Firstname: string;
    Lastname: string;
    salary: number;


}
const Display: React.FC<DislpayProps> = ({Firstname, Lastname, salary}) => {
    return (
        <div className="flex items-center justify-evenly space-x-4 space-y-6 bg-red-200"> 
            <div> {Firstname}</div>
            <div>{Lastname}</div>
            <div>{salary}</div>
        </div>
    )
}

export default Display;