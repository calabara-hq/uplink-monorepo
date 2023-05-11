"use client";
import React from "react";
import { useState } from "react";

export interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ spaces }: any) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const onSearch = (query: string) => {
    console.log(query);
  };
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };


  return (
    <>
      <div className="form-control">
        <div className="input-group ml-auto">
          <input
            type="text"
            placeholder="Search…"
            spellCheck="false"
            value={searchQuery}
            onChange={handleSearchChange}
            className="input focus:shadow-box"
          />
          <button className="btn btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
