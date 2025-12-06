import { Link } from "react-router-dom";

export default function UserDashboard(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Notes</h1>
      <div className="mt-4">
        <p>List of available notes (click to view)</p>
        {/* Replace with real fetch */}
        <ul className="mt-3">
          <li><Link to="/notes/0001" className="text-blue-600">Sample Note 1</Link></li>
        </ul>
      </div>
    </div>
  );
}
