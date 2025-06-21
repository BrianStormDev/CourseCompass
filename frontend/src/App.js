import { AuthProvider, useAuth } from './AuthContext';
import CoursePlannerQuestionnaire from './Components/CoursePlannerQuestionnaire';
import Login from './Components/Login'; 

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <CoursePlannerQuestionnaire />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

