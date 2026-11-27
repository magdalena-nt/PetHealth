import type { APIRoute } from "astro";
import { getAppOrigin } from "@/lib/app-origin";
import { createClient } from "@/lib/supabase";

export const prerender = false;

const securityHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};

export const POST: APIRoute = async (context) => {
  const appOrigin = getAppOrigin();
  if (!appOrigin) {
    return new Response("Email confirmation is unavailable.", {
      status: 503,
      headers: securityHeaders,
    });
  }

  const redirect = (path: string) => {
    const response = context.redirect(path, 303);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  };

  if (context.request.headers.get("origin") !== appOrigin.origin) {
    return new Response("Cross-origin confirmation requests are not allowed.", {
      status: 403,
      headers: securityHeaders,
    });
  }

  const contentType = context.request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/x-www-form-urlencoded")) {
    return new Response("Invalid confirmation submission.", {
      status: 400,
      headers: securityHeaders,
    });
  }

  let tokenHash: FormDataEntryValue | null;
  try {
    tokenHash = (await context.request.formData()).get("token_hash");
  } catch {
    return new Response("Invalid confirmation submission.", {
      status: 400,
      headers: securityHeaders,
    });
  }

  if (typeof tokenHash !== "string" || tokenHash.length === 0 || tokenHash.length > 2048) {
    return redirect("/auth/confirm?status=invalid");
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirect("/auth/confirm?status=unavailable");
  }

  try {
    const { error } = await supabase.auth.verifyOtp({ type: "email", token_hash: tokenHash });
    if (error) {
      return redirect("/auth/confirm?status=invalid");
    }
  } catch {
    return redirect("/auth/confirm?status=unavailable");
  }

  return redirect("/dashboard");
};
