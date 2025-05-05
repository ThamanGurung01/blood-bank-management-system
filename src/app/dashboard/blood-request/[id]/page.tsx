"use client";
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}
  
  const page=({ params }: Props)=> {
    const { id } = use(params);
  console.log(id);
    return (
      <div className='initialPage'>
        <h1>Blood Request Page</h1>
        <p>Request ID: {id}</p>
      </div>
    );
  }
  export default page