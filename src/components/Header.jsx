import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import {useFilter} from '../context/FilterContext';
import { SEARCH_PRODUCTS } from '../utils/constsant';


function Header(){

  const navigator = useNavigate();
  const { dispatch } = useFilter();

  const handleSearch = (event)=>
  {
      event.preventDefault();
      const searchQuery = event.target.value;

      dispatch({ type: SEARCH_PRODUCTS, payload: searchQuery });
        navigator("/products");
       
     

  }
  return (
    <header className='  sticky top-0 bg-gradient-to-r from-sky-400 to-indigo-800  pb-2 z-[100]'>
        <nav className=' text-white flex  justify-between  items-center  px-2 pt-4 ' >

{/* left */}
            <div className='hidden sm:flex space-x-8'>
                {/* logo */}
                  <h1 className='text-3xl font-bold cursor-pointer' onClick={()=> navigator("/")}>BOLDX</h1>
                  {/* menu */}
                  <ul className='flex space-x-4 items-center font-extralight '>
                    <li>Home</li>
                    <li>Buy Now</li>
                  </ul>
            </div>

            {/* right */}

            <div className='hidden sm:flex space-x-4 items-center'>

                <form className='flex flex-col '>
                    <input type="search"  placeholder='Search' className='px-4 py-2 rounded border-none outline-none text-black' onChange={handleSearch}/>
                </form>
                <div>
                    <ul className='md:flex space-x-4 items-center hidden font-extralight '>
                    <li><button className="px-4 py-2 rounded bg-white text-blue-600  font-semibold" onClick={()=> navigator("/login")}>Login</button></li>
                        <li  onClick={ ()=>  navigator("/account")}><PersonIcon/></li>
                        <li><FavoriteIcon/></li>
                        <li onClick={()=> navigator("/cart")}><LocalMallIcon/></li>
                       
                    </ul>
                </div>
            </div>
           

   {/* mobile search */}
            <div className='sm:hidden flex    items-center w-full  justify-between'>
             
             <div className='flex items-center space-x-2 '>
             <MenuIcon/>
            <h1 className='text-xl font-bold cursor-pointer' onClick={()=> navigator("/")}>BOLDX</h1>
             </div>

             
             <ul className='flex  space-x-2 items-center  font-extralight '>
             <li><button className="px-4 py-2 rounded bg-white text-blue-600  font-semibold" onClick={()=> navigator("/login")}>Login</button></li>

                        <li  onClick={ ()=>  navigator("/account")}><PersonIcon/></li>
                        <li><FavoriteIcon/></li>
                        <li onClick={()=> navigator("/cart")}><LocalMallIcon/></li>
                    </ul>

           

            </div>


        </nav>
      
      

        

    </header>
  )
}

export default Header