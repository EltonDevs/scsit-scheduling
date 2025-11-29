// hooks/useRoleRedirect.ts
"use client";
import { useRouter } from "next/navigation";

export const useRoleRedirect = () => {
  const router = useRouter();

  const redirectByRole = (role: string) => {
    const userRoles = Array.isArray(role)
            ? role.map(r => r.replace(/[\[\]]/g, '')) // remove brackets
            : [role.replace(/[\[\]]/g, '')];

    if (userRoles.includes("ROLE_ADMIN")) {
      router.push("/admin");
    } else if (userRoles.includes("ROLE_DEAN")) {
      router.push("/dean");
    } else if (userRoles.includes("ROLE_TEACHER")) {
      router.push("/teacher");
    } else {
      router.push("/not-found");
    }
  };

  return { redirectByRole };
};
