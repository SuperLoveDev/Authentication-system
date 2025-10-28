"use client";

import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full items-center px-4">
      <div className="sm:px-[5vw] md:px-[7vw] lg:px-[9vw] mx-auto my-10">
        <div className="flex justify-between">
          <Link href={"/"} className="text-gray-400">
            Auth&Co.
          </Link>

          <Link href={"/login"} className="text-gray-400">
            Login
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <p className="text-3xl sm:text-5xl text-center text-gray-400">
            Unclock your Auth system power
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
