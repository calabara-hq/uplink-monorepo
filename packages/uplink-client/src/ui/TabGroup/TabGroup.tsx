'use client'

import { useState, useEffect } from "react";


const tabSelect = [
    "Submitting",
    "All Active",
    "Voting",
];

export default function TabGroup () {
  
    const [activeTab, setActiveTab] = useState(0);


    return (
      <div tabIndex={0} className="tabs tabs-boxed content-center h-12 p-2 bg-[#303339] text-white font-bold">
        {tabSelect.map((tab, index) => {
            if (index === activeTab) return <a className="tab tab-active">{tab}</a>
            return <a className="tab text-white font-bold" onClick={() => setActiveTab(index)}>{tab}</a>
        }            
        )}
      </div>
    );
  };
  