'use client'

import { useState, useEffect } from "react";


const tabSelect = [
    "Active",
    "All Contests",
    "Closed",
];


export default function TabGroup () {
  
    const [activeTab, setActiveTab] = useState(0);


    return (
      <div tabIndex={0} className="tabs tabs-boxed content-center p-2 bg-transparent text-white font-bold">
        {tabSelect.map((tab, index) => {
            if (index === activeTab) return <a key={index} className="tab tab-active">{tab}</a>
            return <a key={index} className="tab text-white font-bold" onClick={() => setActiveTab(index)}>{tab}</a>
        }            
        )}
      </div>
    );
  };




  
