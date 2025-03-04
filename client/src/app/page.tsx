import React from "react";
import Header from "../components/header";
import InputField from "../components/inputfield";
import Display from "../components/display"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-background flex flex-col">
      <Header
        text="Prutas"
        Image="/01.png"/>
        <div>
          <h1 className="text-3xl text-center font-bold text-black">Welcome to Prutas!</h1>
          <p className="text-center text-black">Prutas is a simple CRUD application that allows you to create, read, update, and delete posts.</p>
          <InputField
            type="text"
            placeholder="Enter title"
            design="border-2 border-black rounded-md w-1/2 mx-auto my-4 p-2"
          />
          
          <Display 
          Firstname="John"
          Lastname="Gerona"
          salary={100}
          />
        </div>
    </div>
  );
}
