"use client";

import { useEffect, useState } from "react";

export default function ProfileInfoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [message, setMessage] = useState("");
  const [isOAuth, setIsOAuth] = useState(false); 
  const [provider, setProvider] = useState("credentials"); 

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/auth/profile/info");
      const data = await res.json();
      setName(data.name || "");
      setEmail(data.email || "");
      setIsOAuth(data.isOAuth || false); 
      setProvider(data.provider || "credentials");
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/profile/info", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setMessage("Profile information has been updated.");
    } else {
      setMessage("Update failed. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Profile Info</h2>
        {isOAuth && (
          <div className="p-3 mb-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 text-sm rounded">
            {provider === "google" && "You are signed in with Google."}
            {provider === "github" && "You are logged in at GitHub."}
            {!["google", "github"].includes(provider) && `${provider} via login.`}
            <br />
            Profile information cannot be changed.
          </div>
    )}
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 text-sm font-medium">Name</label>
          {isOAuth ? (
            <p className="text-gray-600">{name}</p>
          ) : (
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email Address</label>
          {isOAuth ? (
            <p className="text-gray-600">{email}</p>
          ) : (
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </div>

        <button
          type="submit"
          className={`px-4 py-2 text-white rounded ${
            isOAuth ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
          disabled={isOAuth}
        >
          Save
        </button>

        {message && (
          <p className="text-sm mt-2 text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
