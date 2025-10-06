
import { useState } from 'react';
import './App.css';

import JpdWebComponent from './jpdweb/JpdWebComponent';



function App() {


  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleBackToList = () => {
    setSelectedCourse(null);
  };

 
  return (
  
    <div className="App font-dm">
 
   <JpdWebComponent></JpdWebComponent>

    </div>

 
  );
}

export default App;
