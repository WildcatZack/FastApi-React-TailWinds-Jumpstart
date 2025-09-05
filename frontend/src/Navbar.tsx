import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-3 px-4">
      <a href="/" className="text-lg font-semibold hover:opacity-90">
        Jumpstarter
      </a>
      <ul className="flex gap-6 text-sm">
        <li><a className="hover:underline" href="/">John</a></li>
        <li><a className="hover:underline" href="https://github.com/WildcatZack/FastApi-React-TailWinds-Jumpstart" target="_blank" rel="noreferrer">Repo</a></li>
      </ul>
    </nav>
  );
}
