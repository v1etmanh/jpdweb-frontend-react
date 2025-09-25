
import { useState } from 'react';
import './App.css';
import CourseDetail from './jpdweb/CourseCommercialDetailComponent';
import CourseContentOverviewComponent from './jpdweb/CourseContentOverviewComponent';
import CoursesTable from './jpdweb/CourseTable';
import HomepageComponent from './jpdweb/HomeComponent';
import JpdWebComponent from './jpdweb/JpdWebComponent';
import MyLearningComponent from './jpdweb/MyLearningComponent';
import VideoPlayer from './jpdweb/VideoPlayerComponent';
import WritingComponent from './jpdweb/WritingComponent';


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
