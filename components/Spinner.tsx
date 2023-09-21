"use client";

import React from "react";

const Spinner = () => {
  return (
    <div className="w-full flex items-center justify-center py-5">
      <div className="w-6 h-6 rounded-full border-t border-l border-blue-500 animate-spin" />
    </div>
  );
};

export default Spinner;
