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
      <div tabIndex={0} className="tabs tabs-boxed">
        {tabSelect.map((tab, index) => {
            if (index === activeTab) return <a className="tab tab-active">{tab}</a> 
            return <a className="tab" onClick={() => setActiveTab(index)}>{tab}</a>
        }            
        )}
      </div>
    );
  };
  