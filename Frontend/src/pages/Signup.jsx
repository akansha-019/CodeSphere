import { useForm } from 'react-hook-form';

// zod

function Signup(){

    const {register, handleSubmit,formState: { errors },} = useForm();

    // const submittedData = (data)=>{
    //     console.log(data);
    // }

    const submittedData = (data) => {
        console.log(data)

    }

    return(
        <>
        <form onSubmit={handleSubmit(submittedData)}>
        <input {...register('firstName')} 
        placeholder='Enter Name'/>
        <input {...register('email')} 
        placeholder="Enter Email"/>
        
        <input {...register('password')} 
        placeholder="Enter Password"/>
        <button type='submut' className='btn btn-lg'>Submit</button>
        </form>
        </>
    )
}

//{
//    name:"firstName"
//    onChange:{}
//    onBlur:{}
// }



export default Signup








// import { useEffect, useState } from "react"


// function Signup(){

//     const [name,setName] = useState('');
//     const [email,setEmail] = useState('');
//     const [password,setPassword] = useState('');
   
//     const handleSubmit = (e)=>{
       
//         e.preventDefault();

//         console.log(name,email,password);
        
//         // validation
        
       

//         // Form ko submit kar denge
//         // Backend submit
        
//     }

//     return(
//         <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3 ">
//           <input type="text" name="firstName" value={name} placeholder="Enter your firstName" onChange={(e)=>setName(e.target.value)}></input>
//           <input type="email" value={email} placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)}></input>
//           <input type="password" value={password} placeholder="Enter your Password" onChange={(e)=>setPassword(e.target.value)}></input>
//           <button type="submit">Submit</button>
//         </form>
//     )
// }

// firstName: "Rohit"
// 