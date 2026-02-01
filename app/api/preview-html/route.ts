import { NextRequest, NextResponse } from "next/server";
import juice from "juice";

export async function POST(request: NextRequest) {
  try {
    const { htmlContent } = await request.json();

    if (!htmlContent) {
      return NextResponse.json({ error: "Missing required field: htmlContent" }, { status: 400 });
    }

    const inlinedHtml = juice(htmlContent);

    return NextResponse.json({ 
      success: true, 
      inlinedHtml 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error processing HTML:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to process HTML", details: errorMessage }, { status: 500 });
  }
}
