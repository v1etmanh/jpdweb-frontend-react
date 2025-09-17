import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomepageComponent from "./HomeComponent";
import CoursesResultComponent from "./CoursesResultComponent";

import CourseDescription from "./CourseDescription";

export default function JpdWebComponent(){
return (<div>

    <BrowserRouter>
    <div className="main-content bg-white">
                        <Routes>
                        <Route path="/" element={<HomepageComponent></HomepageComponent>}></Route>
                        <Route path="/course_result/:name" element={<CoursesResultComponent></CoursesResultComponent>}></Route>
                        <Route path="/course/specific/:id" element={<CourseDescription></CourseDescription>}></Route>
                               </Routes>
                    </div>
                    </BrowserRouter>
</div>)
}