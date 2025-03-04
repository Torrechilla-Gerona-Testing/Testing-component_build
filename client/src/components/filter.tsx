import React from "react";

interface FilterProps{
    salary: number;
}


const Filter: React.FC<FilterProps> = ({salary}) => {
    return ( 
            
            <div>
                {salary}
            </div>
    )
}

export default Filter