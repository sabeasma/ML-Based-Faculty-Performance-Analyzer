import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyManagement from './pages/admin/FacultyManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import PerformanceAnalytics from './pages/admin/PerformanceAnalytics';
import AdminFeedbackAnalysis from './pages/admin/FeedbackAnalysis';
import ResearchPublications from './pages/admin/ResearchPublications';
import FacultyRanking from './pages/admin/FacultyRanking';
import AdminMLInsights from './pages/admin/MLInsights';
import AdminReports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/Settings';
import HodDashboard from './pages/hod/HodDashboard';
import DepartmentFaculty from './pages/hod/DepartmentFaculty';
import DepartmentAnalytics from './pages/hod/DepartmentAnalytics';
import HodFeedbackAnalysis from './pages/hod/FeedbackAnalysis';
import ResearchOutput from './pages/hod/ResearchOutput';
import DepartmentRankings from './pages/hod/DepartmentRankings';
import HodMLInsights from './pages/hod/MLInsights';
import HodReports from './pages/hod/Reports';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MyPerformance from './pages/faculty/MyPerformance';
import FacultyStudentFeedback from './pages/faculty/StudentFeedback';
import AttendanceMetrics from './pages/faculty/AttendanceMetrics';
import ResearchProfile from './pages/faculty/ResearchProfile';
import SkillAnalysis from './pages/faculty/SkillAnalysis';
import AIRecommendations from './pages/faculty/AIRecommendations';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyFeedback from './pages/student/FacultyFeedback';
import CourseFeedback from './pages/student/CourseFeedback';
import FeedbackHistory from './pages/student/FeedbackHistory';

const roleHome = {
  admin: '/admin/dashboard',
  hod: '/hod/dashboard',
  faculty: '/faculty/my-performance',
  student: '/student/dashboard',
};

function ProtectedRoute({ role, children }) {
  const { token, role: userRole } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to={roleHome[userRole] || '/login'} replace />;
  return children;
}

function DashboardShell({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  const { token, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <DashboardShell>
              <AdminDashboard />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/faculty-management" element={<ProtectedRoute role="admin"><DashboardShell><FacultyManagement /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/department-management" element={<ProtectedRoute role="admin"><DashboardShell><DepartmentManagement /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/performance-analytics" element={<ProtectedRoute role="admin"><DashboardShell><PerformanceAnalytics /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/feedback-analysis" element={<ProtectedRoute role="admin"><DashboardShell><AdminFeedbackAnalysis /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/research-publications" element={<ProtectedRoute role="admin"><DashboardShell><ResearchPublications /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/faculty-ranking" element={<ProtectedRoute role="admin"><DashboardShell><FacultyRanking /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/ml-insights" element={<ProtectedRoute role="admin"><DashboardShell><AdminMLInsights /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><DashboardShell><AdminReports /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/user-management" element={<ProtectedRoute role="admin"><DashboardShell><UserManagement /></DashboardShell></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><DashboardShell><AdminSettings /></DashboardShell></ProtectedRoute>} />

      <Route path="/hod" element={<Navigate to="/hod/dashboard" replace />} />
      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute role="hod">
            <DashboardShell>
              <HodDashboard />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route path="/hod/faculty" element={<ProtectedRoute role="hod"><DashboardShell><DepartmentFaculty /></DashboardShell></ProtectedRoute>} />
      <Route path="/hod/department-analytics" element={<ProtectedRoute role="hod"><DashboardShell><DepartmentAnalytics /></DashboardShell></ProtectedRoute>} />
      <Route path="/hod/feedback-analysis" element={<ProtectedRoute role="hod"><DashboardShell><HodFeedbackAnalysis /></DashboardShell></ProtectedRoute>} />
      <Route path="/hod/research-output" element={<ProtectedRoute role="hod"><DashboardShell><ResearchOutput /></DashboardShell></ProtectedRoute>} />
      <Route path="/hod/department-rankings" element={<ProtectedRoute role="hod"><DashboardShell><DepartmentRankings /></DashboardShell></ProtectedRoute>} />
      <Route path="/hod/ml-insights" element={<ProtectedRoute role="hod"><DashboardShell><HodMLInsights /></DashboardShell></ProtectedRoute>} />
      <Route path="/hod/reports" element={<ProtectedRoute role="hod"><DashboardShell><HodReports /></DashboardShell></ProtectedRoute>} />

      <Route path="/faculty" element={<Navigate to="/faculty/my-performance" replace />} />
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute role="faculty">
            <DashboardShell>
              <FacultyDashboard />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route path="/faculty/my-performance" element={<ProtectedRoute role="faculty"><DashboardShell><MyPerformance /></DashboardShell></ProtectedRoute>} />
      <Route path="/faculty/student-feedback" element={<ProtectedRoute role="faculty"><DashboardShell><FacultyStudentFeedback /></DashboardShell></ProtectedRoute>} />
      <Route path="/faculty/attendance-metrics" element={<ProtectedRoute role="faculty"><DashboardShell><AttendanceMetrics /></DashboardShell></ProtectedRoute>} />
      <Route path="/faculty/research-profile" element={<ProtectedRoute role="faculty"><DashboardShell><ResearchProfile /></DashboardShell></ProtectedRoute>} />
      <Route path="/faculty/skill-analysis" element={<ProtectedRoute role="faculty"><DashboardShell><SkillAnalysis /></DashboardShell></ProtectedRoute>} />
      <Route path="/faculty/ai-recommendations" element={<ProtectedRoute role="faculty"><DashboardShell><AIRecommendations /></DashboardShell></ProtectedRoute>} />

      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <DashboardShell>
              <StudentDashboard />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route path="/student/feedback" element={<ProtectedRoute role="student"><DashboardShell><FacultyFeedback /></DashboardShell></ProtectedRoute>} />
      <Route path="/student/course-feedback" element={<ProtectedRoute role="student"><DashboardShell><CourseFeedback /></DashboardShell></ProtectedRoute>} />
      <Route path="/student/history" element={<ProtectedRoute role="student"><DashboardShell><FeedbackHistory /></DashboardShell></ProtectedRoute>} />

      <Route
        path="*"
        element={<Navigate to={token ? roleHome[role] || '/login' : '/login'} replace />}
      />
    </Routes>
  );
}
