import React  from 'react';
import UserList from './UserList';
import { BrowserRouter , Route, Routes} from 'react-router-dom';
import ViewDetails from './ViewDetails';


function App() {
  
    return (
      <>
        <BrowserRouter>
          <Routes >
            <Route  index  path="/github-user-api" element={<UserList/>}/> 
            <Route  path ='/github-user-api/:userName' element={<ViewDetails/>}/> 
          </Routes>
        </BrowserRouter>
      </>
  )
  
}

export default App;
