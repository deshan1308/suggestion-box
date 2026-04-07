import { NextRequest } from "next/server";
import { getAdminPassword } from "@/lib/env";

export function verifyAdminRequest(request: NextRequest) {
  const provided = request.headers.get("x-admin-password");
  const expected = getAdminPassword();
  return Boolean(provided && provided === expected);
}
