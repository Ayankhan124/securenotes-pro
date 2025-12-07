import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-primary grid place-items-center text-white font-bold">
          SN
        </div>
        <div className="leading-tight">
          <div className="text-lg font-semibold text-primary">
            SecureNotes Pro
          </div>
          <div className="text-xs text-gray-500 -mt-0.5">
            Protected note distribution
          </div>
        </div>
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        {!user && (
          <>
            <Link to="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-primary"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md bg-primary text-white font-medium"
            >
              Sign in
            </Link>
          </>
        )}
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary"
            >
              Dashboard
            </Link>
            <button
              onClick={signOut}
              className="px-3 py-1 rounded-md border border-gray-300"
            >
              Sign out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
