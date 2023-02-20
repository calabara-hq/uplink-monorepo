"use client";
import { authOptions } from "@/lib/auth";
import { Inter } from "@next/font/google";
import { getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";

const testPost = async () => {
  const response = await fetch("http://localhost:8080/api/auth/sign_out", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    credentials: "include",
    body: JSON.stringify({ name: "Nextjs" }),
  })
  console.log(response)
};



const testPost2 = async () => {
  const response = await fetch("/api/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "THIS IS MY AUTH TOKEN"
    },
    body: JSON.stringify({ name: "Nextjs" }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};



export default function Page() {
  //const session = useSession();
  //console.log(session);
  return (
    <div>
      <p>hello from route 1</p>
      <Link className="btn" href="/route2">
        go to route 2
      </Link>
      <button className="btn" onClick={testPost}>test post1</button>
      {/*<button className="btn" onClick={testPost2}>test post2</button>*/}

    </div>
  );
}
