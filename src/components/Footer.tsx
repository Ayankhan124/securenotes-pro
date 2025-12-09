export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white py-6 text-center text-sm text-slate-500">
      <p>
        © {new Date().getFullYear()} SecureNotes Pro — Made with ❤️ by{" "}
        <a
          href="https://github.com/Ayankhan124"
          target="_blank"
          className="font-medium text-indigo-600 hover:underline"
        >
          Ayyan Khan
        </a>
      </p>
    </footer>
  );
}
