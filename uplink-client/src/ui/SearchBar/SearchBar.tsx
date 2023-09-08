"use client";
import React from "react";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

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
    <form onSubmit={handleSearchSubmit}>
      <div className="form-control">
        <div className="input-group ml-auto">
          <input
            type="text"
            placeholder="Search…"
            spellCheck="false"
            value={searchQuery}
            onChange={handleSearchChange}
            className="input"
          />
          <button className="btn btn-square">
            <HiMagnifyingGlass className="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>
  );
}
