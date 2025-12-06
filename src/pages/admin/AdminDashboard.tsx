import { Link } from "react-router-dom";

export default function AdminDashboard(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
      <div className="mt-4 space-x-4">
        <Link to="/admin/notes" className="px-3 py-2 bg-primary text-white rounded">Notes</Link>
        <Link to="/admin/users" className="px-3 py-2 border rounded">Users</Link>
      </div>
      <div className="mt-6">Analytics & activity feed placeholder</div>
    </div>
  );
}
