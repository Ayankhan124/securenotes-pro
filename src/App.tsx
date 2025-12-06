import ProtectedRoute from "./lib/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import SecureNoteViewer from "./pages/user/SecureNoteViewer";

// inside <Routes>:
<Route path="/dashboard" element={
  <ProtectedRoute><UserDashboard /></ProtectedRoute>
} />
<Route path="/notes/:id" element={
  <ProtectedRoute><SecureNoteViewer /></ProtectedRoute>
} />