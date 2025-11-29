"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

 useEffect(() => {
  if (!loading) {
    if (user) {
      const userRoles = Array.isArray(user.role)
        ? user.role.map((r) => r.replace(/[\[\]]/g, ""))
        : [user.role.replace(/[\[\]]/g, "")];

      if (userRoles.includes("ROLE_ADMIN")) {
        router.replace("/admin");
      } else if (userRoles.includes("ROLE_DEAN")) {
        router.replace("/dean");
      } else if (userRoles.includes("ROLE_TEACHER")) {
        router.replace("/teacher");
      }
        else {
        router.replace("/signin"); // unknown role, redirect to signin
        }
    } else {
      router.replace("/signin"); // only redirect if user is null
    }
  }
}, [user, loading, router]);


  return 

}
