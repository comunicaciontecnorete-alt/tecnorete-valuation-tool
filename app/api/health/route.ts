const SERVICE_NAME = "tecnorete-valuation";

function isLeadConfigurationReady() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.LEAD_EMAIL_TO &&
      process.env.LEAD_EMAIL_FROM
  );
}

export function GET() {
  const isReady = isLeadConfigurationReady();

  return Response.json(
    {
      status: isReady ? "ok" : "degraded",
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
    },
    {
      status: isReady ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
