import React from 'react';

interface InputFieldProps {
    type: string;
    placeholder: string;
    design: string;
}

export const InputField: React.FC<InputFieldProps> = ({type, placeholder, design}) => {
    return (
        <div>
            <input
                type ={type}
                placeholder = {placeholder}
                className={design}
                />

        </div>
    );
};

