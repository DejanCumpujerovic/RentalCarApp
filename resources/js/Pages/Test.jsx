import React, { useState } from 'react';

const Test = ({ page }) => 
    { 
        return ( <div> {page ? <h1>{page}</h1> : <h1>No page data</h1>} </div> 

        ); 
    }; export default Test;