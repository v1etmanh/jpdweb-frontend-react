

import { useState } from 'react';
import TeacherDashboard from './kahoot/TeacherDashboard';
import StudentJoin from './kahoot/StudentJoin';
export default function KahootPage() {
    const [view, setView] = useState('home'); // 'home', 'teacher', 'student'

    return (
        <div className="App">
            {view === 'home' && (
                <div className="home">
                    <h1>🎯 Quiz App - WebSocket Test</h1>
                    <div className="options">
                        <button onClick={() => setView('teacher')} className="btn-teacher">
                            🎓 I'm a Teacher
                        </button>
                        <button onClick={() => setView('student')} className="btn-student">
                            🎮 I'm a Student
                        </button>
                    </div>
                </div>
            )}

            {view === 'teacher' && (
                <>
                    <button onClick={() => setView('home')} className="btn-back">← Back</button>
                    <TeacherDashboard />
                </>
            )}

            {view === 'student' && (
                <>
                    <button onClick={() => setView('home')} className="btn-back">← Back</button>
                    <StudentJoin />
                </>
            )}
        </div>
    );
}