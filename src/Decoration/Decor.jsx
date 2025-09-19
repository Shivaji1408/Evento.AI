import React, { useState } from 'react'
import{Form} from 'react-bootstrap'
import {useRef,useEffect} from 'react'
import axios from "axios"


const API_URL = 'https://api.unsplash.com/search/photos';
const Images_per_page = 20;

const Decor = () => {
  const searchInput = useRef(null);
  const [images,setImages] = useState([]);
  const [totalPages,setTotalPages] = useState(0);

  const fetchImages = async()=>{
    try {
            const {data} = await axios.get(
  `${API_URL}?query=${searchInput.current.value}&page=1&per_page=${Images_per_page}&client_id=${import.meta.env.VITE_API_KEY}`
);
            setImages(data.results)
            setTotalPages(data.total_pages)
         }catch (error) {
            console.log(error)   
         }
        };
  const handleSearch = (event)=>{
    event.preventDefault();
    console.log(searchInput.current.value);
    fetchImages();
  }
  const handleSelection=(selection)=>{
    searchInput.current.value = selection;
    fetchImages();
  }
  return (
        <div class="container">
            <h1 className="title">Event Decor</h1>
            <div className='search-section'>
                <form onSubmit={handleSearch}>
                    <Form.Control 
                    type="text" 
                    placeholder='Type something ...'
                    className='search-input'
                    ref={searchInput}/>
                </form>
            </div>
            <div className = "filters">
                <div onClick={()=>handleSelection('Birthday Decors')}>Birthday Decors</div>
                <div onClick={()=>handleSelection('Wedding Decors')}>Wedding Decors</div>
                <div onClick={()=>handleSelection('Enganement Decors')}>Enganement Decors</div>
                <div onClick={()=>handleSelection('Mehandi Decors')}>Mehandi Decors</div>
            </div>
            <div className='images'>
                {images.map(image =>{
                        return(
                            <img 
                            key={image.id} 
                            src={image.urls.small} 
                            alt={image.alt_description}
                            className='image'
                            />
                        )
                    })
                }
            </div>
        </div>
  )
}

export default Decor