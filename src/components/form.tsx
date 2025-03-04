"use client";
import React from 'react'

const Form = ({type}:{type:string}) => {
  return (
    <div>
        <h1>{type}</h1>
<form onSubmit={(e)=>{e.preventDefault()}} className="flex flex-col">
    <label htmlFor="email" className="">
        Email:
        <input type="email" id="email" name="email"/>
    </label>
    <label htmlFor="password" className="">
        Password:
        <input type="password" id="password" name="password" />
    </label>
    <button type="submit">{type}</button>
</form>
    </div>
  )
}

export default Form